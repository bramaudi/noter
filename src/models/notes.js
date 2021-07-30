import supabase from '../services/supabase'

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

export {
	index,
	read,
	store
}