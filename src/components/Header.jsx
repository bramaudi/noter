import { createEffect, createSignal, Show } from 'solid-js'
// Services
import auth, { logout } from '../services/auth'
import notesModel from '../models/notes'
// Components
import iconCheck from '../assets/icons/check.svg'
import iconRefresh from '../assets/icons/refresh-cw.svg'
import iconLogOut from '../assets/icons/log-out.svg'
import Tooltip from './Tooltip'

const propsTypes = {
	setNotes: () => []
}

const Header = (props = propsTypes) => {
	let refreshImgEl
	const { setNotes } = props
	const [modalProfile, setModalProfile] = createSignal(false)
	const [spin, setSpin] = createSignal(false)
	const signOut = async () => {
		const { error } = await logout()
		if (error) return createAlert(error.message)
		window.location.href = '/'
	}
	const clickOutsideProfilePopup = event => {
		if (!event.target.closest('#profile_popup')) {
			setModalProfile(false)
		}
	}
	const refreshNotes = async () => {
		setSpin(true)
		const { data } = await notesModel.index()
		setNotes(data)
		setSpin(false)
		refreshImgEl.setAttribute('src', iconCheck)
		setTimeout(() => {
			refreshImgEl.setAttribute('src', iconRefresh)
		}, 2000)
	}
	createEffect(() => {
		modalProfile()
			? document.addEventListener('click', clickOutsideProfilePopup, false)
			: document.removeEventListener('click', clickOutsideProfilePopup)
	})
	return (
		<header class="flex items-center p-3 pb-0 -mb-1">
			<div className="text-3xl">Noter</div>
			<Show when={auth}>
				<div className="ml-auto">
					<Tooltip text="Refresh" position="bottom">
						<button onClick={() => refreshNotes()} class="relative flex items-center">
							<img
								ref={refreshImgEl}
								class="w-5 h-5 rounded"
								className={spin() && 'animate-spin'}
								src={iconRefresh}
								alt="refresh"
							/>
						</button>
					</Tooltip>
				</div>
				<div class="ml-5">
					<button onClick={() => setModalProfile(true)} class="relative flex items-center">
						<img
							class="w-8 h-8 rounded bg-gray-200"
							src={auth.user_metadata.avatar_url}
							alt={auth.user_metadata.user_name} />
						
						<div className="hidden sm:block sm:ml-2">{auth.user_metadata.full_name}</div>
					</button>
					<div
						id="profile_popup"
						class="absolute z-10 pr-4 top-12 right-2 w-48 text-sm bg-white border rounded-lg shadow-md"
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