import { createEffect, createSignal, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
// Services
import { auth, anonymous, logout } from '@services/auth'
import { notesFetch, notesDecompress, notesOverwriteLocal } from '@models/notes'
// Components
import iconCheck from '@assets/icons/check.svg'
import iconDownloadCloud from '@assets/icons/download-cloud.svg'
import iconRefresh from '@assets/icons/refresh-cw.svg'
import iconLogIn from '@assets/icons/log-in.svg'
import iconLogOut from '@assets/icons/log-out.svg'
import iconLoader from '@assets/icons/loader.svg'
import Tooltip from './Tooltip'
import { useNote } from '@context/note'
import { Link } from 'solid-app-router'

const Header = () => {
	const refs: {
		syncIcon?: HTMLImageElement,
		pullIcon?: HTMLImageElement,
		logoutIcon?: HTMLImageElement,
	} = {}
	const [, setNote] = useNote()
	const [modalProfile, setModalProfile] = createSignal(false)
	const [animate, setAnimate] = createStore({
		sync: false,
		pull: false,
	})

	/**
	 * Close modal on outside profile popup menu
	 */
	 const clickOutsideProfilePopup = (e: Event) => {
		 const target = (e.target as HTMLElement)
		if (!target.closest('#profile_popup')) {
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
		refs.logoutIcon!.setAttribute('src', iconLoader)
		refs.logoutIcon!.classList.add('animate-spin')
		// Logging out ...
		const { error } = await logout()
		if (error) return alert(error.message)
		// spin off
		refs.logoutIcon!.classList.remove('animate-spin')
		refs.logoutIcon!.setAttribute('src', iconLogOut)
		// full refresh page
		window.location.href = '/'
	}
	/**
	 * Pull cloud notes to local
	 */
	const syncNotes = async () => {
		setAnimate('sync', true) // start spin

		const {data, error} = await notesFetch()
		setNote!('list', data.map(notesDecompress))
		// temporarily swap with check icon
		refs.syncIcon!.setAttribute('src', iconCheck)
		setTimeout(() => {
			refs.syncIcon!.setAttribute('src', iconRefresh)
		}, 1000)

		if (error) {
			console.error(error);
			refs.syncIcon!.setAttribute('src', iconRefresh)
		}

		setAnimate('sync', false) // stop spin
	}
	/**
	 * Pull and overwrite local notes
	 */
	const pullNotes = async () => {
		setAnimate('pull', true) // start spin

		const {data, error} = await notesOverwriteLocal()
		setNote!('list', data)
		// temporarily swap with check icon
		refs.pullIcon!.setAttribute('src', iconCheck)
		setTimeout(() => {
			refs.pullIcon!.setAttribute('src', iconDownloadCloud)
		}, 1000)

		if (error) {
			alert(error.message)
			refs.pullIcon!.setAttribute('src', iconDownloadCloud)
		}

		setAnimate('pull', false) // stop spin
	}

	createEffect(() => {
		// Only activate `clickOutsideProfilePopup` when popup open
		modalProfile()
			? document.addEventListener('click', clickOutsideProfilePopup, false)
			: document.removeEventListener('click', clickOutsideProfilePopup)
	})
	
	return (
		<>
			<header class="flex items-center p-3 pb-0 -mb-1">
				{/* Brand */}
				<div className="text-3xl">Noter</div>
				<div className="ml-auto"></div>
				<Show when={auth}>
					{/* Refresh Button */}
					<div className="ml-5">
						<Tooltip text="Sync" position="bottom">
							<button aria-label="Sync" onClick={() => syncNotes()} class="relative flex items-center rounded-full">
								<img
									ref={refs.syncIcon}
									className={`w-5 h-5 rounded ${animate.sync && 'animate-spin'}`}
									src={iconRefresh}
									alt="refresh"
								/>
							</button>
						</Tooltip>
					</div>
					{/* Pull Button */}
					<div className="ml-5">
						<Tooltip text="Pull" position="bottom">
							<button aria-label="Pull" onClick={() => pullNotes()} class="relative flex items-center rounded-full">
								<img
									ref={refs.pullIcon}
									className={`w-5 h-5 rounded ${animate.pull && 'animate-ping'}`}
									src={iconDownloadCloud}
									alt="download"
								/>
							</button>
						</Tooltip>
					</div>
					{/* Profile Picture */}
				</Show>
				<div class="ml-5">
					<button aria-label="Profile" onClick={() => setModalProfile(true)} class="relative flex items-center rounded focus:ring focus:outline-none">
						<img
							class="w-8 h-8 rounded bg-gray-200"
							src={auth?.user_metadata.avatar_url || anonymous.user_metadata.avatar_url}
							alt="Profile picture"
						/>
						<div className="hidden sm:block sm:ml-2">{auth?.user_metadata.full_name}</div>
					</button>
					<div
						id="profile_popup"
						className={`
							absolute z-10 pr-4 top-12 right-2 w-48
							text-sm bg-white border rounded-lg shadow-md
							${modalProfile() ? '' : 'hidden'}
						`.trim()}
					>
						<span class="block sm:hidden w-full p-2 m-2 rounded border-b border-gray-200">{auth?.user_metadata.full_name}</span>
						<Show when={!auth}>
							<Link
								href="/login" 
								class="flex items-center w-full p-1 px-3 m-2 rounded-lg text-left hover:bg-gray-200"
							>
								<img
									src={iconLogIn}
									alt="log-in"
									className="w-4 h-4 mr-2"
								/>
								Login
							</Link>
						</Show>
						<Show when={auth}>
							<button onClick={signOut} class="flex items-center w-full p-1 px-3 m-2 rounded-lg text-left hover:bg-gray-200">
								<img
									ref={refs.logoutIcon}
									src={iconLogOut}
									alt="log-out"
									className="w-4 h-4 mr-2"
								/>
								Logout
							</button>
						</Show>
					</div>
				</div>
			</header>
			<Show when={!auth}>
				<div className="mt-3 p-2 text-center bg-blue-200">
					Login to backup your local notes to online server
					<Link href="/login" className="ml-3 p-1 px-2 text-sm rounded bg-blue-700 hover:bg-blue-900 text-gray-100">
						Login
					</Link>
				</div>
			</Show>
		</>
	)
}

export default Header