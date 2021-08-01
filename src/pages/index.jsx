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
import EditNote from "../components/EditNote"
import Loading from "../components/Loading"
import Empty from "../components/Empty"
import supabase from "../services/supabase"
import ReadNote from "../components/ReadNote"

const Home = () => {
	const [scrollY, setScrollY] = createSignal({
		notes: 0,
		read: 0
	})
	const [route, setRoute] = createSignal('notes')
	const [notes, setNotes] = createSignal([])
	const [singleNote, setSingleNote] = createSignal(notesModel.structure)

	const fetchNotes = ({ lastId, limit }) => notesModel.index(lastId, limit)
	const [notesResource] = createResource({ lastId: 0, limit: 100 }, fetchNotes)

	const saveScroll = () => {
		if (route() === 'notes') {
			setScrollY(x => ({...x, notes: window.scrollY}))
		}
	}

	if (!auth) {
		supabase.auth.onAuthStateChange(() => {
			window.location.href = '/'
		})
	}

	onMount(() => {
		window.addEventListener('scroll', saveScroll)
		// restore scrollY
		window.scrollTo(window, scrollY().notes)
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
						<Header mutateNotes={setNotes} />
						<Show when={notesResource.loading}><Loading /></Show>
						<Show when={!notesResource.loading}>
							<Show when={!notes().length}><Empty /></Show>
							<Notes notes={notes} setSingleNote={setSingleNote} setRoute={setRoute} />
						</Show>
						<FloatActionButton onClick={() => setRoute('create')} />
					</Match>
					<Match when={route() === 'create'}>
						<CreateNote
							notes={!notesResource.loading ? notes() : []}
							setNotes={setNotes}
							scrollY={scrollY}
							setScrollY={setScrollY}
							setRoute={setRoute}
						/>
					</Match>
					<Match when={route() === 'edit'}>
						<EditNote
							note={singleNote}
							setNotes={setNotes}
							setRoute={setRoute}
						/>
					</Match>
					<Match when={route() === 'read'}>
						<ReadNote
							note={singleNote}
							setRoute={setRoute}
							scrollY={scrollY}
							setScrollY={setScrollY}
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