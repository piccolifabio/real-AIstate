import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import NavBar from './NavBar.jsx'
import SiteFooter from './SiteFooter.jsx'

export default function VenditoreDashboard() {
  const [sessioni, setSessioni] = useState([])
  const [loading, setLoading] = useState(true)
  const [sessioneAperta, setSessioneAperta] = useState(null)
  const [messaggi, setMessaggi] = useState([])

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
      setLoading(false)
    }
    loadSessioni()
  }, [])

  const apriSessione = async (sessione_id) => {
    setSessioneAperta(sessione_id)
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('sessione_id', sessione_id)
      .order('created_at', { ascending: true })
    if (data) setMessaggi(data)
  }

  return (
    <>
      <NavBar />
      <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '8rem 3rem 5rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d93025', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ width: 32, height: 1, background: '#d93025', display: 'inline-block' }} />
          Dashboard Venditore
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f7f5f0', lineHeight: 1, marginBottom: '0.5rem' }}>
          Le tue conversazioni.
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(247,245,240,0.4)', marginBottom: '3rem' }}>
          Via Alfonso Capecelatro, 51 · Milano
        </p>

        {loading ? (
          <div style={{ color: 'rgba(247,245,240,0.4)' }}>Caricamento...</div>
        ) : sessioni.length === 0 ? (
          <div style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '2rem', color: 'rgba(247,245,240,0.4)', textAlign: 'center' }}>
            Nessuna conversazione ancora. Quando un compratore ti scriverà, apparirà qui.
          </div>
        ) : (
          <div>
            {!sessioneAperta ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sessioni.map((s, i) => (
                  <div key={s.sessione_id} onClick={() => apriSessione(s.sessione_id)} style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
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
                <button onClick={() => { setSessioneAperta(null); setMessaggi([]) }} style={{ background: 'transparent', border: '1px solid rgba(247,245,240,0.15)', color: 'rgba(247,245,240,0.5)', padding: '0.6rem 1.2rem', borderRadius: 2, cursor: 'pointer', marginBottom: '2rem', fontSize: '0.82rem', fontFamily: 'DM Sans, sans-serif' }}>
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
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}