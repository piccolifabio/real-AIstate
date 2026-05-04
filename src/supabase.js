import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://strigywjvkhbubyszuxp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cmlneXdqdmtoYnVieXN6dXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MzM0OTcsImV4cCI6MjA5MTUwOTQ5N30.aoe0BIuDrJyYU15hWVBaxO1I8PxweWpy6assvprRkns'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)