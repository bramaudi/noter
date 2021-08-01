import notesModel from '../models/notes'
import Tooltip from './Tooltip'
import Modal from './Modal'
import iconArrowRight from '../assets/icons/arrow-right.svg'
import iconTrash from '../assets/icons/trash.svg'
import iconEdit from '../assets/icons/edit-2.svg'
import { invertToBW } from '../helper/style'
import { createSignal, onMount } from 'solid-js'

const propsType = {
	note: () => notesModel.structure,
	scrollY: () => ({ notes: 0, read: 0 }),
	setScrollY: () => null,
	setRoute: () => null,
}

const ReadNote = (props = propsType) => {
	const { note, setRoute, scrollY, setScrollY } = props
	const [modal, setModal] = createSignal(false)
	const navigateBack = () => {
		let lastY = scrollY().notes
		setRoute('notes')
		window.scrollTo(window, lastY)
	}
	const nl2br = (str = '') => {
		return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br />')
	}
	const commitDelete = () => {
		// TODO: proccess delete
		 alert('Deleted')
	}
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
				<div className="mb-3 px-2 text-sm text-yellow-600">This action cannot be undo!</div>
				<div className="p-2 flex items-center">
					<button onClick={commitDelete} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-red-300 hover:bg-red-400">
						Delete
					</button>
					<button onClick={() => setModal(false)} type="button" className="cursor-pointer p-2 ml-auto">Cancel</button>
				</div>
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
				<div innerHTML={nl2br(note().body)}></div>
			</div>
		</div>
	)
}

export default ReadNote