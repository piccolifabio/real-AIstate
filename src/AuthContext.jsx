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

  // signUp ora accetta nome e cognome separati. Salviamo entrambi in user_metadata
  // più il derivato full_name = `${nome} ${cognome}` per compatibilità con tutto
  // il codice (email transazionali, UI legacy) che oggi legge user_metadata.full_name.
  //
  // emailRedirectTo opzionale: URL assoluto a cui Supabase reindirizza l'utente
  // dopo che ha cliccato il link di conferma email. Senza di esso Supabase usa
  // il Site URL configurato in dashboard (default = home), perdendo la destination
  // del flow ?redirect=. Vedi LoginPage per il calcolo dell'URL.
  //
  // AZIONE FONDER REQUIRED su Supabase Dashboard: in "Auth → URL Configuration →
  // Redirect URLs" devono essere whitelistati `https://realaistate.ai/**` e
  // `https://*.vercel.app/**` (preview), altrimenti Supabase ignora emailRedirectTo
  // e fa fallback al Site URL → utente torna in home invece che alla destination.
  const signUp = (email, password, nome, cognome, emailRedirectTo) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
          cognome,
          full_name: `${nome} ${cognome}`.trim(),
        },
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      }
    })

  const signOut = () => supabase.auth.signOut()

  // Aggiorna nome e cognome (e ricalcola full_name).
  // Pattern preferito da AccountPage e da qualsiasi flusso post-migrazione.
  const updateNomeCognome = async (nome, cognome) => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        nome,
        cognome,
        full_name: `${nome} ${cognome}`.trim(),
      }
    })
    if (data?.user) setUser(data.user)
    return { data, error }
  }

  // Wrapper deprecato: splitta sul primo space per non rompere chiamate residue
  // che ancora passano un campo unico. Sotto chiama updateNomeCognome così
  // sia full_name sia i nuovi campi nome/cognome sono sempre coerenti.
  // Non usare per nuovo codice — usa updateNomeCognome direttamente.
  const updateFullName = async (fullName) => {
    const trimmed = (fullName || '').trim()
    const idx = trimmed.indexOf(' ')
    const nome = idx >= 0 ? trimmed.slice(0, idx) : trimmed
    const cognome = idx >= 0 ? trimmed.slice(idx + 1).trim() : ''
    return updateNomeCognome(nome, cognome)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateNomeCognome, updateFullName }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)