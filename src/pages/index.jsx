import {
	createEffect, createSignal, onCleanup, onMount, // lifecycle
	Match, Show, Switch // component
} from "solid-js"
// Services
import auth from '../services/auth'
import notesModel from '../models/notes'
import supabase from "../services/supabase"
// Components
import Header from '../components/Header'
import FloatActionButton from '../components/FloatActionButton'
import Welcome from '../components/Welcome'
import Notes from "../components/Notes"
import CreateNote from "../components/CreateNote"
import EditNote from "../components/EditNote"
import Loading from "../components/Loading"
import Empty from "../components/Empty"
import ReadNote from "../components/ReadNote"
import { useNote } from "../store/NoteContext"
import Failed from "../components/Failed"

const Home = () => {
	const [scrollY, setScrollY] = createSignal({
		notes: 0,
		read: 0
	})
	
	const fetchNotes = async ({ lastId, limit }) => await notesModel.index(lastId, limit)

	const [route, setRoute] = createSignal('notes')
	const [note, setNote] = useNote()
	const [loading, setLoading] = createSignal(false)
	const [failed, setFailed] = createSignal(false)

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
		try {
			const { data } = await fetchNotes({ lastId: 0, limit: 1000 })
			setNote(note => ({
				...note,
				list: data.map(notesModel.decryptNote)
			}))
		} catch (error) {
			setFailed(true)
		}
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
						<Header />
						<Show when={loading()}><Loading /></Show>
						<Show when={!loading() && !failed()}>
							<Show when={!note().list.length}><Empty /></Show>
							<Notes setRoute={setRoute} />
						</Show>
						<Show when={failed()}><Failed /></Show>
						<FloatActionButton onClick={() => setRoute('create')} />
					</Match>
					<Match when={route() === 'create'}>
						<CreateNote
							scrollY={scrollY}
							setScrollY={setScrollY}
							setRoute={setRoute}
						/>
					</Match>
					<Match when={route() === 'edit'}>
						<EditNote setRoute={setRoute} />
					</Match>
					<Match when={route() === 'read'}>
						<ReadNote
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