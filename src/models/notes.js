import { toIsoString } from '../helper/date'
import supabase, { auth } from '../services/supabase'
import LZString from '../services/lz-string'

const now = toIsoString(new Date())

export const notesFormat = {
	id: 0,
	title: '',
	body: '',
	tags: [],
	color: null,
	created_at: now,
	updated_at: now,
	user_id: auth?.id || ''
}

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
	const title = note.title ? LZString.decompressFromBase64(note.title) : ''
	const body = note.body ? LZString.decompressFromBase64(note.body) : ''
	return {...note, title, body}
}

/**
 * List of notes
 * @param {Number} limit Number of notes
 * @returns {Promise}
 */
export const notesFetchAll = async (lastId = 0, limit = 10) => {
	const getLocalNotes = () => {
		const data = JSON.parse(LZString.decompressFromBase64(localStorage.getItem('notes'))) || []
		return data.sort(notesOrder)
	}

	try {
		const {data, error} = await supabase
			.from('notes')
			.select()
			.gt('id', lastId)
			.limit(limit)

		localStorage.setItem('notes', LZString.compressToBase64(JSON.stringify(data)))

		return {
			data: getLocalNotes(),
			error
		}
	} catch (error) {
		return {
			data: getLocalNotes(),
			error: { message: error }
		}
	}
}

/**
 * Store new note
 * @param {notesFormat} data Note
 * @returns {Promise}
 */
export const notesCreate = async (data) => {
	const updatedAt = new Date()
	updatedAt.setSeconds(updatedAt.getSeconds() + 10)

	const noteObj = {
		...notesFormat,
		...data,
		title: (data.title !== '') ? LZString.compressToBase64(data.title) : '',
		body: (data.body !== '') ? LZString.compressToBase64(data.body) : '',
		updated_at: toIsoString(updatedAt)
	}
	const updatedNotes = [
		...(JSON.parse(LZString.decompressFromBase64(localStorage.getItem('notes')))),
		noteObj
	]
	localStorage.setItem('notes', LZString.compressToBase64(JSON.stringify(updatedNotes)))

	try {
		const {error} = await supabase
			.from('notes')
			.insert(noteObj)

		return {
			data: updatedNotes,
			error
		}
	} catch (error) {
		return {
			data: updatedNotes,
			error: { message: error }
		}
	}
}

/**
 * Update note
 * @param {notesFormat} data Note
 * @returns {Promise}
 */
export const notesUpdate = async (data) => {
	const noteObj = {
		...notesFormat,
		...data,
		title: (data.title !== '') ? LZString.compressToBase64(data.title) : '',
		body: (data.body !== '') ? LZString.compressToBase64(data.body) : '',
		updated_at: toIsoString(new Date())
	}
	const updatedNotes = (JSON.parse(LZString.decompressFromBase64(localStorage.getItem('notes')))).map(item => (item.id === noteObj.id) ? noteObj : item)
	localStorage.setItem('notes', LZString.compressToBase64(JSON.stringify(updatedNotes)))

	try {
		const {error} = await supabase
			.from('notes')
			.update(noteObj)
			.match({ id: noteObj.id })
		
		return {
			data: updatedNotes,
			error
		}
	} catch (error) {
		return Promise.resolve({
			data: updatedNotes,
			error: { message: error }
		})
	}
}

/**
 * Remove note
 * @param {Number} id Note's id
 * @returns 
 */
export const notesRemove = async (id) => {
	const updatedNotes = JSON.parse(LZString.decompressFromBase64(localStorage.getItem('notes'))).filter(n => n.id !== id)
	localStorage.setItem('notes', LZString.compressToBase64(JSON.stringify(updatedNotes)))

	try {
		const {error} = await supabase
			.from('notes')
			.delete()
			.eq('id', id)

		return {
			data: updatedNotes,
			error
		}
	} catch (error) {
		return {
			data: updatedNotes,
			error: { message: error }
		}
	}
}

export const notesSync = async (pushLocal = false) => {
	// TODO: add last_sync column date on user profile

	// if local is empty -> fetch server
	const localNotes = JSON.parse(
		LZString.decompressFromBase64(localStorage.getItem('notes')) || '[]'
	) || []

	if (!localNotes.length) {
		return await notesFetchAll()
	}
	// else push local to server
	else {
		if (pushLocal) {
			await supabase.from('notes').delete()
			await supabase.from('notes').insert(localNotes.sort(notesOrder))
		}
		return {
			data: localNotes.sort(notesOrder),
			error: null
		}
	}
}