import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast in dev: meglio rompere all'avvio che avere un client undefined
  // che fallisce silenziosamente più avanti. In production Vercel le env sono
  // configurate; in locale serve `.env.local` (vedi .env.example).
  throw new Error(
    'Mancano VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
    'In locale crea .env.local copiando .env.example.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
