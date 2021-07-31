import { Link, useNavigate } from "solid-app-router"
import { createSignal, onMount, Show } from "solid-js"
import auth, { login } from "../services/auth"

const Login = () => {
	const navigate = useNavigate()
	const [alert, setAlert] = createSignal(null)
	const createAlert = message => {
		setAlert(message)
		setTimeout(() => setAlert(null), 3000)
	}
	const signInWith = async (provider) => {
		const { error } = await login(provider)
		if (error) return createAlert(error.message)
	}
	onMount(() => {
		if (auth) navigate('/', { replace: true })
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
					<Link
						href="/"
						className="inline-block mt-5 p-2 px-3 rounded border border-gray-400 text-gray-700"
						>
						Back
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Login