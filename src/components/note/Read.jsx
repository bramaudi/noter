import { onMount, createEffect, onCleanup, createSignal } from 'solid-js'
// Utilities
import notesModel from '../../models/notes'
import { useNote } from '../../store/NoteContext'
import { invertToBW } from '../../helper/style'
import { encodeHTMLEntities, nl2br } from '../../helper/string'
// Components
import iconArrowRight from '../../assets/icons/arrow-right.svg'
import iconTrash from '../../assets/icons/trash.svg'
import iconEdit from '../../assets/icons/edit-2.svg'
import Tooltip from '../Tooltip'
import Modal from '../Modal'

const propsTypes = {
	scrollY: () => ({ notes: 0, read: 0 }),
	setScrollY: () => null,
	setRoute: () => null,
}

const NoteRead = (props = propsTypes) => {
	const refs = { modalDeleteBtn: null }
	const {scrollY, setScrollY, setRoute} = props
	const [note, setNote] = useNote()
	const [modal, setModal] = createSignal(false)

	// Navigate back to notes list
	const navigateBack = () => {
		let lastY = scrollY().notes
		setRoute('notes')
		window.scrollTo(window, lastY)
	}
	// Proccess note deletion
	const commitDelete = async () => {
		try {
			setNote('list', n => n.filter(x => x.id !== note.single.id))
			navigateBack()
			await notesModel.remove(note.single.id)
		} catch (error) {
			alert(error)
		}
	}
	// Navigate to edit section >>
	const navigateEdit = () => {
		setRoute('edit')
		setScrollY(x => ({ ...x, read: window.scrollY }))
	}
	/**
	 * Navigate back on escape
	 * @param {KeyboardEvent} event 
	 */
	const navigateEscapeEvent = (event) => {
		if (event.key === 'Escape') navigateBack()
	}
	/**
	 * Navigate to edit on Ctrl+E
	 * @param {KeyboardEvent} event 
	 */
	 const navigateEditEvent = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			navigateEdit()
		}
	}
	/**
	 * Popup deletion modal on "Delete" key
	 * @param {KeyboardEvent} event 
	 */
	 const navigateDeleteEvent = (event) => {
		if (event.key === 'Delete') {
			setModal(true)
		}
	}
	
	onMount(() => {
		// restore scrollY
		window.scrollTo(window, scrollY().read)
		window.addEventListener('keydown', navigateEditEvent)
		window.addEventListener('keydown', navigateDeleteEvent)
		window.addEventListener('keydown', navigateEscapeEvent)
	})
	createEffect(() => {
		// prevent escape key event conflict
		if (modal()) {
			window.removeEventListener('keydown', navigateEscapeEvent)
			refs.modalDeleteBtn.focus()
		}
		else {
			window.addEventListener('keydown', navigateEscapeEvent)
		}
	})
	onCleanup(() => {
		window.removeEventListener('keydown', navigateEditEvent)
		window.removeEventListener('keydown', navigateEscapeEvent)
		window.removeEventListener('keydown', navigateDeleteEvent)
	})
	
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
				<div className="font-semibold" className={note.single.title && 'mb-3'}>{note.single.title}</div>
				<div className="break-words" innerHTML={nl2br(encodeHTMLEntities(note.single.body))}></div>
			</div>
		</div>
	)
}

export default NoteRead