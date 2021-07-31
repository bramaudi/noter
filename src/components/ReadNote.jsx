import notesModel from '../models/notes'
import iconArrowRight from '../assets/icons/arrow-right.svg'
import { invertToBW } from '../helper/style'

const defaultProps = {
	note: () => notesModel.structure,
	setRoute: () => null,
	scrollLastY: 0,
}

const ReadNote = (props = defaultProps) => {
	const { note, setRoute, scrollLastY } = props
	const navigateBack = () => {
		setRoute('notes')
		window.scrollTo(window, scrollLastY)
	}
	const nl2br = (str = '') => {
		return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br />')
	}
	return (
		<div className="p-3 mx-auto min-h-screen max-w-xl">
			<button onClick={() => navigateBack()} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400">
				<img className="w-5 h-5 transform -rotate-180" src={iconArrowRight} alt="back" />
			</button>
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