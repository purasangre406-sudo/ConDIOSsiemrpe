import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqrhhxxwthjfdmeguprg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcmhoeHh3dGhqZmRtZWd1cHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzQwOTYsImV4cCI6MjA5ODE1MDA5Nn0.LSuFzpMyMtYbuAc9VeePtf1nfGrCxSsWMdnVFdfQIwI'

export const supabase = createClient(supabaseUrl, supabaseKey)
