import { useParams } from "solid-app-router"
import { createSignal, onMount } from "solid-js"
import notesModel from '../../models/notes-dummy'

const readNote = () => {
	const params = useParams()
	const [note, setNote] = createSignal({})
	const fetchNote = () => {
		const { error, data } = notesModel.read(params.id)
		if (error) return console.error(error)
		setNote(data[0])
	}
	onMount(async () => {
		fetchNote()
		console.log(note());
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