(function () {
  "use strict";

  const config = window.ElectronyConfig || {};
  const projectUrl = String(config.identityProjectUrl || "").trim();
  const publishableKey = String(config.identityPublishableKey || "").trim();
  const AUTH_ID_KEY = "electrony_oauth_authorization_id";

  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const authError = params.get("error_description") || hashParams.get("error_description")
    || params.get("error") || hashParams.get("error");
  const authorizationIdFromUrl = params.get("authorization_id");

  function setStatus(element, message, tone) {
    if (!element) return;
    element.textContent = message;
    element.hidden = !message;
    if (tone) element.dataset.tone = tone;
    else delete element.dataset.tone;
  }

  function disable(button, disabled) {
    if (button) button.disabled = disabled;
  }

  function storeAuthorizationId(value) {
    if (!value) return;
    sessionStorage.setItem(AUTH_ID_KEY, value);
  }

  function readAuthorizationId() {
    return authorizationIdFromUrl || sessionStorage.getItem(AUTH_ID_KEY);
  }

  function clearAuthorizationId() {
    sessionStorage.removeItem(AUTH_ID_KEY);
  }

  function accountRedirectUrl() {
    const origin = window.location.origin;
    if (window.location.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      throw new Error("Electrony Account production redirects must use HTTPS.");
    }
    return `${origin}/`;
  }

  function getClient() {
    if (!projectUrl || !publishableKey) return null;
    if (!window.supabase?.createClient) return null;
    return window.supabase.createClient(projectUrl, publishableKey, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  function initializeAccountApp() {
    const form = document.getElementById("auth-form");
    if (!form) return;

    const status = document.getElementById("app-status");
    const nameField = document.getElementById("name-field");
    const passwordField = document.getElementById("password-field");
    const tabs = document.querySelectorAll("[data-view]");
    const submitButton = document.getElementById("submit-button");
    const recoverButton = document.getElementById("recover-button");
    const resendButton = document.getElementById("resend-button");
    const signoutButton = document.getElementById("signout-button");
    const recoveryForm = document.getElementById("recovery-form");
    const updateForm = document.getElementById("update-form");
    let currentView = params.get("view") === "signup" ? "signup" : "signin";
    let lastEmailForConfirmation = "";
    const client = getClient();

    if (authorizationIdFromUrl) storeAuthorizationId(authorizationIdFromUrl);

    if (!client) {
      setStatus(status, "Authentication configuration is incomplete. Sign-in is unavailable until the identity project URL and public publishable key are configured.", "warning");
      form.querySelectorAll("input, button").forEach((element) => { element.disabled = true; });
      return;
    }

    function showView(view) {
      currentView = view;
      recoveryForm.hidden = view !== "recovery";
      updateForm.hidden = view !== "update-password";
      form.hidden = view === "recovery" || view === "update-password";
      document.querySelector(".view-tabs").hidden = view === "recovery" || view === "update-password";
      recoverButton.hidden = view === "recovery" || view === "update-password";
      resendButton.hidden = true;
      signoutButton.hidden = true;
      nameField.hidden = view !== "signup";
      document.getElementById("full-name").required = view === "signup";
      passwordField.hidden = false;
      document.getElementById("password").autocomplete = view === "signup" ? "new-password" : "current-password";
      submitButton.textContent = view === "signup" ? "Create account" : "Sign in";
      tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
      setStatus(status, "", null);
    }

    tabs.forEach((tab) => tab.addEventListener("click", () => {
      if (tab.dataset.view === "signin" || tab.dataset.view === "signup") showView(tab.dataset.view);
    }));

    recoverButton.addEventListener("click", () => showView("recovery"));
    document.querySelectorAll(".back-button").forEach((button) => button.addEventListener("click", () => showView("signin")));

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus(status, "", null);
      if (!form.reportValidity()) return;
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      lastEmailForConfirmation = email;
      disable(submitButton, true);
      try {
        if (currentView === "signup") {
          const fullName = document.getElementById("full-name").value.trim();
          const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: accountRedirectUrl(),
              data: fullName ? { full_name: fullName } : undefined
            }
          });
          if (error) throw error;
          if (data.session) {
            await handleAuthenticated(client);
          } else {
            setStatus(status, "Check your email to confirm your Electrony account. The confirmation link will return you here.", "success");
            resendButton.hidden = false;
          }
        } else {
          const { error } = await client.auth.signInWithPassword({ email, password });
          if (error) throw error;
          await handleAuthenticated(client);
        }
      } catch (error) {
        setStatus(status, error.message || "Authentication could not be completed.", "error");
      } finally {
        disable(submitButton, false);
      }
    });

    recoveryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus(status, "", null);
      if (!recoveryForm.reportValidity()) return;
      const button = recoveryForm.querySelector('button[type="submit"]');
      disable(button, true);
      try {
        const email = document.getElementById("recovery-email").value.trim();
        const { error } = await client.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/?view=update-password`
        });
        if (error) throw error;
        setStatus(status, "If an account exists for that email, a password reset link has been sent.", "success");
      } catch (error) {
        setStatus(status, error.message || "Password recovery could not be started.", "error");
      } finally {
        disable(button, false);
      }
    });

    updateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus(status, "", null);
      if (!updateForm.reportValidity()) return;
      const button = updateForm.querySelector('button[type="submit"]');
      disable(button, true);
      try {
        const password = document.getElementById("new-password").value;
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        setStatus(status, "Your password has been updated.", "success");
        window.history.replaceState({}, "", window.location.pathname);
        showView("signin");
      } catch (error) {
        setStatus(status, error.message || "The password could not be updated. The reset link may have expired.", "error");
      } finally {
        disable(button, false);
      }
    });

    resendButton.addEventListener("click", async () => {
      if (!lastEmailForConfirmation) return;
      disable(resendButton, true);
      try {
        const { error } = await client.auth.resend({
          type: "signup",
          email: lastEmailForConfirmation,
          options: { emailRedirectTo: accountRedirectUrl() }
        });
        if (error) throw error;
        setStatus(status, "A new confirmation email has been sent.", "success");
      } catch (error) {
        setStatus(status, error.message || "The confirmation email could not be resent.", "error");
      } finally {
        disable(resendButton, false);
      }
    });

    async function handleAuthenticated(activeClient) {
      const authId = readAuthorizationId();
      if (authId) {
        window.location.assign(`/oauth/consent/?authorization_id=${encodeURIComponent(authId)}`);
        return;
      }
      setStatus(status, "You are signed in to Electrony.", "success");
      signoutButton.hidden = false;
      form.hidden = true;
      recoverButton.hidden = true;
    }

    signoutButton.addEventListener("click", async () => {
      disable(signoutButton, true);
      const { error } = await client.auth.signOut();
      clearAuthorizationId();
      if (error) setStatus(status, error.message || "Sign-out could not be completed.", "error");
      else {
        setStatus(status, "You have been signed out.", "success");
        window.location.assign("/");
      }
      disable(signoutButton, false);
    });

    client.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") showView("update-password");
      if (event === "SIGNED_IN" && params.get("view") !== "update-password" && !authError) {
        await handleAuthenticated(client);
      }
    });

    if (authError) {
      const expired = /expired|otp_expired/i.test(authError);
      setStatus(status, expired ? "This confirmation or recovery link has expired. Request a new link." : "Authentication failed. Start again from the sign-in page.", expired ? "warning" : "error");
    }

    const code = params.get("code");
    if (code) {
      client.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setStatus(status, error.message || "This link is invalid or has expired.", "error");
        else {
          if (params.get("view") === "update-password") {
            window.history.replaceState({}, "", "/?view=update-password");
            showView("update-password");
          } else {
            window.history.replaceState({}, "", "/");
            handleAuthenticated(client);
          }
        }
      });
    } else if (params.get("view") === "update-password") {
      showView("update-password");
    } else {
      showView(currentView);
    }
  }

  async function initializeConsentApp() {
    const status = document.getElementById("consent-status");
    const content = document.getElementById("consent-content");
    if (!status || !content) return;
    const authorizationId = params.get("authorization_id") || sessionStorage.getItem(AUTH_ID_KEY);
    const client = getClient();

    if (!authorizationId) {
      setStatus(status, "This authorization request is missing its authorization_id. It cannot be approved safely.", "error");
      return;
    }
    storeAuthorizationId(authorizationId);
    if (!client) {
      setStatus(status, "OAuth consent is unavailable because identity configuration is incomplete.", "warning");
      return;
    }

    try {
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData?.user) {
        window.location.assign(`/?view=signin&authorization_id=${encodeURIComponent(authorizationId)}`);
        return;
      }

      const { data: details, error } = await client.auth.oauth.getAuthorizationDetails(authorizationId);
      if (error || !details) throw error || new Error("The authorization request could not be loaded.");
      if (!("authorization_id" in details) && details.redirect_url) {
        clearAuthorizationId();
        window.location.assign(details.redirect_url);
        return;
      }

      const clientName = details.client?.name || "Registered application";
      document.getElementById("client-name").textContent = clientName;
      const scopeList = document.getElementById("scope-list");
      scopeList.replaceChildren();
      const scopes = String(details.scope || "").trim().split(/\s+/).filter(Boolean);
      if (!scopes.length) {
        const item = document.createElement("li");
        item.textContent = "No additional identity scopes";
        scopeList.appendChild(item);
      } else {
        scopes.forEach((scope) => {
          const item = document.createElement("li");
          item.textContent = scope;
          scopeList.appendChild(item);
        });
      }
      setStatus(status, "", null);
      content.hidden = false;

      document.getElementById("approve-button").addEventListener("click", async () => {
        const button = document.getElementById("approve-button");
        disable(button, true);
        const { data: result, error: approveError } = await client.auth.oauth.approveAuthorization(authorizationId, {
          skipBrowserRedirect: true
        });
        if (approveError) setStatus(status, approveError.message || "The authorization request could not be approved.", "error");
        else if (result?.redirect_url) window.location.assign(result.redirect_url);
        disable(button, false);
      });

      document.getElementById("deny-button").addEventListener("click", async () => {
        const button = document.getElementById("deny-button");
        disable(button, true);
        const { data: result, error: denyError } = await client.auth.oauth.denyAuthorization(authorizationId, {
          skipBrowserRedirect: true
        });
        if (denyError) setStatus(status, denyError.message || "The authorization request could not be denied.", "error");
        else if (result?.redirect_url) window.location.assign(result.redirect_url);
        disable(button, false);
      });
    } catch (error) {
      const message = /expired|invalid|not found/i.test(error.message || "")
        ? "This authorization request is invalid or has expired."
        : "The authorization request could not be loaded.";
      setStatus(status, message, "error");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("consent-content")) initializeConsentApp();
      else initializeAccountApp();
    });
  } else if (document.getElementById("consent-content")) {
    initializeConsentApp();
  } else {
    initializeAccountApp();
  }
})();
