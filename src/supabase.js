import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://strigywjvkhbubyszuxp.supabase.co'
const supabaseAnonKey = 'sb_publishable_goE-x1uW6MbVteK13NgcgQ_EHgn5xbD'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)