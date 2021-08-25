import {
	createEffect, createSignal, onCleanup, onMount, // lifecycle
	Match, Show, Switch // built-in component
} from "solid-js"
// Services
import auth from '../services/auth'
import { notesDecompress, notesSync } from '../models/notes'
import supabase from "../services/supabase"
import { useNote } from "../store/NoteContext"
// Components
import Header from '../components/Header'
import FloatActionButton from '../components/FloatActionButton'
import Welcome from '../components/Welcome'
import Loading from "../components/Loading"
import Empty from "../components/Empty"
import NoteList from "../components/note/List"
import NoteCreate from "../components/note/Create"
import NoteEdit from "../components/note/Edit"
import NoteRead from "../components/note/Read"
import { useNavigate } from "solid-app-router"

const Home = () => {
	const [scrollY, setScrollY] = createSignal({
		notes: 0,
		read: 0
	})	
	const navigate = useNavigate()
	const [route, setRoute] = createSignal('notes')
	const [note, setNote] = useNote()
	const [loading, setLoading] = createSignal(false)

	/**
	 * Remember current scroll Y pos
	 */
	const saveScroll = () => {
		if (route() === 'notes') {
			setScrollY(x => ({...x, notes: window.scrollY}))
		}
	}
	// Prevent back if not on 'notes' route
	// This to support native back hijacking in Create, Edit, Read
	window.history.pushState(null, null, window.top.location.pathname + window.top.location.search);
	const handlePopState = () => {
		if (route() === 'notes') {
			window.removeEventListener('popstate', handlePopState)
			window.history.back()
		}
		window.history.pushState(null, null, window.top.location.pathname + window.top.location.search);
	}

	onMount(async () => {
		if (!auth) {
			supabase.auth.onAuthStateChange(() => {
				window.location.reload()
			})
			navigate('/login')
		}

		window.addEventListener('scroll', saveScroll)

		setLoading(true)
		const {data} = await notesSync()
		setNote('list', data.map(notesDecompress))
		setLoading(false)
	})
	createEffect(() => {
		// restore scrollY
		window.scrollTo(window, scrollY().notes)

		route() === 'notes'
			? window.removeEventListener('popstate', handlePopState)
			: window.addEventListener('popstate', handlePopState)
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
						<Show when={!loading()}>
							<Show when={!note.list.length}><Empty /></Show>
							<NoteList setRoute={setRoute} />
						</Show>
						<FloatActionButton onClick={() => setRoute('create')} />
					</Match>
					<Match when={route() === 'create'}>
						<NoteCreate
							scrollY={scrollY}
							setScrollY={setScrollY}
							setRoute={setRoute}
						/>
					</Match>
					<Match when={route() === 'edit'}>
						<NoteEdit setRoute={setRoute} />
					</Match>
					<Match when={route() === 'read'}>
						<NoteRead
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