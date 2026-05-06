import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password, fullName) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })

  const signOut = () => supabase.auth.signOut()

  // Aggiorna il nome dell'utente loggato (usato da AccountPage)
  const updateFullName = async (fullName) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    })
    if (data?.user) setUser(data.user)
    return { data, error }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateFullName }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)