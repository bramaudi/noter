import { toIsoString } from '../helper/date'
import supabase, { auth } from '../services/supabase'
import { encrypt, decrypt } from '../services/encryption'
import LZString from '../helper/lz-string'

const now = toIsoString(new Date())
const t = new Date();
t.setSeconds(t.getSeconds() + 10)

export const notesFormat = {
	id: 0,
	title: '',
	body: '',
	tags: [],
	color: '#fff',
	created_at: now,
	updated_at: toIsoString(t),
	user_id: auth?.id || ''
}

/**
 * Order notes[] by updated_at descending
 */
const notesOrder = (a, b) => {
	return new Date(b.updated_at) - new Date(a.updated_at)
}

/**
 * Decrypt title / body of note
 * @param {notesFormat} note Encrypted note
 * @returns {notesFormat} Decrypted note
 */
export const notesDecrypt = (note) => {
	if (!auth) return
	const title = note.title ? decrypt(note.title, auth.id) : ''
	const body = note.body ? decrypt(note.body, auth.id) : ''
	return {...note, title, body}
}

/**
 * List of notes
 * @param {Number} limit Number of notes
 * @returns {Promise}
 */
export const notesFetchAll = async (lastId = 0, limit = 10) => {
	const getLocalNotes = () => {
		const data = JSON.parse(LZString.decompress(localStorage.getItem('notes'))) || []
		return data.sort(notesOrder)
	}

	try {
		const {data, error} = await supabase
			.from('notes')
			.select()
			.order('updated_at', { ascending: false })
			.order('created_at', { ascending: false })
			.gt('id', lastId)
			.limit(limit)

		localStorage.setItem('notes', LZString.compress(JSON.stringify(data)))

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
	const noteObj = {
		...notesFormat,
		...data,
		title: (data.title !== '') ? encrypt(data.title, auth.id) : '',
		body: (data.body !== '') ? encrypt(data.body, auth.id) : '',
	}
	const updatedNotes = [
		...(JSON.parse(LZString.decompress(localStorage.getItem('notes')))),
		noteObj
	]
	localStorage.setItem('notes', LZString.compress(JSON.stringify(updatedNotes)))

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
		title: (data.title !== '') ? encrypt(data.title, auth.id) : '',
		body: (data.body !== '') ? encrypt(data.body, auth.id) : '',
	}
	const updatedNotes = (JSON.parse(LZString.decompress(localStorage.getItem('notes')))).map(item => (item.id === noteObj.id) ? noteObj : item)
	localStorage.setItem('notes', LZString.compress(JSON.stringify(updatedNotes)))

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
	const updatedNotes = JSON.parse(LZString.decompress(localStorage.getItem('notes'))).filter(n => n.id !== id)
	localStorage.setItem('notes', LZString.compress(JSON.stringify(updatedNotes)))

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
		LZString.decompress(localStorage.getItem('notes')) || '[]'
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