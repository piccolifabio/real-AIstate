import { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import NavBar from './NavBar.jsx'
import SiteFooter from './SiteFooter.jsx'

export default function AccountPage() {
  const { user, signOut, updateNomeCognome } = useAuth()
  const navigate = useNavigate()

  // Nome/cognome dal profilo: dopo la migrazione SQL del 10/05/2026 i campi
  // user_metadata.nome e .cognome sono popolati per tutti. Per utenti pre-migrazione
  // o pre-fix il fallback è lo split del vecchio full_name (primo token = nome,
  // resto = cognome).
  const meta = user?.user_metadata || {}
  const fallback = (() => {
    const f = (meta.full_name || '').trim()
    if (!f) return { nome: '', cognome: '' }
    const idx = f.indexOf(' ')
    return idx >= 0
      ? { nome: f.slice(0, idx), cognome: f.slice(idx + 1).trim() }
      : { nome: f, cognome: '' }
  })()
  const currentNome = meta.nome ?? fallback.nome
  const currentCognome = meta.cognome ?? fallback.cognome
  const currentFullName = `${currentNome} ${currentCognome}`.trim()

  const [editing, setEditing] = useState(false)
  const [nomeInput, setNomeInput] = useState('')
  const [cognomeInput, setCognomeInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Le mie proposte
  const [proposte, setProposte] = useState([])
  const [loadingProposte, setLoadingProposte] = useState(true)

  useEffect(() => {
    setNomeInput(currentNome)
    setCognomeInput(currentCognome)
  }, [currentNome, currentCognome])

  useEffect(() => {
    if (user && !currentFullName) setEditing(true)
  }, [user, currentFullName])

  // Load proposte dell'utente loggato (RLS filtra automaticamente per compratore_user_id = auth.uid())
  useEffect(() => {
    if (!user) return
    const loadProposte = async () => {
      const { data } = await supabase
        .from('proposte')
        .select('id, importo, condizioni, data_rogito, status, created_at, immobile_id, immobili(indirizzo)')
        .order('created_at', { ascending: false })

      if (data) setProposte(data)
      setLoadingProposte(false)
    }
    loadProposte()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleSaveName = async () => {
    if (!nomeInput.trim() || !cognomeInput.trim()) {
      setErrorMsg('Inserisci sia nome sia cognome')
      return
    }
    setSaving(true)
    setErrorMsg('')
    const { error } = await updateNomeCognome(nomeInput.trim(), cognomeInput.trim())
    setSaving(false)
    if (error) {
      setErrorMsg(error.message || 'Errore salvataggio')
    } else {
      setEditing(false)
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 3000)
    }
  }

  // Helpers
  const fmt = (n) => Number(n).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
  const fmtData = (d) => new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })

  const badgeStatus = (status) => {
    const map = {
      pending:  { label: 'In attesa', bg: 'rgba(201,168,76,0.15)', color: '#c9a84c' },
      accepted: { label: 'Accettata', bg: 'rgba(34,197,94,0.12)',  color: '#22c55e' },
      rejected: { label: 'Rifiutata', bg: 'rgba(217,48,37,0.12)',  color: '#d93025' },
    }
    const s = map[status] || map.pending
    return (
      <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: s.bg, color: s.color, padding: '0.2rem 0.6rem', borderRadius: 2 }}>
        {s.label}
      </span>
    )
  }

  return (
    <>
      <NavBar />
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        padding: '8rem 3rem 5rem', maxWidth: '760px', margin: '0 auto'
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d93025', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ width: 32, height: 1, background: '#d93025', display: 'inline-block' }} />
          Il mio account
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#f7f5f0', lineHeight: 1, marginBottom: '2rem' }}>
          {currentFullName ? `Ciao, ${currentFullName.split(' ')[0]}.` : 'Bentornato.'}
        </h1>

        {savedFlash && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 3, padding: '0.9rem 1.2rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#22c55e' }}>
            ✓ Nome aggiornato.
          </div>
        )}

        {/* Card NOME */}
        <div style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.4)' }}>
              Nome e cognome
            </div>
            {!editing && currentFullName && (
              <button
                onClick={() => { setEditing(true); setErrorMsg('') }}
                style={{ background: 'none', border: 'none', color: 'rgba(247,245,240,0.4)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
              >
                Modifica
              </button>
            )}
          </div>

          {!editing ? (
            <div style={{ fontSize: '1rem', color: currentFullName ? '#f7f5f0' : 'rgba(247,245,240,0.4)', fontStyle: currentFullName ? 'normal' : 'italic' }}>
              {currentFullName || 'Non impostato'}
            </div>
          ) : (
            <>
              {!currentFullName && (
                <div style={{ fontSize: '0.82rem', color: 'rgba(247,245,240,0.5)', marginBottom: '0.9rem', lineHeight: 1.6 }}>
                  Aggiungi nome e cognome — verranno usati sui documenti di proposta firmati digitalmente.
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={nomeInput}
                  onChange={e => setNomeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  autoComplete="given-name"
                  style={{
                    flex: '1 1 140px', padding: '0.8rem 1rem',
                    background: 'transparent', border: '1px solid rgba(247,245,240,0.15)',
                    borderRadius: 2, color: '#f7f5f0', fontSize: '0.9rem',
                    fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box'
                  }}
                />
                <input
                  type="text"
                  placeholder="Cognome"
                  value={cognomeInput}
                  onChange={e => setCognomeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  autoComplete="family-name"
                  style={{
                    flex: '1 1 140px', padding: '0.8rem 1rem',
                    background: 'transparent', border: '1px solid rgba(247,245,240,0.15)',
                    borderRadius: 2, color: '#f7f5f0', fontSize: '0.9rem',
                    fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
              {errorMsg && (
                <div style={{ color: '#d93025', fontSize: '0.78rem', marginBottom: '0.8rem' }}>
                  {errorMsg}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={handleSaveName}
                  disabled={saving}
                  style={{
                    background: '#d93025', color: '#f7f5f0', border: 'none',
                    padding: '0.65rem 1.4rem', borderRadius: 2, cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                    fontFamily: 'DM Sans, sans-serif',
                    opacity: saving ? 0.6 : 1
                  }}
                >
                  {saving ? 'Salvo...' : 'Salva'}
                </button>
                {currentFullName && (
                  <button
                    onClick={() => { setEditing(false); setNomeInput(currentNome); setCognomeInput(currentCognome); setErrorMsg('') }}
                    style={{
                      background: 'transparent', color: 'rgba(247,245,240,0.4)',
                      border: '1px solid rgba(247,245,240,0.12)', padding: '0.65rem 1.2rem',
                      borderRadius: 2, cursor: 'pointer', fontSize: '0.78rem',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    Annulla
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Card EMAIL */}
        <div style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.4)', marginBottom: '0.8rem' }}>Email</div>
          <div style={{ fontSize: '1rem', color: '#f7f5f0' }}>{user?.email}</div>
        </div>

        {/* Link dashboard venditore */}
        <a href="/venditore" style={{
          display: 'block', background: '#141414', border: '1px solid rgba(247,245,240,0.08)',
          borderRadius: 3, padding: '2rem', marginBottom: '2.5rem', textDecoration: 'none',
          transition: 'border-color 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(247,245,240,0.2)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(247,245,240,0.08)'}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#d93025', marginBottom: '0.8rem' }}>Dashboard Venditore</div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(247,245,240,0.6)', lineHeight: 1.7 }}>
            Vedi le conversazioni sui tuoi immobili →
          </div>
        </a>

        {/* ── SEZIONE: LE MIE PROPOSTE ─────────────────────────────────────────── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d93025', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ width: 32, height: 1, background: '#d93025', display: 'inline-block' }} />
            Le mie proposte
          </div>

          {loadingProposte ? (
            <div style={{ color: 'rgba(247,245,240,0.4)', fontSize: '0.9rem', padding: '1rem 0' }}>
              Caricamento...
            </div>
          ) : proposte.length === 0 ? (
            <div style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '2rem', color: 'rgba(247,245,240,0.4)', fontSize: '0.9rem', textAlign: 'center' }}>
              Non hai ancora inviato proposte d'acquisto.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {proposte.map((p) => (
                <div key={p.id} style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f7f5f0', marginBottom: '0.2rem' }}>
                        {p.immobili?.indirizzo || `Immobile #${p.immobile_id}`}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(247,245,240,0.4)' }}>
                        Inviata il {fmtData(p.created_at)}
                      </div>
                    </div>
                    {badgeStatus(p.status)}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <div style={{ background: 'rgba(247,245,240,0.04)', borderRadius: 2, padding: '0.7rem 0.9rem' }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.35)', marginBottom: '0.3rem' }}>Importo</div>
                      <div style={{ fontSize: '1.05rem', fontFamily: 'Bebas Neue, sans-serif', color: '#f7f5f0', letterSpacing: '0.03em' }}>{fmt(p.importo)}</div>
                    </div>
                    <div style={{ background: 'rgba(247,245,240,0.04)', borderRadius: 2, padding: '0.7rem 0.9rem' }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.35)', marginBottom: '0.3rem' }}>Data rogito</div>
                      <div style={{ fontSize: '0.85rem', color: '#f7f5f0', fontWeight: 600 }}>{p.data_rogito || '—'}</div>
                    </div>
                  </div>

                  {p.condizioni && (
                    <div style={{ marginTop: '0.9rem', fontSize: '0.78rem', color: 'rgba(247,245,240,0.5)', fontStyle: 'italic', lineHeight: 1.6, borderLeft: '2px solid rgba(247,245,240,0.12)', paddingLeft: '0.8rem' }}>
                      {p.condizioni}
                    </div>
                  )}

                  {p.status === 'pending' && (
                    <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(247,245,240,0.45)' }}>
                      Il venditore ha 24h per rispondere. Riceverai una notifica via email.
                    </div>
                  )}
                  {p.status === 'accepted' && (
                    <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#22c55e' }}>
                      ✓ Proposta accettata. Controlla la tua casella per il documento da firmare.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSignOut}
          style={{
            background: 'transparent', border: '1px solid rgba(247,245,240,0.15)',
            color: 'rgba(247,245,240,0.5)', padding: '0.9rem 2rem',
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
            borderRadius: 2, transition: 'all 0.2s'
          }}
        >
          Esci dall'account
        </button>
      </div>
      <SiteFooter />
    </>
  )
}