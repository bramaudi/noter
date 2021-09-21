import { onMount, createEffect, onCleanup, createSignal, Accessor } from "solid-js"
import { useNote } from "@context/note"
import { notesCreate, NoteFormat, noteEmpty } from "@models/notes"
// Components
import FormNav from "./FormNav"
import FormColor from "./FormColor"
import FormTags from "./FormTags"
import FormTextarea from "./FormTextarea"
import FormLeaveConfirm from "./FormLeaveConfirm"

type ScrollY = { notes: number, read: number }

const NoteCreate = ({ scrollY, setScrollY, setRoute } : {
	scrollY: Accessor<ScrollY>,
	setScrollY: Function,
	setRoute: Function,
}) => {
	const [warnOnExit, setWarnOnExit] = createSignal(false)
	const [modal, setModal] = createSignal(false)
	const [formData, setFormData] = createSignal<NoteFormat>(noteEmpty)
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
		window.scrollTo({
			top: lastY
		})
	}
	/**
	 * Submit new note
	 */
	const submitNote = async (event: Event) => {
		event.preventDefault()
		// If nothing to store then back to notes list
		if (formData().title === '' && formData().body === '') {
			return navigateBack()
		}

		formData().id = Date.now()
		setNote('list', n => [formData(), ...n])
		navigateBack(true)
		setScrollY((x: ScrollY) => ({...x, notes: document.body.scrollHeight}))
		await notesCreate(formData())
	}
	/**
	 * Navigate back on escape
	 */
	 const navigateEscapeEvent = (event: KeyboardEvent) => {
		if (event.key === 'Escape') navigateBack()
	}
	/**
	 * Warn user before exit to confirm saving note
	 */
	const warnWhenClose = () => {
		const formTouched = JSON.stringify(formData()) !== JSON.stringify(formDataRef)
		setWarnOnExit(!!formTouched)
	}
	const handlePopState = () => {
		navigateBack()
	}
	
	onMount(() => {
		window.addEventListener('popstate', handlePopState)
		window.addEventListener('keydown', navigateEscapeEvent)
	})
	createEffect(() => {
		modal()
			? window.removeEventListener('keydown', navigateEscapeEvent)
			: window.addEventListener('keydown', navigateEscapeEvent)
	})
	onCleanup(() => {
		window.removeEventListener('popstate', handlePopState)
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