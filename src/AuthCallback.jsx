import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "./supabase";
import { safeRedirect } from "./lib/safeRedirect";

// Pagina di atterraggio dopo che l'utente clicca il link di conferma email
// che Supabase manda al signup. Senza una pagina dedicata, Supabase reindirizza
// alla destination con #access_token=... o ?code=... ma nessuna pagina di
// destinazione gestisce esplicitamente il parse + redirect → utente atterra
// dove sembra ma senza essere loggato, o atterra in home.
//
// supabase-js 2.x default flowType = PKCE: l'email link contiene
// ?code=<auth_code> come query param (NON hash). detectSessionInUrl=true
// (default) prova a fare l'exchange automaticamente al boot del client, ma
// può race con il mount di AuthCallback o fallire silenziosamente se il
// code_verifier non è in localStorage. Per questo facciamo exchange ESPLICITO
// quando ?code= è presente, gestendo l'errore "already used" come success
// (significa che supabase-js l'ha già scambiato auto).
//
// Caso bug 12/05 (terza iterazione fallita): founder ha confermato che l'URL
// bar va direttamente in / senza mai mostrare /auth/callback. Cause probabili:
// (1) email template Supabase customizzato non usa {{ .ConfirmationURL }}
// (2) Site URL Supabase ha trailing slash o valore strano
// (3) PKCE exchange fallisce e Supabase fa fallback al Site URL
// Per diagnosticare scriviamo log persistente in localStorage che il founder
// può dumpare se il bug persiste anche dopo questo fix.
//
// AZIONE FOUNDER REQUIRED su Supabase Dashboard:
//   - Auth → URL Configuration → Redirect URLs: whitelist
//     https://realaistate.ai/auth/callback, https://*.vercel.app/auth/callback,
//     http://localhost:5173/auth/callback
//   - Auth → URL Configuration → Site URL: https://realaistate.ai (no trailing /)
//   - Auth → Email Templates → "Confirm signup": il body HTML del link deve
//     contenere {{ .ConfirmationURL }} (non URL hardcoded).

const DEBUG_KEY = "rai:auth-callback-debug";
const DEBUG_MAX_ENTRIES = 5;

function pushDebug(entry) {
  try {
    const prev = JSON.parse(localStorage.getItem(DEBUG_KEY) || "[]");
    const next = [...prev, { ...entry, ts: new Date().toISOString() }].slice(-DEBUG_MAX_ENTRIES);
    localStorage.setItem(DEBUG_KEY, JSON.stringify(next));
  } catch {
    // localStorage può fallire in modalità privata estrema o quota piena —
    // non blocchiamo il flusso auth per un log diagnostico.
  }
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    let listenerSub = null;
    let fallbackTimer = null;

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error") || searchParams.get("error_description");
    const next = safeRedirect(searchParams.get("next"), "/");

    const doNavigate = (sessionEmail, source) => {
      if (cancelled) return;
      pushDebug({
        event: "navigate",
        source,
        next,
        sessionEmail: sessionEmail || null,
        url: window.location.href,
      });
      navigate(next, { replace: true });
    };

    (async () => {
      pushDebug({
        event: "mount",
        url: window.location.href,
        hasCode: !!code,
        hasHash: !!window.location.hash,
        hasError: !!errorParam,
        nextParam: searchParams.get("next"),
        nextResolved: next,
      });

      // Caso errore esplicito da Supabase (es. link scaduto, già usato): non
      // possiamo recuperare, mostriamo errore e bottone login.
      if (errorParam) {
        pushDebug({ event: "error-param", errorParam });
        setErrorMsg("Il link di conferma non è valido o è scaduto. Riprova ad accedere.");
        return;
      }

      // Caso PKCE: se ?code= è presente, facciamo exchange esplicito.
      // Se supabase-js l'ha già scambiato auto (race), l'errore tipico è
      // "Auth code is invalid or already used" — lo trattiamo come success
      // silenzioso e procediamo con getSession.
      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (exchangeError) {
            const msg = String(exchangeError.message || "");
            const alreadyUsed = /already used|invalid/i.test(msg);
            pushDebug({ event: "exchange-error", message: msg, treatedAs: alreadyUsed ? "success" : "failure" });
            if (!alreadyUsed) {
              setErrorMsg("Verifica fallita: " + msg);
              return;
            }
          } else {
            pushDebug({ event: "exchange-ok" });
          }
        } catch (e) {
          if (cancelled) return;
          pushDebug({ event: "exchange-throw", message: String(e?.message || e) });
          // Continuiamo comunque — getSession può ancora restituire una sessione.
        }
      }

      // Verifichiamo la sessione. Se è già attiva, navighiamo subito.
      try {
        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) {
          pushDebug({ event: "getSession-error", message: String(error.message) });
          setErrorMsg("Verifica fallita: " + error.message);
          return;
        }
        if (data?.session) {
          doNavigate(data.session.user?.email, "getSession");
          return;
        }
      } catch (e) {
        if (cancelled) return;
        pushDebug({ event: "getSession-throw", message: String(e?.message || e) });
      }

      // Sessione non ancora pronta: aspettiamo l'evento SIGNED_IN da
      // onAuthStateChange con un timeout di sicurezza (800ms). Se il timer
      // scade prima dell'evento navighiamo comunque — la pagina di
      // destinazione gestirà il caso "non loggato" (ProtectedRoute → /login).
      pushDebug({ event: "waiting-for-listener" });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (cancelled) return;
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          if (session) {
            doNavigate(session.user?.email, "listener:" + event);
          }
        }
      });
      listenerSub = subscription;

      fallbackTimer = setTimeout(() => {
        if (cancelled) return;
        pushDebug({ event: "fallback-timeout-navigate" });
        navigate(next, { replace: true });
      }, 800);
    })();

    return () => {
      cancelled = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (listenerSub) listenerSub.unsubscribe();
    };
  }, [navigate, searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--black, #0a0a0a)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        color: "var(--white, #f7f5f0)",
      }}
    >
      {errorMsg ? (
        <>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.4rem", marginBottom: "1rem" }}>
            Verifica non riuscita
          </div>
          <div style={{ fontSize: "0.9rem", color: "rgba(247,245,240,0.6)", marginBottom: "2rem", maxWidth: 480, lineHeight: 1.6 }}>
            {errorMsg}
          </div>
          <a
            href="/login"
            style={{
              background: "var(--red, #d93025)",
              color: "white",
              padding: "0.9rem 1.8rem",
              borderRadius: 2,
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Vai al login →
          </a>
        </>
      ) : (
        <>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", marginBottom: "0.8rem" }}>
            Stiamo verificando la tua email...
          </div>
          <div style={{ fontSize: "0.85rem", color: "rgba(247,245,240,0.5)" }}>
            Un attimo, ti reindirizziamo.
          </div>
        </>
      )}
    </div>
  );
}
