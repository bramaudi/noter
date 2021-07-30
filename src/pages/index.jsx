import { createSignal, Match, onCleanup, onMount, Show, Switch } from "solid-js"
// Services
import auth from '../services/auth'
import notesModel from '../models/notes-dummy'
// Components
import Header from '../components/Header'
import FloatActionButton from '../components/FloatActionButton'
import Welcome from '../components/Welcome'
import Notes from "../components/Notes"
import CreateNote from "../components/CreateNote"
import Loading from "../components/Loading"

const Home = () => {
	const [lastY, setLastY] = createSignal(0)
	const [notes, setNotes] = createSignal([])
	const [route, setRoute] = createSignal('notes')
	const fetchNotes = () => {
		const { error, data } = notesModel.index()
		if (error) console.error(error)
		setNotes(data)
	}
	onMount(() => {
		fetchNotes()
		window.addEventListener('scroll', () => {
			setLastY(window.scrollY)
		})
	})
	onCleanup(() => {
		window.removeEventListener('scroll')
	})
	return (
		<>
			<Show when={auth}>
				<Switch>
					<Match when={route() === 'notes'}>
						<Header />
						<Loading />
						{/* <Notes notes={notes} /> */}
						<FloatActionButton onClick={() => setRoute('create')} />
					</Match>
					<Match when={route() === 'create'}>
						<CreateNote onBack={{ lastY: lastY(), event: () => setRoute('notes') }} />
					</Match>
				</Switch>
			</Show>
			<Show when={!auth}>
				<Welcome />
			</Show>
		</>
	)
}

export default Home