import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import NavBar from "../NavBar.jsx";
import SiteFooter from "../SiteFooter.jsx";
import articoli from "./articoli.js";

const TAG_COLORS = {
  red:  { bg: "rgba(217,48,37,0.15)",  color: "#d93025", border: "rgba(217,48,37,0.3)"  },
  gold: { bg: "rgba(201,168,76,0.15)", color: "#c9a84c", border: "rgba(201,168,76,0.3)" },
  gray: { bg: "rgba(247,245,240,0.05)",color: "#6b6b6b", border: "rgba(247,245,240,0.1)"},
};

function renderTesto(testo) {
  const parts = testo.split(/\*\*(.*?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: "#f7f5f0" }}>{p}</strong>
      : p
  );
}

export default function BlogArticolo() {
  const { slug } = useParams();
  const art = articoli.find(a => a.slug === slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!art || art.sezioni.length === 0) return <Navigate to="/blog" replace />;

  const tag = TAG_COLORS[art.tagClass] || TAG_COLORS.gray;
  const accentColor = art.tagClass === "gold" ? "#c9a84c" : "#d93025";

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#f7f5f0" }}>
      <NavBar />

      {/* HEADER */}
      <div style={{ padding: "5.5rem 3rem 2rem", maxWidth: "780px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.75rem", color: "#6b6b6b", marginBottom: "1.2rem", display: "flex", gap: "0.5rem" }}>
          <a href="/blog" style={{ color: "#6b6b6b", textDecoration: "none" }}>Blog</a>
          <span>›</span>
          <span>{art.categoria}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.25rem 0.7rem", borderRadius: "2px", background: tag.bg, color: tag.color, border: `1px solid ${tag.border}` }}>{art.categoria}</span>
          <span style={{ fontSize: "0.78rem", color: "#6b6b6b" }}>{art.data} · {art.lettura} di lettura</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.15, color: "#f7f5f0", marginBottom: "1.2rem" }}>{art.titolo}</h1>
        <p style={{ fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.7, color: "rgba(247,245,240,0.5)", borderLeft: `3px solid ${accentColor}`, paddingLeft: "1.2rem", marginBottom: "2rem" }}>{art.excerpt}</p>
      </div>

      {/* CORPO */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 3rem 5rem" }}>
        {art.sezioni.map((s, i) => {
          if (s.tipo === "paragrafo") return (
            <p key={i} style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>{renderTesto(s.testo)}</p>
          );
          if (s.tipo === "titolo") return (
            <h2 key={i} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", margin: "2.5rem 0 1rem" }}>{s.testo}</h2>
          );
          if (s.tipo === "citazione") return (
            <div key={i} style={{ background: "#1e1e1e", borderLeft: `4px solid ${accentColor}`, padding: "1.5rem 1.8rem", margin: "2rem 0", borderRadius: "0 2px 2px 0" }}>
              <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#f7f5f0", margin: 0, fontStyle: "italic" }}>{s.testo}</p>
            </div>
          );
          if (s.tipo === "dati") {
            const dc = s.colore === "gold" ? "#c9a84c" : "#d93025";
            return (
              <div key={i} style={{ background: "#1e1e1e", border: "1px solid rgba(247,245,240,0.08)", borderRadius: "3px", padding: "1.5rem 2rem", margin: "2rem 0" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: dc, marginBottom: "1rem" }}>{s.titolo}</div>
                {s.righe.map(([label, val], j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: j < s.righe.length - 1 ? "1px solid rgba(247,245,240,0.06)" : "none", fontSize: "0.88rem" }}>
                    <span style={{ color: "#6b6b6b" }}>{label}</span>
                    <span style={{ color: "#f7f5f0", fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
                {s.fonte && <div style={{ fontSize: "0.72rem", color: "#444", marginTop: "0.8rem" }}>Fonte: {s.fonte}</div>}
              </div>
            );
          }
          return null;
        })}

        {/* CTA */}
        <div style={{ background: "#1e1e1e", border: "1px solid rgba(247,245,240,0.08)", borderRadius: "3px", padding: "2.5rem", margin: "3rem 0", borderTop: `3px solid ${accentColor}` }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d93025", marginBottom: "0.8rem" }}>RealAIstate</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", marginBottom: "0.6rem" }}>Compra o vendi casa. In trasparenza.</div>
          <p style={{ fontSize: "0.9rem", color: "#6b6b6b", lineHeight: 1.6, marginBottom: "1.5rem" }}>Nessuna agenzia. Nessun intermediario non verificato. Solo AI, dati pubblici e professionisti certificati.</p>
          <a href={art.cta.link} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#d93025", color: "white", textDecoration: "none", padding: "0.85rem 1.8rem", borderRadius: "2px", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {art.cta.testo}
          </a>
        </div>

        <div style={{ fontSize: "0.75rem", color: "#6b6b6b", borderTop: "1px solid rgba(247,245,240,0.08)", paddingTop: "1rem", marginTop: "2rem" }}>
          <strong>Fonte:</strong> {art.fonte}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
