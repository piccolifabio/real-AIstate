import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "./supabase";
import { safeRedirect } from "./lib/safeRedirect";

// Pagina di atterraggio dopo che l'utente clicca il link di conferma
// email che Supabase manda al signup. Senza una pagina dedicata, Supabase
// reindirizza alla destination con #access_token=... in hash, ma nessuna
// pagina di destinazione gestisce esplicitamente il parse + redirect →
// utente atterra dove sembra ma senza essere loggato, o atterra in home.
//
// Flow:
// 1. signUp(..., emailRedirectTo = /auth/callback?next=<destination>)
// 2. utente conferma email → Supabase reindirizza qui con hash
// 3. supabase-js parsa l'hash automaticamente (detectSessionInUrl:true default)
//    e popola la sessione → onAuthStateChange si trigga in AuthContext
// 4. al mount facciamo getSession() per essere sicuri che la sessione sia
//    pronta, poi navigate(safeRedirect(next))
//
// AZIONE FOUNDER REQUIRED su Supabase Dashboard: in "Auth → URL Configuration
// → Redirect URLs" devono essere whitelistati:
//   - https://realaistate.ai/auth/callback
//   - https://*.vercel.app/auth/callback
//   - http://localhost:5173/auth/callback

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) {
          setErrorMsg("Verifica fallita: " + error.message);
          return;
        }
        // Se per qualche motivo getSession ritorna ma session è null (es.
        // l'utente arriva su /auth/callback senza essere passato da Supabase),
        // mandiamo comunque alla destination — se è protetta, ProtectedRoute
        // farà bounce a /login normalmente.
        const next = safeRedirect(searchParams.get("next"), "/");
        navigate(next, { replace: true });
      } catch (e) {
        if (!cancelled) setErrorMsg("Errore inatteso. Riprova ad accedere.");
      }
    })();
    return () => {
      cancelled = true;
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
