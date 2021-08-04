import { createSignal, onMount } from 'solid-js'
// Utilities
import notesModel, { structure } from '../models/notes'
import { invertToBW } from '../helper/style'
import { encodeHTMLEntities, nl2br } from '../helper/string'
// Components
import Tooltip from './Tooltip'
import Modal from './Modal'
import iconArrowRight from '../assets/icons/arrow-right.svg'
import iconTrash from '../assets/icons/trash.svg'
import iconEdit from '../assets/icons/edit-2.svg'

const propsTypes = {
	note: () => structure,
	scrollY: () => ({ notes: 0, read: 0 }),
	setScrollY: () => null,
	setRoute: () => null,
	setNotes: () => null,
}

const ReadNote = (props = propsTypes) => {
	const { note, scrollY, setScrollY, setRoute, setNotes } = props
	const [modal, setModal] = createSignal(false)
	// Navigate back to notes list
	const navigateBack = () => {
		let lastY = scrollY().notes
		setRoute('notes')
		window.scrollTo(window, lastY)
	}
	// Proccess note deletion
	const commitDelete = () => {
		notesModel.remove(note().id)
		setNotes(n => n.filter((item) => {
			return item.id !== note().id
		}))
		navigateBack()
	}
	// Navigate to edit section >>
	const navigateEdit = () => {
		setRoute('edit')
		setScrollY(x => ({ ...x, read: window.scrollY }))
	}
	
	onMount(() => {
		// restore scrollY
		window.scrollTo(window, scrollY().read)
	})
	return (
		<div className="p-3 mx-auto min-h-screen max-w-xl">
			<Modal show={modal} onClose={() => setModal(false)}>
				<div className="p-2">Delete this note?</div>
				<div className="p-2 flex items-center">
					<button onClick={commitDelete} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-red-300 hover:bg-red-400">
						Delete
					</button>
					<button onClick={() => setModal(false)} type="button" className="cursor-pointer p-2 ml-auto">
						Cancel
					</button>
				</div>
				<div className="p-2 text-xs text-red-600">This action cannot be undone.</div>
			</Modal>
			<div className="flex items-center">
				{/* Back */}
				<button onClick={() => navigateBack()} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400">
					<img className="w-5 h-5 transform -rotate-180" src={iconArrowRight} alt="back" />
				</button>
				{/* Delete */}
				<Tooltip position="bottom" text="Delete" className="ml-auto">
					<button onClick={() => setModal(true)} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-red-300 hover:bg-red-400">
						<img className="w-5 h-5" src={iconTrash} alt="back" />
					</button>
				</Tooltip>
				{/* Edit */}
				<Tooltip position="bottom" text="Edit" className="ml-3">
					<button onClick={navigateEdit} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400">
						<img className="w-5 h-5" src={iconEdit} alt="back" />
					</button>
				</Tooltip>
			</div>
			<div
				className="border rounded-lg p-3 mt-3"
				style={{ background: note().color, color: invertToBW(note().color) }}
			>
				<div className="font-semibold" className={note().title && 'mb-3'}>{note().title}</div>
				<div className="break-words" innerHTML={nl2br(encodeHTMLEntities(note().body))}></div>
			</div>
		</div>
	)
}

export default ReadNote