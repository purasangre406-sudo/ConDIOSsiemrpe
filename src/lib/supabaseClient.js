import { createClient } from '@supabase/supabase-js'

// 👉 PASO IMPORTANTE: reemplaza estos dos valores con los tuyos.
// Los obtienes en supabase.com → tu proyecto → Settings → API
// supabaseUrl: "Project URL"
// supabaseKey: "anon public" key (NUNCA uses la "service_role" key aquí)

const supabaseUrl = 'TU_SUPABASE_URL_AQUI'
const supabaseKey = 'TU_SUPABASE_ANON_KEY_AQUI'

export const supabase = createClient(supabaseUrl, supabaseKey)
