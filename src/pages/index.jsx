import { createEffect, createResource, createSignal, Match, onCleanup, onMount, Show, Switch } from "solid-js"
// Services
import auth from '../services/auth'
import notesModel from '../models/notes'
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
	const [notes, setNotes] = createSignal([])

	const fetchNotes = ({ lastId, limit }) => notesModel.index(lastId, limit)
	const [notesResource] = createResource({ lastId: 0, limit: 100 }, fetchNotes)

	const saveScroll = () => setLastY(window.scrollY)

	if (!auth) {
		supabase.auth.onAuthStateChange(() => {
			window.location.href = '/'
		})
	}

	const navigateBack = (scrollY) => {
		setRoute('notes')
		if (scrollY == -1) window.scrollTo(0,document.body.scrollHeight)
		else window.scrollTo(window, scrollY)
	}

	onMount(() => {
		window.addEventListener('scroll', saveScroll)
	})
	createEffect(() => {
		if (!notesResource.loading) {
			const { data } = notesResource()
			setNotes(data)
		}
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
						<Show when={notesResource.loading}><Loading /></Show>
						<Show when={!notesResource.loading}>
							<Show when={!notes().length}><Empty /></Show>
							<Notes notes={notes} />
						</Show>
						<FloatActionButton onClick={() => setRoute('create')} />
					</Match>
					<Match when={route() === 'create'}>
						<CreateNote
							notes={!notesResource.loading ? notes() : []}
							mutateNotes={setNotes}
							lastScrollY={lastY()}
							maxScrollY={document.documentElement.scrollHeight - document.documentElement.clientHeight}
							navigateBack={navigateBack}
							/>
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