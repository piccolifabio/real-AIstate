import { useState } from 'react'
import { useAuth } from './AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'

function safeRedirect(raw) {
  if (!raw || typeof raw !== 'string') return null
  if (raw.length > 512) return null
  if (!raw.startsWith('/')) return null
  if (raw.startsWith('//') || raw.startsWith('/\\')) return null
  return raw
}

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = safeRedirect(searchParams.get('redirect')) || '/'
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handle = async () => {
    if (!email || !password) return
    if (mode === 'register') {
      if (!nome.trim() || !cognome.trim()) {
        setError('Inserisci nome e cognome')
        return
      }
      if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
        setError('Le due email non coincidono. Controlla di averle scritte uguali.')
        return
      }
      if (password !== confirmPassword) {
        setError('Le password non coincidono.')
        return
      }
    }
    setStatus('loading')
    setError('')
    // Per la registrazione passiamo a Supabase un emailRedirectTo esplicito che
    // include il ?redirect= della query string: dopo che l'utente clicca il link
    // di conferma email torna sulla destination (es. /immobili/1) invece che in
    // home. redirectTo è già passato dal safeRedirect → solo path relativi che
    // iniziano con "/" (open-redirect protection). Senza questo, il link di
    // conferma usa il Site URL configurato in Supabase Dashboard come fallback.
    const emailRedirectTo = mode === 'register'
      ? `${window.location.origin}${redirectTo}`
      : undefined
    const { error } = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, nome.trim(), cognome.trim(), emailRedirectTo)
    if (error) {
      setError(error.message)
      setStatus('idle')
    } else {
      if (mode === 'register') {
        setStatus('confirm')
      } else {
        navigate(redirectTo)
      }
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setConfirmEmail('')
    setConfirmPassword('')
  }

  const inputStyle = {
    width: '100%', padding: '0.9rem 1rem', marginBottom: '1rem',
    background: 'transparent', border: '1px solid rgba(247,245,240,0.15)',
    borderRadius: '2px', color: '#f7f5f0', fontSize: '0.9rem',
    fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box'
  }

  return (
    <>
    <style>{`
      @media (max-width: 480px) {
        .login-name-row { flex-direction: column; gap: 0 !important; }
      }
    `}</style>
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{
        background: '#141414', border: '1px solid rgba(247,245,240,0.08)',
        borderRadius: '4px', padding: '3rem', width: '100%', maxWidth: '420px'
      }}>
        <a href="/" style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem',
          letterSpacing: '0.05em', color: '#f7f5f0', textDecoration: 'none',
          marginBottom: '2rem', display: 'block', transition: 'color 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
          onMouseLeave={e => e.currentTarget.style.color = '#f7f5f0'}
        >
          Real<span style={{ color: '#d93025' }}>AI</span>state
        </a>
        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem',
          color: '#f7f5f0', marginBottom: '0.5rem', lineHeight: 1
        }}>
          {mode === 'login' ? 'Accedi' : 'Registrati'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(247,245,240,0.4)', marginBottom: '2rem' }}>
          {mode === 'login' ? 'Bentornato.' : 'Crea il tuo account gratuito.'}
        </p>
        {status === 'confirm' ? (
          <div style={{ color: '#4ade80', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Controlla la tua email e clicca il link di conferma per attivare l'account.
          </div>
        ) : (
          <>
            {mode === 'register' && (
              <div className="login-name-row" style={{ display: 'flex', gap: '0.6rem', marginBottom: 0 }}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  autoComplete="given-name"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="text"
                  placeholder="Cognome"
                  value={cognome}
                  onChange={e => setCognome(e.target.value)}
                  autoComplete="family-name"
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            )}
            <input
              type="email"
              placeholder="la-tua@email.it"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              style={inputStyle}
            />
            {mode === 'register' && (
              <input
                type="email"
                placeholder="Conferma email"
                value={confirmEmail}
                onChange={e => setConfirmEmail(e.target.value)}
                onPaste={e => e.preventDefault()}
                autoComplete="off"
                style={inputStyle}
              />
            )}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              style={{ ...inputStyle, marginBottom: mode === 'register' ? '1rem' : '1.5rem' }}
            />
            {mode === 'register' && (
              <>
                <input
                  type="password"
                  placeholder="Conferma password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handle()}
                  onPaste={e => e.preventDefault()}
                  autoComplete="new-password"
                  style={{ ...inputStyle, marginBottom: confirmPassword && password !== confirmPassword ? '0.4rem' : '1.5rem' }}
                />
                {confirmPassword && password !== confirmPassword && (
                  <div style={{ color: '#d93025', fontSize: '0.78rem', marginBottom: '1rem' }}>
                    Le password non coincidono.
                  </div>
                )}
              </>
            )}
            {error && (
              <div style={{ color: '#d93025', fontSize: '0.82rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}
            <button
              onClick={handle}
              disabled={status === 'loading'}
              style={{
                width: '100%', padding: '1rem', background: '#d93025',
                color: '#f7f5f0', border: 'none', borderRadius: '2px',
                fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
              }}
            >
              {status === 'loading' ? '...' : mode === 'login' ? 'Accedi →' : 'Crea account →'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={switchMode}
                style={{
                  background: 'none', border: 'none', color: 'rgba(247,245,240,0.4)',
                  fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                }}
              >
                {mode === 'login' ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  )
}