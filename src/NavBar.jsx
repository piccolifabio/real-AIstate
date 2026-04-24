import { useState } from "react";

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; padding: 1.2rem 3rem; border-bottom: 1px solid rgba(247,245,240,0.08); background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); }
  .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: #f7f5f0; text-decoration: none; flex-shrink: 0; }
  .nav-logo span { color: #d93025; }
  .nav-spacer { width: 1.5rem; flex-shrink: 0; }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; align-items: center; margin: 0; padding: 0; flex: 1; }
  .nav-links li { list-style: none; }
  .nav-links a { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; }
  .nav-links a:hover { color: #f7f5f0; }
  .nav-cta { background: #d93025 !important; color: #f7f5f0 !important; padding: 0.55rem 1.4rem; border-radius: 2px; font-size: 0.75rem !important; letter-spacing: 0.12em !important; }
  .nav-cta:hover { background: #b02020 !important; }
  .nav-hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; margin-left: auto; }
  .nav-hamburger span { display: block; width: 24px; height: 2px; background: #f7f5f0; border-radius: 2px; transition: all 0.2s; }
  .nav-mobile-menu { position: fixed; top: 57px; left: 0; right: 0; z-index: 99; background: rgba(10,10,10,0.98); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(247,245,240,0.08); flex-direction: column; padding: 1.5rem 2rem; gap: 0; display: none; }
  .nav-mobile-menu a { font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500; color: rgba(247,245,240,0.6); text-decoration: none; padding: 1rem 0; border-bottom: 1px solid rgba(247,245,240,0.08); transition: color 0.2s; letter-spacing: 0.04em; display: block; }
  .nav-mobile-menu a:last-child { border-bottom: none; }
  .nav-mobile-menu a:hover { color: #f7f5f0; }
  .nav-mobile-cta { color: #d93025 !important; font-weight: 600 !important; }

  @media (max-width: 900px) {
    .nav { padding: 1rem 1.5rem; }
    .nav-hamburger { display: flex; }
    .nav-links { display: none; }
    .nav-spacer { display: none; }
  }
`;

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{navStyles}</style>
      <nav className="nav">
        <a href="/" className="nav-logo">Real<span>AI</span>state</a>
        <div className="nav-spacer" />
        <ul className="nav-links">
          <li><a href="/come-funziona">Come funziona</a></li>
          <li><a href="/scuse">Le scuse</a></li>
          <li style={{ flex: 1 }} />
          <li><a href="/affitti">Affitti</a></li>
          <li><a href="/compra">Compra casa</a></li>
          <li><a href="/vendi">Vendi casa</a></li>
          <li><a href="/#early" className="nav-cta">Accesso</a></li>
        </ul>
        <button className="nav-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      {open && (
        <div className="nav-mobile-menu" style={{ display: "flex" }}>
          <a href="/" onClick={() => setOpen(false)}>Home</a>
          <a href="/come-funziona" onClick={() => setOpen(false)}>Come funziona</a>
          <a href="/scuse" onClick={() => setOpen(false)}>Le scuse</a>
          <a href="/affitti" onClick={() => setOpen(false)}>Affitti</a>
          <a href="/compra" onClick={() => setOpen(false)}>Compra casa</a>
          <a href="/vendi" onClick={() => setOpen(false)}>Vendi casa</a>
          <a href="/#early" className="nav-mobile-cta" onClick={() => setOpen(false)}>Accesso →</a>
        </div>
      )}
    </>
  );
}
