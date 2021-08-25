import { createEffect, createSignal, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
// Services
import auth, { logout } from '../services/auth'
import { notesDecompress, notesFetchAll, notesSync } from '../models/notes'
// Components
import iconCheck from '../assets/icons/check.svg'
import iconUploadCloud from '../assets/icons/upload-cloud.svg'
import iconRefresh from '../assets/icons/refresh-cw.svg'
import iconLogOut from '../assets/icons/log-out.svg'
import iconLoader from '../assets/icons/loader.svg'
import Tooltip from './Tooltip'
import { useNote } from '../store/NoteContext'

const Header = () => {
	const refs = {
		syncIcon: null,
		backupIcon: null,
		logoutIcon: null,
	}
	const [, setNote] = useNote()
	const [modalProfile, setModalProfile] = createSignal(false)
	const [animate, setAnimate] = createStore({
		refresh: false,
		backup: false,
	})

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
	 * Pull cloud notes to local
	 */
	const syncNotes = async () => {
		setAnimate('sync', true) // start spin

		try {
			const {data, error} = await notesFetchAll()
			setNote('list', data.map(notesDecompress))
			// temporarily swap with check icon
			refs.syncIcon.setAttribute('src', iconCheck)
			setTimeout(() => {
				refs.syncIcon.setAttribute('src', iconRefresh)
			}, 1000)

			if (error) {
				alert(error.message)
				refs.syncIcon.setAttribute('src', iconRefresh)
			}
		} catch (error) {
			if (error) {
				alert(error)
				refs.syncIcon.setAttribute('src', iconRefresh)
			}
		}

		setAnimate('sync', false) // stop spin
	}
	/**
	 * Push local notes to cloud
	 */
	const backupNotes = async () => {
		setAnimate('backup', true) // start spin

		try {
			const {data, error} = await notesSync(true)
			setNote('list', data.map(notesDecompress))
			// temporarily swap with check icon
			refs.backupIcon.setAttribute('src', iconCheck)
			setTimeout(() => {
				refs.backupIcon.setAttribute('src', iconUploadCloud)
			}, 1000)

			if (error) {
				alert(error.message)
				refs.backupIcon.setAttribute('src', iconUploadCloud)
			}
		} catch (error) {
			if (error) {
				alert(error)
				refs.backupIcon.setAttribute('src', iconUploadCloud)
			}
		}

		setAnimate('backup', false) // stop spin
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
					<Tooltip text="Sync" position="bottom">
						<button aria-label="Sync" onClick={() => syncNotes()} class="relative flex items-center rounded-full">
							<img
								ref={refs.syncIcon}
								class="w-5 h-5 rounded"
								className={animate.sync && 'animate-spin'}
								src={iconRefresh}
								alt="refresh"
							/>
						</button>
					</Tooltip>
				</div>
				{/* Backup Button */}
				<div className="ml-5">
					<Tooltip text="Backup" position="bottom">
						<button aria-label="Backup" onClick={() => backupNotes()} class="relative flex items-center rounded-full">
							<img
								ref={refs.backupIcon}
								class="w-5 h-5 rounded"
								className={animate.backup && 'animate-ping'}
								src={iconUploadCloud}
								alt="upload"
							/>
						</button>
					</Tooltip>
				</div>
				{/* Profile Picture */}
				<div class="ml-5">
					<button aria-label="Profile" onClick={() => setModalProfile(true)} class="relative flex items-center rounded focus:ring focus:outline-none">
						<img
							class="w-8 h-8 rounded bg-gray-200"
							src={auth.user_metadata.avatar_url}
							alt="Profile picture"
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