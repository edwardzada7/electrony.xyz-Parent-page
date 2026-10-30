BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.electrony_customer_mappings (
  supabase_user_id uuid PRIMARY KEY,
  bills_customer_id text UNIQUE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.virtual_card_customers (
  supabase_user_id uuid PRIMARY KEY REFERENCES public.electrony_customer_mappings(supabase_user_id),
  provider text NOT NULL DEFAULT 'marplerad',
  provider_customer_ref text UNIQUE,
  provider_status text NOT NULL DEFAULT 'unconfigured',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.virtual_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id uuid NOT NULL REFERENCES public.electrony_customer_mappings(supabase_user_id),
  provider_card_ref text NOT NULL UNIQUE,
  card_status text NOT NULL DEFAULT 'unknown',
  currency text,
  last_four text,
  card_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT virtual_cards_safe_metadata CHECK (card_metadata = '{}'::jsonb OR NOT (card_metadata::text ~* '(cvv|cvc|card_number|pan|secret|token)'))
);

CREATE TABLE IF NOT EXISTS public.gift_card_product_refs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_product_ref text NOT NULL,
  provider_updated_at timestamptz,
  active boolean NOT NULL DEFAULT false,
  product_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_product_ref)
);

CREATE TABLE IF NOT EXISTS public.gift_card_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id uuid NOT NULL REFERENCES public.electrony_customer_mappings(supabase_user_id),
  product_ref_id uuid NOT NULL REFERENCES public.gift_card_product_refs(id),
  order_reference text NOT NULL UNIQUE,
  provider_order_ref text UNIQUE,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  fulfilment_status text NOT NULL DEFAULT 'not_started',
  reconciliation_status text NOT NULL DEFAULT 'not_required',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.financial_provider_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  event_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  processing_status text NOT NULL DEFAULT 'received',
  processing_error text,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  UNIQUE(provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS public.financial_service_audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  supabase_user_id uuid,
  service text NOT NULL,
  event_type text NOT NULL,
  event_reference text,
  event_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ownership is enforced by the verified server-side Bills/Accounts API because the
-- Railway runtime role is a PostgreSQL login and may not receive Supabase auth.uid()
-- request context. Supabase-specific JWT RLS must be added separately only after the
-- target role/context has been verified.

CREATE INDEX IF NOT EXISTS virtual_cards_user_idx ON public.virtual_cards(supabase_user_id);
CREATE INDEX IF NOT EXISTS gift_card_orders_user_idx ON public.gift_card_orders(supabase_user_id);
CREATE INDEX IF NOT EXISTS gift_card_orders_payment_idx ON public.gift_card_orders(payment_status, fulfilment_status);
CREATE INDEX IF NOT EXISTS provider_webhook_provider_event_idx
  ON public.financial_provider_webhook_events(provider, provider_event_id);
CREATE INDEX IF NOT EXISTS financial_audit_user_created_idx
  ON public.financial_service_audit_events(supabase_user_id, created_at DESC);

-- Apply table privileges only when the documented runtime role exists. This makes
-- the migration safe on databases that do not yet contain the Bills role.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'electrony_bills_runtime') THEN
    GRANT SELECT, INSERT, UPDATE ON TABLE
      public.electrony_customer_mappings,
      public.virtual_card_customers,
      public.virtual_cards,
      public.gift_card_product_refs,
      public.gift_card_orders,
      public.financial_provider_webhook_events,
      public.financial_service_audit_events
      TO electrony_bills_runtime;
    GRANT USAGE, SELECT ON SEQUENCE public.financial_service_audit_events_id_seq
      TO electrony_bills_runtime;
  END IF;
END
$$;

COMMIT;
