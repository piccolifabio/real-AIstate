import { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar.jsx'
import SiteFooter from './SiteFooter.jsx'

export default function AccountPage() {
  const { user, signOut, updateFullName } = useAuth()
  const navigate = useNavigate()

  const currentFullName = user?.user_metadata?.full_name || ''
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    setNameInput(currentFullName)
  }, [currentFullName])

  // Se non ha un nome, apri direttamente in modalità edit
  useEffect(() => {
    if (user && !currentFullName) setEditing(true)
  }, [user, currentFullName])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      setErrorMsg('Il nome non può essere vuoto')
      return
    }
    setSaving(true)
    setErrorMsg('')
    const { error } = await updateFullName(nameInput.trim())
    setSaving(false)
    if (error) {
      setErrorMsg(error.message || 'Errore salvataggio')
    } else {
      setEditing(false)
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 3000)
    }
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
                  Aggiungi il tuo nome — verrà usato sui documenti di proposta firmati digitalmente.
                </div>
              )}
              <input
                type="text"
                placeholder="Es. Mario Rossi"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                autoComplete="name"
                style={{
                  width: '100%', padding: '0.8rem 1rem', marginBottom: '0.9rem',
                  background: 'transparent', border: '1px solid rgba(247,245,240,0.15)',
                  borderRadius: 2, color: '#f7f5f0', fontSize: '0.9rem',
                  fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box'
                }}
              />
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
                    onClick={() => { setEditing(false); setNameInput(currentFullName); setErrorMsg('') }}
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

        <a href="/venditore" style={{
          display: 'block', background: '#141414', border: '1px solid rgba(247,245,240,0.08)',
          borderRadius: 3, padding: '2rem', marginBottom: '1rem', textDecoration: 'none',
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

        <div style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.4)', marginBottom: '0.8rem' }}>Prossimamente</div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(247,245,240,0.4)', lineHeight: 1.7 }}>
            Le tue offerte, i tuoi immobili salvati e lo storico delle conversazioni saranno disponibili qui.
          </div>
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