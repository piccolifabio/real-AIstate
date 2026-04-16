import { useState, useEffect } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [scuse, setScuse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-scuse", {
        headers: { "x-admin-key": password }
      });
      if (res.status === 401) { setError("Password errata."); setLoading(false); return; }
      const data = await res.json();
      setScuse(data);
      setAuthed(true);
    } catch {
      setError("Errore di connessione.");
    }
    setLoading(false);
  };

  const filtered = scuse.filter(s =>
    s.scusa?.toLowerCase().includes(search.toLowerCase()) ||
    s.risposta?.toLowerCase().includes(search.toLowerCase())
  );

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
        :root { --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020; --gold: #c9a84c; --muted: #6b6b6b; --surface: #141414; --border: rgba(247,245,240,0.08); }
        body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); }
        .admin-wrap { min-height: 100vh; background: var(--black); padding: 2rem 3rem; }
        .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
        .admin-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; color: var(--white); }
        .admin-logo span { color: var(--red); }
        .admin-stats { display: flex; gap: 2rem; }
        .admin-stat { text-align: right; }
        .admin-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--white); line-height: 1; }
        .admin-stat-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
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
              <div className="admin-stat-num">{scuse.length}</div>
              <div className="admin-stat-label">Scuse totali</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-num">{filtered.length}</div>
              <div className="admin-stat-label">Filtrate</div>
            </div>
          </div>
        </div>

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
                  <td className="admin-td-date">
                    {s.created_at ? new Date(s.created_at).toLocaleDateString("it-IT", {
                      day: "2-digit", month: "2-digit", year: "2-digit",
                      hour: "2-digit", minute: "2-digit"
                    }) : "—"}
                  </td>
                  <td className="admin-td-scusa">"{s.scusa}"</td>
                  <td className="admin-td-risposta">{s.risposta}</td>
                  <td className="admin-td-fonte">{s.fonte || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
