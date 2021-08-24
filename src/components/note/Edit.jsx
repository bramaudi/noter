import { onMount, createEffect, onCleanup, createSignal } from "solid-js"
import { toIsoString } from "../../helper/date"
import { useNote } from "../../store/NoteContext"
import { notesOrder, notesUpdate } from '../../models/notes'
// Components
import FormNav from "./FormNav"
import FormColor from "./FormColor"
import FormTags from "./FormTags"
import FormTextarea from "./FormTextarea"
import FormLeaveConfirm from "./FormLeaveConfirm"

const propsTypes = {
	setRoute: () => null,
}

const NoteEdit = (props = propsTypes) => {
	const {setRoute} = props
	const [note, setNote] = useNote()
	const [warnOnExit, setWarnOnExit] = createSignal(false)
	const [modal, setModal] = createSignal(false)
	const [formData, setFormData] = createSignal(note.single)
	const formDataRef = formData()

	/**
	 * Navigate back to notes list
	 */
	 const navigateBack = (forceNavigate = false) => {
		if (warnOnExit() && !forceNavigate) {
			setModal(true)
			return
		}

		setRoute('notes')
	}
	/**
	 * Submit update note
	 * @param {Event} e 
	 */
	const submitEditNote = async (e) => {
		e.preventDefault()
		// if nothing changes then go back
		if (JSON.stringify(formData()) === JSON.stringify(note.single)) {
			navigateBack()
			return
		}

		try {
			// update modified date
			formData().updated_at = toIsoString(new Date())
			// add changes to local state first
			setNote('single', formData())
			setNote('list', n => {
				return n
					.map(x => x.id == formData().id ? formData() : x)
					.sort(notesOrder)
			})
			navigateBack(true)
			// update note to server
			const { error } = await notesUpdate(formData())
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
	/**
	 * Warn user before exit to confirm saving note
	 */
	 const warnWhenClose = () => {
		const formTouched = JSON.stringify(formData()) !== JSON.stringify(formDataRef)
		setWarnOnExit(!!formTouched)
	}

	onMount(() => {
		window.addEventListener('keydown', navigateEscapeEvent)
	})
	createEffect(() => {
		modal()
			? window.removeEventListener('keydown', navigateEscapeEvent)
			: window.addEventListener('keydown', navigateEscapeEvent)
	})
	onCleanup(() => {
		window.removeEventListener('keydown', navigateEscapeEvent)
	})
	
	return (
		<div className="p-3 mx-auto max-w-xl">
			<FormLeaveConfirm
				signal={[modal, setModal]}
				onConfirm={() => navigateBack(true)}
			/>
			<form onSubmit={submitEditNote} onInput={warnWhenClose}>
				<FormNav
					signal={[formData, setFormData]}
					onBack={() => navigateBack()}
				/>
				<FormTextarea signal={[formData, setFormData]} />
				<FormColor setFormData={setFormData} />
				<FormTags signal={[formData, setFormData]} />
			</form>
		</div>
	)
}

export default NoteEdit