import { PostgrestError } from '@supabase/supabase-js'
import { toIsoString } from '@helper/date'
import { compressToBase64, decompressFromBase64 } from 'lz-string'
import supabase from '@services/supabase'
import { auth } from '@services/auth'

interface Output {
	error: Error | PostgrestError | null
	data: NoteFormat[]
}

export interface NoteFormat {
	id: number
	title: string|null
	body: string|null
	tags: string[]
	color: string|null
	created_at: string
	updated_at: string
	user_id: string
}

export const noteEmpty: NoteFormat = {
	id: 0,
	title: '',
	body: '',
	tags: [],
	color: null,
	created_at: toIsoString(new Date()),
	updated_at: toIsoString(new Date()),
	user_id: auth?.id || ''
}

const lz = (str='') => compressToBase64(str)
const delz = (str='') => decompressFromBase64(str)

/**
 * Set localstorage notes
 */
const setLocalNotes = (notes: NoteFormat[]): void =>
	localStorage.setItem('notes', lz(JSON.stringify(notes)))

/**
 * Order notes[] by updated_at descending
 */
const notesOrder = (a: NoteFormat, b: NoteFormat): number => {
	const dateA = new Date(a.updated_at).getTime()
	const dateB = new Date(b.updated_at).getTime()
	return dateB - dateA
}

/**
 * Decompress title / body of note
 * @param note Compressed note
 * @returns Decompressed note
 */
export const notesDecompress = (note: NoteFormat): NoteFormat => {
	const title = note.title ? delz(note.title) : ''
	const body = note.body ? delz(note.body) : ''
	return {...note, title, body}
}

/**
 * Get localstorage notes
 * @param decompress Select return with compressed/decompressed
 */
 export const getLocalNotes = (decompress = false): NoteFormat[] => {
	const json = delz(localStorage.getItem('notes') || lz('[]'))
	const notes: NoteFormat[] = JSON.parse(json || '[]').sort(notesOrder)
	return decompress ? notes.map(notesDecompress) : notes
}

/**
 * Fetch notes from server
 * @param startId Fetch notes start after this id
 * @param limit Number of notes
 * @returns Compressed notes
 */
export const notesFetch = async (startId: number = 0, limit: number = 10): Promise<Output> => {
	try {
		let captureError = null
		if (auth) {
			const {data, error} = await supabase
				.from('notes')
				.select()
				.eq('user_id', auth.id)
				.gt('id', startId)
				.limit(limit)
			
			captureError = error;
			const notes = [...getLocalNotes(), ...data!]
			const uniqNotes = [...new Map(notes.map(item => [item['id'], item])).values()]
			setLocalNotes(uniqNotes)
			notesBackup()
		}

		return {
			data: getLocalNotes(),
			error: captureError
		}
	} catch (error) {
		return {
			data: getLocalNotes(),
			error
		}
	}
}

/**
 * Backup by overwriting server data
 * @returns Uncompressed notes
 */
export const notesBackup = async (): Promise<NoteFormat[]> => {
	const assignUserId = (note: NoteFormat) => {
		if (auth) return {...note, user_id: auth.id }
		else return note
	}
	const notes = getLocalNotes().sort(notesOrder).map(assignUserId)
	await supabase.from('notes').delete()
	await supabase.from('notes').insert(notes)
	return notes
}

/**
 * Pull online notes and overwrite local
 */
export const notesOverwriteLocal = async (): Promise<Output> => {
	const {data, error} = await notesFetch()
	const notes = data.map(notesDecompress)
	return {data: notes, error}
}

/**
 * Store new note
 * @param {NoteFormat} data Note
 * @returns Updated notes
 */
export const notesCreate = async (data: NoteFormat): Promise<Output> => {
	const updatedAt = new Date()
	updatedAt.setSeconds(updatedAt.getSeconds() + 1)

	const noteObj = {
		...noteEmpty,
		...data,
		title: (data.title !== '') ? lz(data.title!) : '',
		body: (data.body !== '') ? lz(data.body!) : '',
		updated_at: toIsoString(updatedAt)
	}
	
	const updatedNotes = [...getLocalNotes(), noteObj]
	setLocalNotes(updatedNotes)

	try {
		let captureError = null
		if (auth) {
			const {error} = await supabase
				.from('notes')
				.insert(noteObj)

			captureError = error
		}

		return {
			data: updatedNotes,
			error: captureError
		}
	} catch (error) {
		return {
			data: updatedNotes,
			error
		}
	}
}

/**
 * Update note
 * @param {NoteFormat} data Note
 * @returns Updated notes
 */
export const notesUpdate = async (data: NoteFormat): Promise<Output> => {
	const noteObj = {
		...noteEmpty,
		...data,
		title: (data.title !== '') ? lz(data.title!) : '',
		body: (data.body !== '') ? lz(data.body!) : '',
		updated_at: toIsoString(new Date())
	}

	const updatedNotes = getLocalNotes()
	// Patch matching id with new note object
	setLocalNotes(updatedNotes.map(x => (x.id === noteObj.id) ? noteObj : x))
	
	try {
		let captureError = null
		if (auth) {
			const {error} = await supabase
				.from('notes')
				.update(noteObj)
				.match({
					id: noteObj.id,
					user_id: auth.id
				})

			captureError = error
		}
		
		return {
			data: updatedNotes,
			error: captureError
		}
	} catch (error) {
		return {
			data: updatedNotes,
			error
		}
	}
}

/**
 * Remove note
 * @param {Number} id Note id to remove
 * @returns Updated notes
 */
export const notesRemove = async (id: number): Promise<Output> => {
	const updatedNotes = getLocalNotes().filter(n => n.id !== id)
	setLocalNotes(updatedNotes)

	try {
		let captureError = null
		if (auth) {
			const {error} = await supabase
				.from('notes')
				.delete()
				.eq('id', id)

			captureError = error
		}

		return {
			data: updatedNotes,
			error: captureError
		}
	} catch (error) {
		return {
			data: updatedNotes,
			error
		}
	}
}
