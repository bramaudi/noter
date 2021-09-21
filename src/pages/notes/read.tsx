import { onMount, createEffect, onCleanup, createSignal } from 'solid-js'
import { useNavigate } from "solid-app-router"
// Utilities
import { notesRemove } from "@models/notes"
import { useNote } from "@context/note"
import { invertToBW } from "@helper/style"
import { parseURL, nl2br } from "@helper/string"
// Components
import iconArrowRight from "@assets/icons/arrow-right.svg"
import iconTrash from "@assets/icons/trash.svg"
import iconEdit from "@assets/icons/edit-2.svg"
import Tooltip from "@components/Tooltip"
import Modal from "@components/Modal"

const ReadPage = () => {
	const refs: { modalDeleteBtn?: HTMLButtonElement } = {}
	const [note, setNote] = useNote()
	const [modal, setModal] = createSignal(false)
	const navigate = useNavigate()

	// Navigate back to notes list
	const navigateBack = () => {
		// let lastY = scrollY().notes
		navigate('/notes')
		// window.scrollTo({ top: lastY })
	}
	// Proccess note deletion
	const commitDelete = async () => {
		setNote('list', n => n.filter(x => x.id !== note.single.id))
		navigateBack()
		await notesRemove(note.single.id)
	}
	// Navigate to edit section >>
	const navigateEdit = () => {
		navigate('/notes/edit')
		// setScrollY((x: ScrollY) => ({ ...x, read: window.scrollY }))
	}
	/**
	 * Navigate back on escape
	 */
	const navigateEscapeEvent = (event: KeyboardEvent) => {
		if (event.key === 'Escape') navigateBack()
	}
	/**
	 * Navigate to edit on Ctrl+E
	 */
	 const navigateEditEvent = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			navigateEdit()
		}
	}
	/**
	 * Popup deletion modal on "Delete" key
	 */
	 const navigateDeleteEvent = (event: KeyboardEvent) => {
		if (event.key === 'Delete') {
			setModal(true)
		}
	}
	const handlePopState = () => {
		navigateBack()
	}
	
	onMount(() => {
		if (!note.single.title && !note.single.body) {
			navigate('/notes')
		}
		// restore scrollY
		// window.scrollTo({ top: scrollY().read })
		window.addEventListener('popstate', handlePopState)
		window.addEventListener('keydown', navigateEditEvent)
		window.addEventListener('keydown', navigateDeleteEvent)
		window.addEventListener('keydown', navigateEscapeEvent)
	})
	createEffect(() => {
		// prevent escape key event conflict
		if (modal()) {
			window.removeEventListener('keydown', navigateEditEvent)
			window.removeEventListener('keydown', navigateEscapeEvent)
			refs.modalDeleteBtn.focus()
		}
		else {
			window.addEventListener('keydown', navigateEditEvent)
			window.addEventListener('keydown', navigateEscapeEvent)
		}
	})
	onCleanup(() => {
		window.removeEventListener('popstate', handlePopState)
		window.removeEventListener('keydown', navigateEditEvent)
		window.removeEventListener('keydown', navigateEscapeEvent)
		window.removeEventListener('keydown', navigateDeleteEvent)
	})
	
	const noteBody = (str ='') => {
		str = str.replace(/</g, '&lt;')
		str = nl2br(str)
		str = parseURL(str)
		return str
	}

	return (
		<div className="p-3 mx-auto min-h-screen max-w-xl">
			<Modal signal={[modal, setModal]}>
				<div className="p-2">Delete this note?</div>
				<div className="p-2 flex items-center">
					<button
						onClick={commitDelete}
						ref={refs.modalDeleteBtn}
						type="button"
						className="cursor-pointer p-2 rounded whitespace-nowrap bg-red-300 hover:bg-red-400 focus:ring focus:outline-none"
					>
						Delete
					</button>
					<button
						onClick={() => setModal(false)}
						type="button"
						className="cursor-pointer p-2 rounded ml-auto focus:ring focus:outline-none"
					>
						Cancel
					</button>
				</div>
				<div className="p-2 text-xs text-red-600">This action cannot be undone.</div>
			</Modal>
			<div className="flex items-center">
				{/* Back */}
				<Tooltip position="bottom" text="Back (Esc)">
					<button onClick={() => navigateBack()} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400 focus:ring focus:outline-none">
						<img className="w-5 h-5 transform -rotate-180" src={iconArrowRight} alt="back" />
					</button>
				</Tooltip>
				{/* Delete */}
				<Tooltip position="bottom" text="Delete (Del)" className="ml-auto">
					<button onClick={() => setModal(true)} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-red-300 hover:bg-red-400 focus:ring focus:outline-none">
						<img className="w-5 h-5" src={iconTrash} alt="back" />
					</button>
				</Tooltip>
				{/* Edit */}
				<Tooltip position="bottom" text="Edit (Enter)" className="ml-3">
					<button onClick={navigateEdit} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400 focus:ring focus:outline-none">
						<img className="w-5 h-5" src={iconEdit} alt="back" />
					</button>
				</Tooltip>
			</div>
			<div
				className="border rounded-lg p-3 mt-3"
				style={{ background: note.single.color, color: invertToBW(note.single.color) }}
			>
				<div className={`font-semibold ${note.single.title ? 'mb-3' : ''}`}>{note.single.title}</div>
				<div className="break-words" innerHTML={noteBody(note.single.body)}></div>
			</div>
		</div>
	)
}

export default ReadPage