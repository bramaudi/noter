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
import supabase from "../services/supabase"

const Home = () => {
	const [lastY, setLastY] = createSignal(0)
	const [route, setRoute] = createSignal('notes')

	const fetchNotes = ({ lastId, limit }) => notesModel.index(lastId, limit)
	const [notes, { refetch }] = createResource({ lastId: 0, limit: 10 }, fetchNotes)

	const saveScroll = () => setLastY(window.scrollY)

	if (!auth) {
		supabase.auth.onAuthStateChange(() => {
			window.location.href = '/'
		})
	}

	const navigateBack = (lastY) => {
		setRoute('notes')
		window.scrollTo(window, lastY)
	}

	onMount(() => {
		window.addEventListener('scroll', saveScroll)
	})
	onCleanup(() => {
		window.removeEventListener('scroll', saveScroll)
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
						<CreateNote lastScrollY={lastY()} navigateBack={navigateBack} />
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