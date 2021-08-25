import { onMount, createEffect, onCleanup, createSignal } from "solid-js"
import { useNote } from "../../store/NoteContext"
import { notesCreate, notesFormat } from '../../models/notes'
// Components
import FormNav from "./FormNav"
import FormColor from "./FormColor"
import FormTags from "./FormTags"
import FormTextarea from "./FormTextarea"
import FormLeaveConfirm from "./FormLeaveConfirm"
import preventBack from "../../helper/prevent-back"

const propsTypes = {
	scrollY: () => ({ notes: 0 }),
	setScrollY: () => null,
	setRoute: () => null,
}

const NoteCreate = (props = propsTypes) => {
	const {scrollY, setScrollY, setRoute} = props
	const [warnOnExit, setWarnOnExit] = createSignal(false)
	const [modal, setModal] = createSignal(false)
	const [formData, setFormData] = createSignal(notesFormat)
	const [, setNote] = useNote()
	const formDataRef = formData()

	/**
	 * Navigate back to notes list
	 */
	const navigateBack = (forceNavigate = false) => {
		if (warnOnExit() && !forceNavigate) {
			setModal(true)
			return
		}

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

		formData().id = Date.now()
		setNote('list', n => [formData(), ...n])
		navigateBack(true)
		setScrollY(x => ({...x, notes: document.body.scrollHeight}))
		await notesCreate(formData())
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
		preventBack(navigateBack)
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
			<form onSubmit={submitNote} onInput={warnWhenClose}>
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

export default NoteCreate