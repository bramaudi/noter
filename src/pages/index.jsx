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
	
	const fetchNotes = async ({ lastId, limit }) => await notesModel.index(lastId, limit)

	const [route, setRoute] = createSignal('notes')
	const [notes, setNotes] = createSignal([])
	const [loading, setLoading] = createSignal(false)
	const [singleNote, setSingleNote] = createSignal(notesModel.structure)

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

	onMount(async () => {
		window.addEventListener('scroll', saveScroll)
		setLoading(true)
		const { data } = await fetchNotes({ lastId: 0, limit: 1000 })
		setNotes(data.map(notesModel.decryptNote))
		setLoading(false)
	})
	createEffect(() => {
		// restore scrollY
		window.scrollTo(window, scrollY().notes)
	})
	onCleanup(() => {
		window.removeEventListener('scroll', saveScroll)
	})
	return (
		<>
			<Show when={auth}>
				<Switch>
					<Match when={route() === 'notes'}>
						<Header setNotes={setNotes} />
						<Show when={loading()}><Loading /></Show>
						<Show when={!loading()}>
							<Show when={!notes().length}><Empty /></Show>
							<Notes notes={notes} setSingleNote={setSingleNote} setRoute={setRoute} />
						</Show>
						<FloatActionButton onClick={() => setRoute('create')} />
					</Match>
					<Match when={route() === 'create'}>
						<CreateNote
							notes={!loading() ? notes : () => []}
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
							setSingleNote={setSingleNote}
							setRoute={setRoute}
						/>
					</Match>
					<Match when={route() === 'read'}>
						<ReadNote
							note={singleNote}
							setNotes={setNotes}
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