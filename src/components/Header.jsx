import { createEffect, createSignal, Show } from 'solid-js'
// Services
import auth, { logout } from '../services/auth'
import notesModel from '../models/notes'
// Components
import iconCheck from '../assets/icons/check.svg'
import iconRefresh from '../assets/icons/refresh-cw.svg'
import iconLogOut from '../assets/icons/log-out.svg'
import iconLoader from '../assets/icons/loader.svg'
import Tooltip from './Tooltip'
import { useNote } from '../store/NoteContext'

const Header = () => {
	const refs = {
		refreshIcon: null,
		logoutIcon: null,
	}
	const [, setNote] = useNote()
	const [modalProfile, setModalProfile] = createSignal(false)
	const [spin, setSpin] = createSignal(false)

	/**
	 * Close modal on outside profile popup menu
	 * @param {Event} e
	 */
	 const clickOutsideProfilePopup = e => {
		if (!e.target.closest('#profile_popup')) {
			// outside click
			setModalProfile(false)
		}
	}
	/**
	 * Sign out account
	 * @returns 
	 */
	const signOut = async () => {
		// spin on
		refs.logoutIcon.setAttribute('src', iconLoader)
		refs.logoutIcon.classList.add('animate-spin')
		// Logging out ...
		const { error } = await logout()
		if (error) return createAlert(error.message)
		// spin off
		refs.logoutIcon.classList.remove('animate-spin')
		refs.logoutIcon.setAttribute('src', iconLogOut)
		// full refresh page
		window.location.href = '/'
	}
	/**
	 * Refresh / Sync notes
	 */
	const refreshNotes = async () => {
		setSpin(true) // start spin

		try {
			const { data } = await notesModel.index()
			setNote('list', data.map(notesModel.decryptNote))
			// temporarily swap with check icon
			refs.refreshIcon.setAttribute('src', iconCheck)
			setTimeout(() => {
				refs.refreshIcon.setAttribute('src', iconRefresh)
			}, 2000)
		} catch (error) {
			alert(error)
			refs.refreshIcon.setAttribute('src', iconRefresh)
		}

		setSpin(false) // stop spin
	}

	createEffect(() => {
		// Only activate `clickOutsideProfilePopup` when popup open
		modalProfile()
			? document.addEventListener('click', clickOutsideProfilePopup, false)
			: document.removeEventListener('click', clickOutsideProfilePopup)
	})
	
	return (
		<header class="flex items-center p-3 pb-0 -mb-1">
			{/* Brand */}
			<div className="text-3xl">Noter</div>
			<Show when={auth}>
				{/* Refresh Button */}
				<div className="ml-auto">
					<Tooltip text="Refresh" position="bottom">
						<button onClick={() => refreshNotes()} class="relative flex items-center">
							<img
								ref={refs.refreshIcon}
								class="w-5 h-5 rounded"
								className={spin() && 'animate-spin'}
								src={iconRefresh}
								alt="refresh"
							/>
						</button>
					</Tooltip>
				</div>
				{/* Profile Picture */}
				<div class="ml-5">
					<button onClick={() => setModalProfile(true)} class="relative flex items-center">
						<img
							class="w-8 h-8 rounded bg-gray-200"
							src={auth.user_metadata.avatar_url}
						/>
						<div className="hidden sm:block sm:ml-2">{auth.user_metadata.full_name}</div>
					</button>
					<div
						id="profile_popup"
						class="absolute z-10 pr-4 top-12 right-2 w-48 text-sm bg-white border rounded-lg shadow-md"
						class={modalProfile() ? '' : 'hidden'}
					>
						<span class="block sm:hidden w-full p-2 m-2 rounded border-b border-gray-200">{auth.user_metadata.full_name}</span>
						<button onClick={signOut} class="flex items-center w-full p-1 px-3 m-2 rounded-lg text-left hover:bg-gray-200">
							<img
								ref={refs.logoutIcon}
								src={iconLogOut}
								alt="log-out"
								className="w-4 h-4 mr-2"
							/>
							Logout
						</button>
					</div>
				</div>
			</Show>
		</header>
	)
}

export default Header