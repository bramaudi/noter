import { onMount, createEffect, onCleanup, createSignal } from "solid-js"
import { useNavigate } from "solid-app-router"
import { toIsoString } from "@helper/date"
import { useNote } from "@context/note"
import { notesUpdate } from '@models/notes'
// Components
import FormNav from "@components/note/FormNav"
import FormColor from "@components/note/FormColor"
import FormTags from "@components/note/FormTags"
import FormTextarea from "@components/note/FormTextarea"
import FormLeaveConfirm from "@components/note/FormLeaveConfirm"

const NoteEdit = () => {
	const [note, setNote] = useNote()
	const [warnOnExit, setWarnOnExit] = createSignal(false)
	const [modal, setModal] = createSignal(false)
	const [formData, setFormData] = createSignal(note.single)
	const navigate = useNavigate()
	const formDataRef = formData()

	/**
	 * Navigate back to notes list
	 */
	 const navigateBack = (forceNavigate = false) => {
		if (warnOnExit() && !forceNavigate) {
			setModal(true)
			return
		}

		navigate('/notes/read')
	}
	/**
	 * Submit update note
	 */
	const submitEditNote = async (e: Event) => {
		e.preventDefault()
		// if nothing changes then go back
		if (JSON.stringify(formData()) === JSON.stringify(note.single)) {
			navigateBack()
			return
		}

		formData().updated_at = toIsoString(new Date())
		setNote('single', formData())
		setNote('list', n => n.map(x => x.id == formData().id ? formData() : x))
		navigateBack(true)
		await notesUpdate(formData())
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