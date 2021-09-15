import { toIsoString } from '../helper/date'
import supabase, { auth } from '../services/supabase'
import LZString from '../services/lz-string'

export const notesFormat = {
	id: 0,
	title: '',
	body: '',
	tags: [],
	color: null,
	created_at: toIsoString(new Date()),
	updated_at: toIsoString(new Date()),
	user_id: auth?.id || ''
}

const lz = (str='') => LZString.compressToBase64(str)
const delz = (str='') => LZString.decompressFromBase64(str)

/**
 * Set localstorage notes
 * @param {Array} val
 * @returns 
 */
const setLocalNotes = (val) => localStorage.setItem('notes', lz(JSON.stringify(val)))

/**
 * Order notes[] by updated_at descending
 */
 const notesOrder = (a, b) => {
	return new Date(b.updated_at) - new Date(a.updated_at)
}

/**
 * Decompress title / body of note
 * @param {notesFormat} note Compressed note
 * @returns {notesFormat} Decompressed note
 */
export const notesDecompress = (note) => {
	const title = note.title ? delz(note.title) : ''
	const body = note.body ? delz(note.body) : ''
	return {...note, title, body}
}

/**
 * Get localstorage notes
 * @param {boolean} decompress Select return with compressed/decompressed
 * @returns {Array<notesFormat>} Array
 */
 export const getLocalNotes = (decompress = false) => {
	const json = delz(localStorage.getItem('notes') || lz('[]'))
	const notes = JSON.parse(json).sort(notesOrder)
	return decompress ? notes.map(notesDecompress) : notes
}

/**
 * Fetch notes from server
 * @param {Number} lastId Fetch notes start after this id
 * @param {Number} limit Number of notes
 * @returns {Array<notesFormat>} Compressed notes
 */
export const notesFetch = async (lastId = 0, limit = 10) => {
	try {
		let captureError = null
		if (!auth?.anonymous) {
			const {data, error} = await supabase
				.from('notes')
				.select()
				.eq('user_id', auth.id)
				.gt('id', lastId)
				.limit(limit)
			
			captureError = error;
			const notes = [...getLocalNotes(), ...data]
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
 * @returns {Array<notesFormat>} Uncompressed notes
 */
export const notesBackup = async () => {
	const assignUserId = note => ({...note, user_id: auth.id || null })
	const notes = getLocalNotes().sort(notesOrder).map(assignUserId)
	await supabase.from('notes').delete()
	await supabase.from('notes').insert(notes)
	return notes
}

/**
 * Pull online notes and overwrite local
 * @returns {{
 * 		data: Array<notesFormat>,
 * 		error: string|null
 * }}
 */
export const notesOverwriteLocal = async () => {
	setLocalNotes([])
	const {data, error} = await notesFetch()
	const notes = data.map(notesDecompress)
	setLocalNotes(notes)
	return {data: notes, error}
}

/**
 * Store new note
 * @param {notesFormat} data Note
 * @returns {Array<notesFormat>}
 */
export const notesCreate = async (data) => {
	const updatedAt = new Date()
	updatedAt.setSeconds(updatedAt.getSeconds() + 1)

	const noteObj = {
		...notesFormat,
		...data,
		title: (data.title !== '') ? lz(data.title) : '',
		body: (data.body !== '') ? lz(data.body) : '',
		updated_at: toIsoString(updatedAt)
	}
	const updatedNotes = [...getLocalNotes(), noteObj]
	setLocalNotes(updatedNotes)

	try {
		let captureError = null
		if (!auth.anonymous) {
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
 * @param {notesFormat} data Note
 * @returns {Array<notesFormat>}
 */
export const notesUpdate = async (data) => {
	const noteObj = {
		...notesFormat,
		...data,
		title: (data.title !== '') ? lz(data.title) : '',
		body: (data.body !== '') ? lz(data.body) : '',
		updated_at: toIsoString(new Date())
	}

	const updatedNotes = getLocalNotes()
	// Patch matching id with new note object
	setLocalNotes(updatedNotes.map(x => (x.id === noteObj.id) ? noteObj : x))
	
	try {
		let captureError = null
		if (!auth.anonymous) {
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
 * @returns {Array<notesFormat>}
 */
export const notesRemove = async (id) => {
	const updatedNotes = getLocalNotes().filter(n => n.id !== id)
	setLocalNotes(updatedNotes)

	try {
		let captureError = null
		if (!auth.anonymous) {
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
