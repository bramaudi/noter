import { useParams } from "solid-app-router"
import { createSignal, onMount } from "solid-js"
import supabase from "../../supabase"

const readNote = () => {
	const params = useParams()
	const [note, setNote] = createSignal({})
	const fetchNote = async () => {
		const { data, error } = await supabase
			.from('notes')
			.select()
			.eq('id', params.id)
		if (error) console.error(error.message)
		setNote(data[0])
	}
	onMount(async () => {
		fetchNote()
	})
	return (
		<div className="p-5">
			<h1 className="text-lg font-semibold">{note().title}</h1>
			<div>
				{note().body}
			</div>
		</div>
	)
}

export default readNote