import supabase from "./supabase"

const auth = supabase.auth.user() || JSON.parse(localStorage.getItem('supabase.auth.token')) || null

export const logout = async () => {
	return await supabase.auth.signOut()
}

export const login = async (provider) => {
	return await supabase.auth.signIn({ provider })
}

export default auth