import supabase from "./supabase"

const anonymous = {
	anonymous: true,
	user_metadata: {
			avatar_url: "/anon.svg",
			full_name: "Anonymous",
			user_name: "anonymous"
	},
	created_at: "2021-07-23T00:59:50.491297Z",
	updated_at: "2021-07-23T00:59:50.491297Z"
}

const auth = supabase.auth.user() || JSON.parse(localStorage.getItem('supabase.auth.token')) || anonymous

export const logout = async () => {
	return await supabase.auth.signOut()
}

export const login = async (provider) => {
	return await supabase.auth.signIn({ provider })
}

export default auth