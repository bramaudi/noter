import { toIsoString } from '../helper/date'
import supabase, { auth } from '../services/supabase'

const structure = {
	title: '',
	body: '',
	tags: [],
	color: '#fff',
	created_at: toIsoString(new Date()),
	updated_at: null,
	user_id: auth.id
}

const index = async (lastId = 0, limit = 10) => {
	return await supabase
		.from('notes')
		.select()
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
	return await supabase
		.from('notes')
		.insert(data)
}

export default {
	structure,
	index,
	read,
	store
}