import supabase from '../services/supabase'

const index = async (lastId = 0, limit = 10) => {
	return await supabase
		.from('notes')
		.select()
		.gt('id', lastId)
		.limit(limit)
}

export {
	index
}