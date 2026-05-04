import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar.jsx'
import SiteFooter from './SiteFooter.jsx'

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
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
          Bentornato.
        </h1>

        <div style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 3, padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.4)', marginBottom: '0.8rem' }}>Email</div>
          <div style={{ fontSize: '1rem', color: '#f7f5f0' }}>{user?.email}</div>
        </div>

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