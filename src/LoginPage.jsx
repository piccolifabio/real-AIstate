import { useState } from 'react'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handle = async () => {
    if (!email || !password) return
    setStatus('loading')
    setError('')
    const { error } = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password)
    if (error) {
      setError(error.message)
      setStatus('idle')
    } else {
      if (mode === 'register') {
        setStatus('confirm')
      } else {
        navigate('/')
      }
    }
  }

  return (
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
            <input
              type="email"
              placeholder="la-tua@email.it"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '0.9rem 1rem', marginBottom: '1rem',
                background: 'transparent', border: '1px solid rgba(247,245,240,0.15)',
                borderRadius: '2px', color: '#f7f5f0', fontSize: '0.9rem',
                fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()}
              style={{
                width: '100%', padding: '0.9rem 1rem', marginBottom: '1.5rem',
                background: 'transparent', border: '1px solid rgba(247,245,240,0.15)',
                borderRadius: '2px', color: '#f7f5f0', fontSize: '0.9rem',
                fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box'
              }}
            />
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
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
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
  )
}