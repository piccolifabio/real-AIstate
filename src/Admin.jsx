import { useState, useEffect } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [scuse, setScuse] = useState([]);
  const [immobili, setImmobili] = useState([]);
  const [tab, setTab] = useState("immobili");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState({});
  const [feedback, setFeedback] = useState("");

  const fetchData = async (key) => {
    const [scuseRes, immRes] = await Promise.all([
      fetch("/api/admin-scuse", { headers: { "x-admin-key": key } }),
      fetch("/api/admin-immobili", { headers: { "x-admin-key": key } }),
    ]);
    if (scuseRes.status === 401 || immRes.status === 401) {
      throw new Error("AUTH");
    }
    const scuseData = scuseRes.ok ? await scuseRes.json() : [];
    const immData = immRes.ok ? await immRes.json() : [];
    return { scuseData, immData };
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { scuseData, immData } = await fetchData(password);
      setScuse(Array.isArray(scuseData) ? scuseData : []);
      setImmobili(Array.isArray(immData) ? immData : []);
      setAuthed(true);
    } catch (e) {
      if (String(e?.message) === "AUTH") setError("Password errata.");
      else setError("Errore di connessione.");
    }
    setLoading(false);
  };

  const refreshImmobili = async () => {
    try {
      const r = await fetch("/api/admin-immobili", { headers: { "x-admin-key": password } });
      if (r.ok) setImmobili(await r.json());
    } catch {
      // ignora
    }
  };

  const approva = async (im) => {
    if (!confirm(`Pubblicare l'annuncio "${im.titolo || im.indirizzo}"?`)) return;
    setProcessing((p) => ({ ...p, [im.id]: "approva" }));
    setFeedback("");
    try {
      const r = await fetch("/api/admin-pubblica-immobile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": password },
        body: JSON.stringify({ immobile_id: im.id }),
      });
      const data = await r.json();
      if (!r.ok) {
        setFeedback(`Errore approvazione: ${data?.error || r.status}`);
      } else {
        const bits = ["Pubblicato"];
        if (data.ai_generated) bits.push("AI generata");
        else if (data.ai_skipped) bits.push("AI fallita (vedi log)");
        if (data.email_sent) bits.push("email inviata");
        else if (data.venditore_email) bits.push("email NON inviata");
        else bits.push("email venditore non disponibile");
        setFeedback(`#${im.id} → ${bits.join(", ")}.`);
        await refreshImmobili();
      }
    } catch (e) {
      setFeedback(`Errore di rete: ${String(e?.message || e)}`);
    }
    setProcessing((p) => {
      const { [im.id]: _, ...rest } = p;
      return rest;
    });
  };

  const rifiuta = async (im) => {
    const motivo = prompt(
      `Motivo del rifiuto (opzionale, finirà nell'email al venditore):`,
      ""
    );
    if (motivo === null) return; // cancel
    if (!confirm(`Riportare l'annuncio "${im.titolo || im.indirizzo}" in bozza?`)) return;
    setProcessing((p) => ({ ...p, [im.id]: "rifiuta" }));
    setFeedback("");
    try {
      const r = await fetch("/api/admin-rifiuta-immobile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": password },
        body: JSON.stringify({ immobile_id: im.id, motivo }),
      });
      const data = await r.json();
      if (!r.ok) {
        setFeedback(`Errore rifiuto: ${data?.error || r.status}`);
      } else {
        const bits = ["Riportato in draft"];
        if (data.email_sent) bits.push("email inviata");
        else if (data.venditore_email) bits.push("email NON inviata");
        else bits.push("email venditore non disponibile");
        setFeedback(`#${im.id} → ${bits.join(", ")}.`);
        await refreshImmobili();
      }
    } catch (e) {
      setFeedback(`Errore di rete: ${String(e?.message || e)}`);
    }
    setProcessing((p) => {
      const { [im.id]: _, ...rest } = p;
      return rest;
    });
  };

  const filtered = scuse.filter(s =>
    s.scusa?.toLowerCase().includes(search.toLowerCase()) ||
    s.risposta?.toLowerCase().includes(search.toLowerCase())
  );

  const fmtDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("it-IT", {
          day: "2-digit", month: "2-digit", year: "2-digit",
          hour: "2-digit", minute: "2-digit",
        })
      : "—";

  const fmtPrice = (n) =>
    n ? `€ ${Number(n).toLocaleString("it-IT")}` : "—";

  if (!authed) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020; --muted: #6b6b6b; --surface: #141414; --border: rgba(247,245,240,0.08); }
        body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); }
        .admin-login { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--black); }
        .admin-login-box { background: var(--surface); border: 1px solid var(--border); padding: 3rem; border-radius: 4px; width: 100%; max-width: 380px; }
        .admin-login-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: var(--white); margin-bottom: 0.3rem; }
        .admin-login-logo span { color: var(--red); }
        .admin-login-sub { font-size: 0.8rem; color: var(--muted); margin-bottom: 2rem; }
        .admin-login-input { width: 100%; padding: 0.9rem 1rem; background: rgba(247,245,240,0.05); border: 1px solid var(--border); color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.95rem; border-radius: 2px; outline: none; margin-bottom: 1rem; }
        .admin-login-input:focus { border-color: var(--red); }
        .admin-login-btn { width: 100%; padding: 0.9rem; background: var(--red); color: white; border: none; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 2px; }
        .admin-login-btn:hover { background: var(--red-dark); }
        .admin-login-error { font-size: 0.82rem; color: var(--red); margin-top: 0.8rem; }
      `}</style>
      <div className="admin-login">
        <div className="admin-login-box">
          <div className="admin-login-logo">Real<span>AI</span>state</div>
          <div className="admin-login-sub">Area amministrativa</div>
          <input
            className="admin-login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
          <button className="admin-login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "..." : "Accedi →"}
          </button>
          {error && <div className="admin-login-error">{error}</div>}
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020; --gold: #c9a84c; --green: #4ade80; --muted: #6b6b6b; --surface: #141414; --border: rgba(247,245,240,0.08); }
        body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); }
        .admin-wrap { min-height: 100vh; background: var(--black); padding: 2rem 3rem; }
        .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 1rem; }
        .admin-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; color: var(--white); }
        .admin-logo span { color: var(--red); }
        .admin-stats { display: flex; gap: 2rem; }
        .admin-stat { text-align: right; }
        .admin-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--white); line-height: 1; }
        .admin-stat-num.warn { color: var(--gold); }
        .admin-stat-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
        .admin-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 2rem; }
        .admin-tab { background: none; border: none; border-bottom: 2px solid transparent; padding: 0.85rem 1.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(247,245,240,0.4); cursor: pointer; margin-bottom: -1px; transition: all 0.15s; }
        .admin-tab:hover { color: var(--white); }
        .admin-tab.active { color: var(--white); border-bottom-color: var(--red); }
        .admin-tab .pill { display: inline-block; margin-left: 0.5rem; padding: 0.1rem 0.55rem; border-radius: 99px; background: var(--gold); color: var(--black); font-size: 0.7rem; font-weight: 700; letter-spacing: 0; }

        .admin-feedback { background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.3); color: var(--green); padding: 0.8rem 1rem; border-radius: 2px; font-size: 0.85rem; margin-bottom: 1.5rem; }

        .admin-search { width: 100%; max-width: 480px; padding: 0.8rem 1rem; background: rgba(247,245,240,0.05); border: 1px solid var(--border); color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; border-radius: 2px; outline: none; margin-bottom: 2rem; }
        .admin-search:focus { border-color: var(--red); }
        .admin-search::placeholder { color: var(--muted); }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); text-align: left; padding: 0.8rem 1rem; border-bottom: 1px solid var(--border); }
        .admin-table td { padding: 1.2rem 1rem; border-bottom: 1px solid rgba(247,245,240,0.04); vertical-align: top; font-size: 0.88rem; line-height: 1.6; }
        .admin-table tr:hover td { background: rgba(247,245,240,0.02); }
        .admin-td-date { color: var(--muted); white-space: nowrap; font-size: 0.75rem; }
        .admin-td-scusa { color: rgba(247,245,240,0.5); font-style: italic; max-width: 320px; }
        .admin-td-risposta { color: var(--white); max-width: 460px; }
        .admin-td-fonte { color: var(--muted); font-size: 0.72rem; }
        .admin-td-titolo { color: var(--white); font-weight: 500; }
        .admin-td-indirizzo { color: rgba(247,245,240,0.6); font-size: 0.82rem; }
        .admin-td-venditore { color: rgba(247,245,240,0.7); font-size: 0.82rem; }
        .admin-td-venditore .em { color: var(--muted); display: block; font-size: 0.74rem; }
        .admin-td-prezzo { color: var(--white); font-weight: 500; white-space: nowrap; }
        .admin-actions { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
        .admin-link { color: var(--gold); text-decoration: none; font-size: 0.78rem; padding: 0.45rem 0.7rem; border: 1px solid rgba(201,168,76,0.3); border-radius: 2px; transition: all 0.15s; }
        .admin-link:hover { background: rgba(201,168,76,0.1); color: var(--white); }
        .admin-btn-approva { background: var(--green); color: var(--black); border: none; padding: 0.5rem 0.9rem; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; border-radius: 2px; transition: opacity 0.15s; }
        .admin-btn-approva:hover:not(:disabled) { opacity: 0.85; }
        .admin-btn-rifiuta { background: transparent; color: var(--red); border: 1px solid rgba(217,48,37,0.4); padding: 0.5rem 0.9rem; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; border-radius: 2px; transition: all 0.15s; }
        .admin-btn-rifiuta:hover:not(:disabled) { background: rgba(217,48,37,0.1); color: var(--white); }
        .admin-btn-approva:disabled, .admin-btn-rifiuta:disabled { opacity: 0.4; cursor: not-allowed; }
        .admin-empty { text-align: center; color: var(--muted); padding: 4rem; font-size: 0.9rem; }
        @media (max-width: 900px) {
          .admin-wrap { padding: 1.5rem; }
          .admin-table th:nth-child(4), .admin-table td:nth-child(4) { display: none; }
        }
      `}</style>
      <div className="admin-wrap">
        <div className="admin-header">
          <div className="admin-logo">Real<span>AI</span>state</div>
          <div className="admin-stats">
            <div className="admin-stat">
              <div className={"admin-stat-num " + (immobili.length > 0 ? "warn" : "")}>{immobili.length}</div>
              <div className="admin-stat-label">Pending review</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-num">{scuse.length}</div>
              <div className="admin-stat-label">Scuse totali</div>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={"admin-tab " + (tab === "immobili" ? "active" : "")} onClick={() => setTab("immobili")}>
            Pubblicazioni{immobili.length > 0 && <span className="pill">{immobili.length}</span>}
          </button>
          <button className={"admin-tab " + (tab === "scuse" ? "active" : "")} onClick={() => setTab("scuse")}>
            Scuse
          </button>
        </div>

        {feedback && <div className="admin-feedback">{feedback}</div>}

        {tab === "immobili" && (
          immobili.length === 0 ? (
            <div className="admin-empty">Nessun immobile in attesa di revisione.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Submit</th>
                  <th>Annuncio</th>
                  <th>Venditore</th>
                  <th>Prezzo</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {immobili.map((im) => (
                  <tr key={im.id}>
                    <td className="admin-td-date">{fmtDate(im.created_at)}</td>
                    <td>
                      <div className="admin-td-titolo">{im.titolo || `Immobile #${im.id}`}</div>
                      <div className="admin-td-indirizzo">{im.indirizzo || "—"}</div>
                    </td>
                    <td className="admin-td-venditore">
                      {im.venditore_nome || "—"}
                      <span className="em">{im.venditore_email || "(email non disponibile)"}</span>
                    </td>
                    <td className="admin-td-prezzo">{fmtPrice(im.prezzo)}</td>
                    <td>
                      <div className="admin-actions">
                        <a className="admin-link" href={`/immobili/${im.id}`} target="_blank" rel="noreferrer">Preview ↗</a>
                        <button
                          className="admin-btn-approva"
                          disabled={!!processing[im.id]}
                          onClick={() => approva(im)}
                        >
                          {processing[im.id] === "approva" ? "..." : "Approva"}
                        </button>
                        <button
                          className="admin-btn-rifiuta"
                          disabled={!!processing[im.id]}
                          onClick={() => rifiuta(im)}
                        >
                          {processing[im.id] === "rifiuta" ? "..." : "Rifiuta"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {tab === "scuse" && (
          <>
            <input
              className="admin-search"
              type="text"
              placeholder="Cerca per scusa o risposta..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {filtered.length === 0 ? (
              <div className="admin-empty">Nessuna scusa trovata.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Scusa</th>
                    <th>Risposta AI</th>
                    <th>Fonte</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={i}>
                      <td className="admin-td-date">{fmtDate(s.created_at)}</td>
                      <td className="admin-td-scusa">"{s.scusa}"</td>
                      <td className="admin-td-risposta">{s.risposta}</td>
                      <td className="admin-td-fonte">{s.fonte || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </>
  );
}
