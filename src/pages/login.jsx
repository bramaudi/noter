import { useNavigate } from "solid-app-router"
import { onCleanup } from "solid-js"
import { createEffect } from "solid-js"
import { createSignal, onMount, Show } from "solid-js"
import auth, { login } from "../services/auth"
import supabase from "../services/supabase"

const Login = () => {
	const navigate = useNavigate()
	const [alert, setAlert] = createSignal(null)

	/**
	 * Create something like flash message
	 * @param {string} message 
	 */
	const createAlert = message => {
		setAlert(message)
		setTimeout(() => setAlert(null), 3000)
	}
	/**
	 * Sign-in with supabase provider
	 * @param {string} provider 
	 */
	const signInWith = async (provider) => {
		const { error } = await login(provider)
		if (error) return createAlert(error.message)
	}
	/**
	 * Navigate back when Esc pressed
	 * @param {KeyboardEvent} e 
	 */
	const handleEscape = (e) => {
		if (e.key === 'Escape') {
			history.back()
		}
	}

	createEffect(() => {
		if (!auth?.anonymous) {
			navigate('/notes')
		} else {
			// full refresh after login
			supabase.auth.onAuthStateChange(() => {
				navigate('/notes')
			})
		}
	})

	onMount(() => {
		window.addEventListener('keyup', handleEscape)
	})
	onCleanup(() => {
		window.removeEventListener('keyup', handleEscape)
	})
	
	return (
		<div class="flex items-center justify-center bg-gray-100" style="min-height: calc(100vh - 10em)">
			<div class="p-10 w-full max-w-md bg-white rounded-lg shadow-md">
				<div className="text-xl text-center mb-8">Please sign-in to continue</div>
				<Show when={alert()}>
					<div className="text-center mb-5 text-red-500">{alert()}</div>
				</Show>
				<button
					onClick={() => signInWith('github')}
					class="block w-full my-3 p-2 px-4 rounded bg-gray-900 hover:bg-gray-700 text-gray-100"
				>
					Continue with Github
				</button>
				<div className="mt-8 text-center">
					<button
						onClick={() => history.back()}
						className="inline-block mt-5 p-2 px-3 rounded border border-gray-400 text-gray-700"
						>
						Back
					</button>
				</div>
			</div>
		</div>
	)
}

export default Login