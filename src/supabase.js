import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	import.meta.env.VITE_APP_SUPABASE_URL,
	import.meta.env.VITE_APP_SUPABASE_KEY,
)

export const auth = supabase.auth.user()

export default supabase