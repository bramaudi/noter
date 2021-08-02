import { toIsoString } from '../helper/date'
import supabase, { auth } from '../services/supabase'
import { encrypt, decrypt } from '../services/encryption'

const structure = {
	id: 0,
	title: '',
	body: '',
	tags: [],
	color: '#fff',
	created_at: toIsoString(new Date()),
	updated_at: null,
	user_id: auth?.id || ''
}

/**
 * Order notes[] by updated_at, created_at descending
 */
const order = (a, b) => {
	return new Date(b.updated_at) - new Date(a.updated_at)
			|| new Date(b.created_at) - new Date(a.created_at)
}

/**
 * Decrypt title / body of note
 * @param {structure} note Encrypted note
 * @returns {structure} Decrypted note
 */
const decryptNote = (note) => {
	const title = note.title ? decrypt(note.title, auth.id) : ''
	const body = note.body ? decrypt(note.body, auth.id) : ''
	return {...note, title, body}
}

/**
 * List of notes
 * @param {Number} lastId Last notes id
 * @param {Number} limit Number of notes
 * @returns {Promise}
 */
const index = async (lastId = 0, limit = 10) => {
	return await supabase
		.from('notes')
		.select()
		.order('updated_at', { ascending: false })
		.order('created_at', { ascending: false })
		.gt('id', lastId)
		.limit(limit)
}

/**
 * Read single note
 * @param {Number} id Note's id
 * @returns {Promise}
 */
const read = async (id) => {
	return await supabase
		.from('notes')
		.select()
		.eq('id', id)
		.single()
}

/**
 * Store new note
 * @param {structure} data Note
 * @returns {Promise}
 */
const store = async (data) => {
	if (data.body !== '') data.body = encrypt(data.body, auth.id)
	if (data.title !== '') data.title = encrypt(data.title, auth.id)
	return await supabase
		.from('notes')
		.insert(data)
}

/**
 * Update note
 * @param {structure} data Note
 * @returns {Promise}
 */
const update = async (data) => {
	if (data.body !== '') data.body = decrypt(data.body, auth.id)
	if (data.title !== '') data.title = decrypt(data.title, auth.id)
	return await supabase
		.from('notes')
		.update(data)
		.match({ id: data.id })
}

/**
 * Remove note
 * @param {Number} id Note's id
 * @returns 
 */
const remove = async (id) => {
	return await supabase
		.from('notes')
		.delete()
		.eq('id', id)
}

export default {
	structure,
	order,
	decryptNote,
	index,
	read,
	store,
	update,
	remove
}