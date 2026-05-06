import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import NavBar from './NavBar.jsx'
import SiteFooter from './SiteFooter.jsx'

export default function VenditoreDashboard() {
  const [tab, setTab] = useState('conversazioni') // 'conversazioni' | 'proposte'

  // --- Conversazioni ---
  const [sessioni, setSessioni] = useState([])
  const [loadingSessioni, setLoadingSessioni] = useState(true)
  const [sessioneAperta, setSessioneAperta] = useState(null)
  const [messaggi, setMessaggi] = useState([])

  // --- Proposte ---
  const [proposte, setProposte] = useState([])
  const [loadingProposte, setLoadingProposte] = useState(true)
  const [accettando, setAccettando] = useState(null) // proposta_id in corso
  const [feedbackMsg, setFeedbackMsg] = useState(null) // { tipo: 'ok'|'err', testo }

  // ── Load conversazioni ──────────────────────────────────────────────────────
  useEffect(() => {
    const loadSessioni = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('sessione_id, compratore_nome, compratore_email, created_at, testo')
        .eq('immobile_id', 1)
        .eq('mittente', 'compratore')
        .order('created_at', { ascending: false })

      if (data) {
        const uniche = []
        const viste = new Set()
        for (const m of data) {
          if (!viste.has(m.sessione_id)) {
            viste.add(m.sessione_id)
            uniche.push(m)
          }
        }
        setSessioni(uniche)
      }
      setLoadingSessioni(false)
    }
    loadSessioni()
  }, [])

  // ── Load proposte ───────────────────────────────────────────────────────────
  useEffect(() => {
    const loadProposte = async () => {
      const { data } = await supabase
        .from('proposte')
        .select('*')
        .eq('immobile_id', 1)
        .order('created_at', { ascending: false })

      if (data) setProposte(data)
      setLoadingProposte(false)
    }
    loadProposte()
  }, [])

  // ── Apri chat ───────────────────────────────────────────────────────────────
  const apriSessione = async (sessione_id) => {
    setSessioneAperta(sessione_id)
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('sessione_id', sessione_id)
      .order('created_at', { ascending: true })
    if (data) setMessaggi(data)
  }

  // ── Accetta proposta → Yousign + Supabase ───────────────────────────────────
  const accettaProposta = async (proposta) => {
    setAccettando(proposta.id)
    setFeedbackMsg(null)

    try {
      const res = await fetch('/api/yousign-proposta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposta_id: proposta.id })
      })

      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Errore server')

      // Aggiorna stato locale senza reload
      setProposte(prev =>
        prev.map(p =>
          p.id === proposta.id
            ? { ...p, status: 'accepted', yousign_id: json.yousign_id }
            : p
        )
      )
      setFeedbackMsg({ tipo: 'ok', testo: 'Proposta accettata. Le email di firma sono state inviate a entrambe le parti.' })
    } catch (err) {
      setFeedbackMsg({ tipo: 'err', testo: `Errore: ${err.message}` })
    } finally {
      setAccettando(null)
    }
  }

  // ── Helpers UI ──────────────────────────────────────────────────────────────
  const badgeStatus = (status) => {
    const map = {
      pending:  { label: 'In attesa',  bg: 'rgba(201,168,76,0.15)',  color: '#c9a84c' },
      accepted: { label: 'Accettata',  bg: 'rgba(34,197,94,0.12)',   color: '#22c55e' },
      rejected: { label: 'Rifiutata',  bg: 'rgba(217,48,37,0.12)',   color: '#d93025' },
    }
    const s = map[status] || map.pending
    return (
      <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: s.bg, color: s.color, padding: '0.2rem 0.6rem', borderRadius: 2 }}>
        {s.label}
      </span>
    )
  }

  const fmt = (n) => Number(n).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
  const fmtData = (d) => new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <NavBar />
      <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '8rem 3rem 5rem', maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d93025', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ width: 32, height: 1, background: '#d93025', display: 'inline-block' }} />
          Dashboard Venditore
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f7f5f0', lineHeight: 1, marginBottom: '0.5rem' }}>
          La tua proprietà.
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(247,245,240,0.4)', marginBottom: '3rem' }}>
          Via Alfonso Capecelatro, 51 · Milano
        </p>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid rgba(247,245,240,0.08)', paddingBottom: '0' }}>
          {[
            { key: 'conversazioni', label: `Conversazioni${sessioni.length ? ` (${sessioni.length})` : ''}` },
            { key: 'proposte',      label: `Proposte${proposte.length ? ` (${proposte.length})` : ''}` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid #d93025' : '2px solid transparent',
                color: tab === t.key ? '#f7f5f0' : 'rgba(247,245,240,0.35)',
                padding: '0.6rem 0.2rem',
                marginRight: '1.5rem',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                letterSpacing: '0.03em',
                transition: 'color 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: CONVERSAZIONI ── */}
        {tab === 'conversazioni' && (
          <>
            {loadingSessioni ? (
              <div style={{ color: 'rgba(247,245,240,0.4)' }}>Caricamento...</div>
            ) : sessioni.length === 0 ? (
              <div style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '2rem', color: 'rgba(247,245,240,0.4)', textAlign: 'center' }}>
                Nessuna conversazione ancora. Quando un compratore ti scriverà, apparirà qui.
              </div>
            ) : !sessioneAperta ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sessioni.map((s, i) => (
                  <div
                    key={s.sessione_id}
                    onClick={() => apriSessione(s.sessione_id)}
                    style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(247,245,240,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(247,245,240,0.08)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f7f5f0', marginBottom: '0.3rem' }}>
                          {s.compratore_nome || `Compratore #${i + 1}`}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(247,245,240,0.4)', marginBottom: '0.5rem' }}>
                          {s.compratore_email || 'Email non fornita'}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'rgba(247,245,240,0.5)', fontStyle: 'italic' }}>
                          "{s.testo.substring(0, 80)}{s.testo.length > 80 ? '...' : ''}"
                        </div>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(247,245,240,0.3)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                        {new Date(s.created_at).toLocaleDateString('it-IT')}
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: '#d93025', fontWeight: 600 }}>
                      Vedi conversazione →
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => { setSessioneAperta(null); setMessaggi([]) }}
                  style={{ background: 'transparent', border: '1px solid rgba(247,245,240,0.15)', color: 'rgba(247,245,240,0.5)', padding: '0.6rem 1.2rem', borderRadius: 2, cursor: 'pointer', marginBottom: '2rem', fontSize: '0.82rem', fontFamily: 'DM Sans, sans-serif' }}
                >
                  ← Tutte le conversazioni
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messaggi.map((m, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxWidth: '85%', alignSelf: m.mittente === 'compratore' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: m.mittente === 'compratore' ? 'rgba(247,245,240,0.4)' : '#c9a84c', textAlign: m.mittente === 'compratore' ? 'right' : 'left' }}>
                        {m.mittente === 'compratore' ? (m.compratore_nome || 'Compratore') : '✦ AI RealAIstate'}
                      </div>
                      <div style={{ padding: '0.8rem 1rem', borderRadius: 2, fontSize: '0.88rem', lineHeight: 1.6, background: m.mittente === 'compratore' ? 'rgba(217,48,37,0.1)' : 'rgba(247,245,240,0.06)', color: 'rgba(247,245,240,0.8)', borderRight: m.mittente === 'compratore' ? '2px solid #d93025' : 'none', borderLeft: m.mittente === 'ai' ? '2px solid #c9a84c' : 'none' }}>
                        {m.testo}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(247,245,240,0.25)', textAlign: m.mittente === 'compratore' ? 'right' : 'left' }}>
                        {new Date(m.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── TAB: PROPOSTE ── */}
        {tab === 'proposte' && (
          <>
            {/* Feedback banner */}
            {feedbackMsg && (
              <div style={{ background: feedbackMsg.tipo === 'ok' ? 'rgba(34,197,94,0.1)' : 'rgba(217,48,37,0.1)', border: `1px solid ${feedbackMsg.tipo === 'ok' ? 'rgba(34,197,94,0.3)' : 'rgba(217,48,37,0.3)'}`, borderRadius: 3, padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: feedbackMsg.tipo === 'ok' ? '#22c55e' : '#d93025', lineHeight: 1.5 }}>
                {feedbackMsg.tipo === 'ok' ? '✓ ' : '✗ '}{feedbackMsg.testo}
              </div>
            )}

            {loadingProposte ? (
              <div style={{ color: 'rgba(247,245,240,0.4)' }}>Caricamento...</div>
            ) : proposte.length === 0 ? (
              <div style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '2rem', color: 'rgba(247,245,240,0.4)', textAlign: 'center' }}>
                Nessuna proposta ricevuta ancora.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {proposte.map((p) => (
                  <div key={p.id} style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '1.75rem' }}>

                    {/* Header proposta */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f7f5f0', marginBottom: '0.2rem' }}>
                          {p.compratore_nome || 'Compratore'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(247,245,240,0.5)', marginBottom: '0.4rem' }}>
                          {p.compratore_email}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(247,245,240,0.35)' }}>
                          Ricevuta il {fmtData(p.created_at)}
                        </div>
                      </div>
                      {badgeStatus(p.status)}
                    </div>

                    {/* Dettagli proposta */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <div style={{ background: 'rgba(247,245,240,0.04)', borderRadius: 2, padding: '0.9rem 1.1rem' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.35)', marginBottom: '0.4rem' }}>Importo proposto</div>
                        <div style={{ fontSize: '1.25rem', fontFamily: 'Bebas Neue, sans-serif', color: '#f7f5f0', letterSpacing: '0.03em' }}>{fmt(p.importo)}</div>
                      </div>
                      <div style={{ background: 'rgba(247,245,240,0.04)', borderRadius: 2, padding: '0.9rem 1.1rem' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.35)', marginBottom: '0.4rem' }}>Data rogito proposta</div>
                        <div style={{ fontSize: '0.9rem', color: '#f7f5f0', fontWeight: 600 }}>{p.data_rogito || '—'}</div>
                      </div>
                    </div>

                    {(p.condizioni || p.note) && (
                      <div style={{ fontSize: '0.83rem', color: 'rgba(247,245,240,0.5)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.5rem', borderLeft: '2px solid rgba(247,245,240,0.12)', paddingLeft: '1rem' }}>
                        "{p.condizioni || p.note}"
                      </div>
                    )}

                    {/* Yousign info se già firmato */}
                    {p.status === 'accepted' && p.yousign_id && (
                      <div style={{ fontSize: '0.75rem', color: 'rgba(247,245,240,0.35)', marginBottom: '1rem' }}>
                        Firma digitale in corso · ID: <span style={{ fontFamily: 'monospace', color: 'rgba(247,245,240,0.5)' }}>{p.yousign_id}</span>
                      </div>
                    )}

                    {/* Bottone Accetta — solo se pending */}
                    {p.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          onClick={() => accettaProposta(p)}
                          disabled={accettando === p.id}
                          style={{
                            background: accettando === p.id ? 'rgba(217,48,37,0.4)' : '#d93025',
                            color: '#f7f5f0',
                            border: 'none',
                            padding: '0.75rem 1.75rem',
                            borderRadius: 2,
                            cursor: accettando === p.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            fontFamily: 'DM Sans, sans-serif',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            transition: 'background 0.2s',
                          }}
                        >
                          {accettando === p.id ? 'Invio firma...' : 'Accetta proposta'}
                        </button>
                        <button
                          onClick={async () => {
                            await supabase.from('proposte').update({ status: 'rejected' }).eq('id', p.id)
                            setProposte(prev => prev.map(x => x.id === p.id ? { ...x, status: 'rejected' } : x))
                          }}
                          style={{ background: 'transparent', border: '1px solid rgba(247,245,240,0.12)', color: 'rgba(247,245,240,0.4)', padding: '0.75rem 1.25rem', borderRadius: 2, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Rifiuta
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <SiteFooter />
    </>
  )
}