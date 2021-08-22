import { onMount, onCleanup, createSignal } from "solid-js"
import { useNote } from "../../store/NoteContext"
import notesModel from '../../models/notes'
// Components
import FormNav from "./FormNav"
import FormColor from "./FormColor"
import FormTags from "./FormTags"
import FormTextarea from "./FormTextarea"

const propsTypes = {
	scrollY: () => ({ notes: 0 }),
	setScrollY: () => null,
	setRoute: () => null,
}

const NoteCreate = (props = propsTypes) => {
	const {scrollY, setScrollY, setRoute} = props
	const [formData, setFormData] = createSignal(notesModel.structure)
	const [, setNote] = useNote()

	/**
	 * Navigate back to notes list
	 */
	const navigateBack = () => {
		let lastY = scrollY().notes
		setRoute('notes')
		window.scrollTo(window, lastY)
	}
	/**
	 * Submit new note
	 * @param {Event} event
	 */
	const submitNote = async (event) => {
		event.preventDefault()
		// If nothing to store then back to notes list
		if (formData().title === '' && formData().body === '') {
			return navigateBack()
		}

		try {
			// generate time-based id
			formData().id = Date.now()
			// append latest added note to current local notes
			setNote('list', n => [...n, formData()].sort(notesModel.order))
			// navigate back & scroll to bottom
			setRoute('notes')
			setScrollY(x => ({...x, notes: document.body.scrollHeight}))
			// store new note to server
			const { error } = await notesModel.store(formData())
			if (error) alert(error.message)
		}
		catch (error) {
			alert(error)
		}
	}
	/**
	 * Navigate back on escape
	 * @param {KeyboardEvent} event 
	 */
	 const navigateEscapeEvent = (event) => {
		if (event.key === 'Escape') navigateBack()
	}
	onMount(() => {
		window.addEventListener('keydown', navigateEscapeEvent)
	})
	onCleanup(() => {
		window.removeEventListener('keydown', navigateEscapeEvent)
	})
	
	return (
		<div className="p-3 mx-auto max-w-xl">
			<form onSubmit={submitNote}>
				<FormNav
					signal={[formData, setFormData]}
					onBack={() => setRoute('notes')}
				/>
				<FormTextarea signal={[formData, setFormData]} />
				<FormColor setFormData={setFormData} />
				<FormTags signal={[formData, setFormData]} />
			</form>
		</div>
	)
}

export default NoteCreate