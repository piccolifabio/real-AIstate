import { useAuth } from './AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    const dest = location.pathname + location.search + location.hash
    return <Navigate to={`/login?redirect=${encodeURIComponent(dest)}`} replace />
  }

  return children
}
