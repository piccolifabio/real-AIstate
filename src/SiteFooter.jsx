const footerStyles = `
  .site-footer { background: #0a0a0a; padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(247,245,240,0.08); font-size: 0.75rem; color: rgba(247,245,240,0.2); }
  .site-footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: rgba(247,245,240,0.4); }
  .site-footer-logo span { color: #d93025; }
  .site-footer-links { display: flex; gap: 2rem; align-items: center; }
  .site-footer-links a { color: rgba(247,245,240,0.2); text-decoration: none; transition: color 0.2s; display: inline-flex; align-items: center; gap: 0.3rem; font-family: 'DM Sans', sans-serif; }
  .site-footer-links a:hover { color: rgba(247,245,240,0.6); }
  .site-footer-ig:hover { color: #d93025 !important; }
  @media (max-width: 900px) {
    .site-footer { flex-direction: column; gap: 1.5rem; text-align: center; padding: 2rem 1.5rem; }
    .site-footer-links { flex-wrap: wrap; justify-content: center; }
  }
`;

export default function SiteFooter() {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className="site-footer">
        <div className="site-footer-logo">Real<span>AI</span>state</div>
        <div className="site-footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/termini">Termini</a>
          <a href="/blog">Blog</a>
          <a href="/faq">FAQ</a>
          <a href="mailto:info@realaistate.ai">Contatti</a>
          <a href="https://www.instagram.com/realaistate.ai" target="_blank" rel="noopener noreferrer" className="site-footer-ig">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            @realaistate.ai
          </a>
        </div>
        <div>© 2025 RealAIstate</div>
      </footer>
    </>
  );
}
