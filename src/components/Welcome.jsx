import { createEffect } from 'solid-js'
import supabase, { auth } from '../services/supabase'
// Components
import iconGithub from '../assets/icons/github.svg'
import { Link } from 'solid-app-router'

const Welcome = () => {
	createEffect(() => {
		if (!auth) {
			 // full refresh after login
			supabase.auth.onAuthStateChange(() => {
				window.location.href = '/'
			})
		}
	})
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="max-w-xl mb-14">

				<div className="p-5 m-5 leading-7 text-center bg-white rounded-md shadow-md">
					<h1 className="text-4xl">Noter</h1>
					<div className="w-56 p-2 font-light">
						— &nbsp; is a simple & secure taking notes app,
						come with sync features and modern UI design.
					</div>
					<Link
						href="/login"
						className="inline-flex items-center mt-5 p-2 px-3 rounded bg-green-700 hover:bg-green-900 text-gray-100"
						>
						Sign in
					</Link>

					<a href="//github.com/bramaudi/noter" target="_blank">
						<img className="block mx-auto mt-5" src={iconGithub} alt="github" />
					</a>
				</div>

			</div>
		</div>
	)
}

export default Welcome