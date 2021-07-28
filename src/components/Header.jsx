import { createEffect, createSignal, Show } from 'solid-js'
// Services
import auth from '../services/auth'
// Components
import iconLogOut from '../assets/icons/log-out.svg'

const Header = () => {
	const [modalProfile, setModalProfile] = createSignal(false)
	const signOut = async () => {
		// const { error } = await supabase.auth.signOut()
		// if (error) return createAlert(error.message)
		// window.location.href = '/'
	}
	const clickOutsideProfilePopup = event => {
		if (!event.target.closest('#profile_popup')) {
			setModalProfile(false)
		}
	}
	createEffect(() => {
		modalProfile()
			? document.addEventListener('click', clickOutsideProfilePopup, false)
			: document.removeEventListener('click', clickOutsideProfilePopup)
	})
	return (
		<header class="flex items-center p-3 pt-4 pb-0 -mb-1">
			<div className="text-3xl">Catat</div>
			<Show when={auth}>
				<div class="ml-auto">
					<button onClick={() => setModalProfile(true)} class="relative flex items-center">
						<img
							class="w-8 h-8 rounded"
							src={auth.user_metadata.avatar_url}
							alt={auth.user_metadata.user_name} />
						
						<div className="hidden sm:block sm:ml-2">{auth.user_metadata.full_name}</div>
					</button>
					<div
						id="profile_popup"
						class="absolute pr-4 top-12 right-2 w-48 text-sm bg-white border rounded-lg shadow-md"
						class={modalProfile() ? '' : 'hidden'}
						>
						
						<span class="block sm:hidden w-full p-2 m-2 rounded border-b border-gray-200">{auth.user_metadata.full_name}</span>

						<button onClick={signOut} class="flex items-center w-full p-1 px-3 m-2 rounded-lg text-left hover:bg-gray-200">
							<img src={iconLogOut} alt="log-out" className="w-4 h-4 mr-2" />
							Logout
						</button>

					</div>
				</div>
			</Show>
		</header>
	)
}

export default Header