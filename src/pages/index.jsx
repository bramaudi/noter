import { createSignal, onMount, Show } from "solid-js"
// Services
import auth from '../services/auth'
import notesModel from '../models/notes-dummy'
// Components
import Header from '../components/Header'
import FloatActionButton from '../components/FloatActionButton'
import Welcome from '../components/Welcome'
import Notes from "../components/Notes"

const Home = () => {
	const [notes, setNotes] = createSignal([])
	const fetchNotes = () => {
		const { error, data } = notesModel.index()
		if (error) console.error(error)
		setNotes(data)
	}
	onMount(() => {
		fetchNotes()
	})
	
	return (
		<>
			<Show when={auth}>
				<Header />
				<Notes notes={notes} />
				<FloatActionButton />
			</Show>
			<Show when={!auth}>
				<Welcome />
			</Show>
		</>
	)
}

export default Home