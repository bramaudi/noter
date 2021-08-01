import { toIsoString } from '../helper/date'
import supabase, { auth } from '../services/supabase'

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

const order = (a, b) => {
	return new Date(b.updated_at) - new Date(a.updated_at)
			|| new Date(b.created_at) - new Date(a.created_at)
}

const index = async (lastId = 0, limit = 10) => {
	return await supabase
		.from('notes')
		.select()
		.order('updated_at', { ascending: false })
		.order('created_at', { ascending: false })
		.gt('id', lastId)
		.limit(limit)
}

const read = async (id) => {
	return await supabase
		.from('notes')
		.select()
		.eq('id', id)
		.single()
}

const store = async (data) => {
	delete data.id
	return await supabase
		.from('notes')
		.insert(data)
}

const update = async (data) => {
	return await supabase
		.from('notes')
		.update(data)
		.match({ id: data.id })
}

const remove = async (noteId) => {
	return await supabase
		.from('notes')
		.delete()
		.eq('id', noteId)
}

export default {
	structure,
	order,
	index,
	read,
	store,
	update,
	remove
}