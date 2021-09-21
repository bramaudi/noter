import { Provider } from '@supabase/supabase-js'
import supabase from "./supabase"

export const anonymous = {
	anonymous: true,
	user_metadata: {
		avatar_url: "/anon.svg",
		full_name: "Anonymous",
		user_name: "anonymous"
	}
}

export const auth = supabase.auth.user()

export const logout = async () => {
	return await supabase.auth.signOut()
}

export const login = async (provider: Provider) => {
	return await supabase.auth.signIn({ provider })
}
