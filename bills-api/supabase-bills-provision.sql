-- Provision the existing Bills App database only.
-- Run as the Supabase database owner after reviewing the target project.
-- This file contains no credentials and does not provision Electrony Identity.

BEGIN;

CREATE TABLE IF NOT EXISTS public.electrony_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  short_description text,
  website_url text,
  status text NOT NULL DEFAULT 'active',
  display_order integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT electrony_products_slug_key UNIQUE (slug)
);

CREATE TABLE IF NOT EXISTS public.bill_fee_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_reference text NOT NULL,
  customer_id uuid,
  service_type text NOT NULL,
  provider_code text,
  product_code text,
  customer_reference text,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  platform_fee_minor bigint NOT NULL CHECK (platform_fee_minor >= 0),
  provider_fee_minor bigint CHECK (provider_fee_minor IS NULL OR provider_fee_minor >= 0),
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'quoted'
    CHECK (status IN ('quoted', 'used', 'expired', 'cancelled')),
  expires_at timestamptz NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT bill_fee_quotes_quote_reference_key UNIQUE (quote_reference)
);

CREATE TABLE IF NOT EXISTS public.bill_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference text NOT NULL,
  customer_id uuid,
  quote_id uuid NOT NULL REFERENCES public.bill_fee_quotes(id),
  service_type text NOT NULL,
  provider_code text,
  product_code text,
  customer_reference text,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  platform_fee_minor bigint NOT NULL CHECK (platform_fee_minor >= 0),
  provider_fee_minor bigint CHECK (provider_fee_minor IS NULL OR provider_fee_minor >= 0),
  total_amount_minor bigint NOT NULL CHECK (total_amount_minor > 0),
  currency text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN (
      'pending', 'initiated', 'paid', 'failed', 'cancelled', 'refunded', 'review_required'
    )),
  fulfilment_status text NOT NULL DEFAULT 'not_started'
    CHECK (fulfilment_status IN (
      'not_started', 'pending', 'processing', 'fulfilled', 'failed', 'review_required'
    )),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  payment_reference text,
  payment_provider text,
  paid_at timestamptz,
  failure_reason text,
  provider_transaction_reference text,
  fulfilled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bill_orders_order_reference_key UNIQUE (order_reference),
  CONSTRAINT bill_orders_payment_reference_key UNIQUE (payment_reference),
  CONSTRAINT bill_orders_provider_transaction_reference_key UNIQUE (provider_transaction_reference)
);

CREATE TABLE IF NOT EXISTS public.bill_payment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.bill_orders(id),
  provider text NOT NULL,
  merchant_reference text NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'initiated'
    CHECK (status IN ('initiated', 'pending', 'successful', 'failed', 'cancelled', 'review_required')),
  checkout_url text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  provider_reference text,
  verified_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bill_payment_attempts_merchant_reference_key UNIQUE (merchant_reference)
);

CREATE TABLE IF NOT EXISTS public.bill_payment_webhook_events (
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  merchant_reference text,
  processing_status text NOT NULL DEFAULT 'received'
    CHECK (processing_status IN ('received', 'processing', 'processed', 'ignored', 'failed', 'review_required')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_message text,
  processed_at timestamptz,
  CONSTRAINT bill_payment_webhook_events_pkey PRIMARY KEY (provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS public.bill_platform_settings (
  setting_key text PRIMARY KEY,
  setting_value text NOT NULL,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS electrony_products_status_display_name_idx
  ON public.electrony_products (status, display_order, name);
CREATE INDEX IF NOT EXISTS bill_orders_customer_created_idx
  ON public.bill_orders (customer_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS bill_orders_quote_id_idx
  ON public.bill_orders (quote_id);
CREATE INDEX IF NOT EXISTS bill_payment_attempts_order_id_idx
  ON public.bill_payment_attempts (order_id);

DO $$
DECLARE
  runtime_role record;
  table_name text;
  column_name text;
BEGIN
  SELECT * INTO runtime_role
  FROM pg_roles
  WHERE rolname = 'electrony_bills_runtime';

  IF NOT FOUND THEN
    CREATE ROLE electrony_bills_runtime
      LOGIN
      NOSUPERUSER
      NOCREATEDB
      NOCREATEROLE
      NOINHERIT
      NOREPLICATION
      NOBYPASSRLS;
  ELSIF runtime_role.rolsuper
    OR runtime_role.rolcreatedb
    OR runtime_role.rolcreaterole
    OR runtime_role.rolinherit
    OR runtime_role.rolreplication
    OR runtime_role.rolbypassrls
    OR NOT runtime_role.rolcanlogin
    OR EXISTS (
      SELECT 1
      FROM pg_auth_members membership
      WHERE membership.member = runtime_role.oid
    )
    OR EXISTS (
      SELECT 1
      FROM pg_database
      WHERE datdba = runtime_role.oid
    )
  THEN
    RAISE EXCEPTION
      'electrony_bills_runtime must be a dedicated non-owner login with no elevated attributes or memberships';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies policy
    WHERE policy.schemaname = 'public'
      AND policy.tablename IN (
        'electrony_products',
        'bill_fee_quotes',
        'bill_orders',
        'bill_payment_attempts',
        'bill_payment_webhook_events',
        'bill_platform_settings'
      )
      AND (
        'public' = ANY(policy.roles)
        OR 'anon' = ANY(policy.roles)
        OR 'authenticated' = ANY(policy.roles)
      )
  ) THEN
    RAISE EXCEPTION
      'Public, anon, or authenticated policies exist on a Bills table; review them before provisioning';
  END IF;

  FOREACH table_name IN ARRAY ARRAY[
    'electrony_products',
    'bill_fee_quotes',
    'bill_orders',
    'bill_payment_attempts',
    'bill_payment_webhook_events',
    'bill_platform_settings'
  ]
  LOOP
    FOR column_name IN
      SELECT attribute.attname
      FROM pg_attribute attribute
      WHERE attribute.attrelid = format('public.%I', table_name)::regclass
        AND attribute.attnum > 0
        AND NOT attribute.attisdropped
    LOOP
      EXECUTE format(
        'REVOKE ALL PRIVILEGES (%I) ON TABLE public.%I FROM PUBLIC, anon, authenticated, electrony_bills_runtime',
        column_name,
        table_name
      );
    END LOOP;
  END LOOP;
END;
$$;

ALTER TABLE public.electrony_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_fee_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payment_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_platform_settings ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE
  public.electrony_products,
  public.bill_fee_quotes,
  public.bill_orders,
  public.bill_payment_attempts,
  public.bill_payment_webhook_events,
  public.bill_platform_settings
FROM PUBLIC, anon, authenticated, electrony_bills_runtime;

REVOKE CREATE ON SCHEMA public FROM electrony_bills_runtime;
GRANT USAGE ON SCHEMA public TO electrony_bills_runtime;

GRANT SELECT ON TABLE
  public.electrony_products,
  public.bill_platform_settings
TO electrony_bills_runtime;

GRANT SELECT, INSERT, UPDATE ON TABLE
  public.bill_fee_quotes,
  public.bill_orders,
  public.bill_payment_attempts,
  public.bill_payment_webhook_events
TO electrony_bills_runtime;

DROP POLICY IF EXISTS electrony_bills_runtime_select ON public.electrony_products;
CREATE POLICY electrony_bills_runtime_select
  ON public.electrony_products FOR SELECT TO electrony_bills_runtime
  USING (true);

DROP POLICY IF EXISTS electrony_bills_runtime_select ON public.bill_fee_quotes;
DROP POLICY IF EXISTS electrony_bills_runtime_insert ON public.bill_fee_quotes;
DROP POLICY IF EXISTS electrony_bills_runtime_update ON public.bill_fee_quotes;
CREATE POLICY electrony_bills_runtime_select
  ON public.bill_fee_quotes FOR SELECT TO electrony_bills_runtime
  USING (true);
CREATE POLICY electrony_bills_runtime_insert
  ON public.bill_fee_quotes FOR INSERT TO electrony_bills_runtime
  WITH CHECK (true);
CREATE POLICY electrony_bills_runtime_update
  ON public.bill_fee_quotes FOR UPDATE TO electrony_bills_runtime
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS electrony_bills_runtime_select ON public.bill_orders;
DROP POLICY IF EXISTS electrony_bills_runtime_insert ON public.bill_orders;
DROP POLICY IF EXISTS electrony_bills_runtime_update ON public.bill_orders;
CREATE POLICY electrony_bills_runtime_select
  ON public.bill_orders FOR SELECT TO electrony_bills_runtime
  USING (true);
CREATE POLICY electrony_bills_runtime_insert
  ON public.bill_orders FOR INSERT TO electrony_bills_runtime
  WITH CHECK (true);
CREATE POLICY electrony_bills_runtime_update
  ON public.bill_orders FOR UPDATE TO electrony_bills_runtime
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS electrony_bills_runtime_select ON public.bill_payment_attempts;
DROP POLICY IF EXISTS electrony_bills_runtime_insert ON public.bill_payment_attempts;
DROP POLICY IF EXISTS electrony_bills_runtime_update ON public.bill_payment_attempts;
CREATE POLICY electrony_bills_runtime_select
  ON public.bill_payment_attempts FOR SELECT TO electrony_bills_runtime
  USING (true);
CREATE POLICY electrony_bills_runtime_insert
  ON public.bill_payment_attempts FOR INSERT TO electrony_bills_runtime
  WITH CHECK (true);
CREATE POLICY electrony_bills_runtime_update
  ON public.bill_payment_attempts FOR UPDATE TO electrony_bills_runtime
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS electrony_bills_runtime_select ON public.bill_payment_webhook_events;
DROP POLICY IF EXISTS electrony_bills_runtime_insert ON public.bill_payment_webhook_events;
DROP POLICY IF EXISTS electrony_bills_runtime_update ON public.bill_payment_webhook_events;
CREATE POLICY electrony_bills_runtime_select
  ON public.bill_payment_webhook_events FOR SELECT TO electrony_bills_runtime
  USING (true);
CREATE POLICY electrony_bills_runtime_insert
  ON public.bill_payment_webhook_events FOR INSERT TO electrony_bills_runtime
  WITH CHECK (true);
CREATE POLICY electrony_bills_runtime_update
  ON public.bill_payment_webhook_events FOR UPDATE TO electrony_bills_runtime
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS electrony_bills_runtime_select ON public.bill_platform_settings;
CREATE POLICY electrony_bills_runtime_select
  ON public.bill_platform_settings FOR SELECT TO electrony_bills_runtime
  USING (true);

COMMIT;
