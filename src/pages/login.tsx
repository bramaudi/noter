import { useNavigate } from "solid-app-router"
import { onCleanup, createEffect, createSignal, onMount, Show } from "solid-js"
import { auth, login } from "@services/auth"
import supabase from "@services/supabase"
import { Provider } from "@supabase/supabase-js"

const Login = () => {
	const navigate = useNavigate()
	const [alert, setAlert] = createSignal('')

	/**
	 * Create something like flash message
	 */
	const createAlert = (message: string) => {
		setAlert(message)
		setTimeout(() => setAlert(''), 3000)
	}
	/**
	 * Sign-in with supabase provider
	 */
	const signInWith = async (provider: Provider) => {
		const { error } = await login(provider)
		if (error) return createAlert(error.message)
	}
	/**
	 * Navigate back when Esc pressed
	 */
	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			history.back()
		}
	}

	createEffect(() => {
		if (auth) {
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