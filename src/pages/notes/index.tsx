import { createSignal, onMount, Show } from "solid-js"
import { useNavigate } from "solid-app-router"
// Services
import { notesOverwriteLocal } from '@models/notes'
import { useNote } from '@context/note'
// Components
import Header from '@components/Header'
import FloatActionButton from '@components/FloatActionButton'
import Loading from '@components/Loading'
import Empty from '@components/Empty'
import NoteList from '@components/note/List'

const Home = () => {
	const navigate = useNavigate()
	const [note, setNote] = useNote()
	const [loading, setLoading] = createSignal(false)

	onMount(async () => {
		if (!note.list.length) {
			setLoading(true)
			const {data, error} = await notesOverwriteLocal()
			if (!error) setNote('list', data)
			setLoading(false)
		}
	})
	
	return (
		<>
			<Header />
			<Show when={loading()}><Loading /></Show>
			<Show when={!loading()}>
				<Show when={!note.list.length}><Empty /></Show>
				<NoteList notes={note.list} />
				<FloatActionButton onClick={() => navigate('notes/create')} />
			</Show>
		</>
	)
}

export default Home