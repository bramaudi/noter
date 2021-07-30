import { createResource, createSignal, Match, onCleanup, onMount, Show, Switch } from "solid-js"
// Services
import auth from '../services/auth'
import * as notesModel from '../models/notes'
// Components
import Header from '../components/Header'
import FloatActionButton from '../components/FloatActionButton'
import Welcome from '../components/Welcome'
import Notes from "../components/Notes"
import CreateNote from "../components/CreateNote"
import Loading from "../components/Loading"
import Empty from "../components/Empty"

const Home = () => {
	const [lastY, setLastY] = createSignal(0)
	const [route, setRoute] = createSignal('notes')

	const fetchNotes = ({ lastId, limit }) => notesModel.index(lastId, limit)
	const [notes] = createResource({ lastId: 0, limit: 10 }, fetchNotes)

	onMount(() => {
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
						<Show when={notes.loading}><Loading /></Show>
						<Show when={!notes.loading}>
							<Show when={!notes().data.length}><Empty /></Show>
							<Notes notes={notes().data} />
						</Show>
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