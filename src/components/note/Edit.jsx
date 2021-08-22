import { onMount, onCleanup, createSignal } from "solid-js"
import { toIsoString } from "../../helper/date"
import { useNote } from "../../store/NoteContext"
import notesModel from '../../models/notes'
// Components
import FormNav from "./FormNav"
import FormColor from "./FormColor"
import FormTags from "./FormTags"
import FormTextarea from "./FormTextarea"

const propsTypes = {
	setRoute: () => null,
}

const NoteEdit = (props = propsTypes) => {
	const {setRoute} = props
	const [note, setNote] = useNote()
	const [formData, setFormData] = createSignal(note.single)

	/**
	 * Submit update note
	 * @param {Event} e 
	 */
	const submitEditNote = async (e) => {
		e.preventDefault()
		// if nothing changes then go back
		if (JSON.stringify(formData()) === JSON.stringify(note.single)) {
			return setRoute('read')
		}

		try {
			// update modified date
			formData().updated_at = toIsoString(new Date())
			// add changes to local state first
			setNote('single', formData())
			setNote('list', n => {
				return n
					.map(x => x.id == formData().id ? formData() : x)
					.sort(notesModel.order)
			})
			// navigate back
			setRoute('read')
			// update note to server
			const { error } = await notesModel.update(formData())
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
		if (event.key === 'Escape') setRoute('read')
	}

	onMount(() => {
		window.addEventListener('keydown', navigateEscapeEvent)
	})
	onCleanup(() => {
		window.removeEventListener('keydown', navigateEscapeEvent)
	})
	
	return (
		<div className="p-3 mx-auto max-w-xl">
			<form onSubmit={submitEditNote}>
				<FormNav
					signal={[formData, setFormData]}
					onBack={() => setRoute('read')}
				/>
				<FormTextarea signal={[formData, setFormData]} />
				<FormColor setFormData={setFormData} />
				<FormTags signal={[formData, setFormData]} />
			</form>
		</div>
	)
}

export default NoteEdit