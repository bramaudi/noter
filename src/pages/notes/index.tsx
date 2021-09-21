import { Show } from "solid-js"
import { useNavigate } from "solid-app-router"
// Services
import { useNote } from '@context/note'
// Components
import Header from '@components/Header'
import FloatActionButton from '@components/FloatActionButton'
import Empty from '@components/Empty'
import NoteList from '@components/note/List'

const Home = () => {
	const navigate = useNavigate()
	const [note] = useNote()

	return (
		<>
			<Header />
			<Show when={!note.list.length}><Empty /></Show>
			<NoteList notes={note.list} />
			<FloatActionButton onClick={() => navigate('notes/create')} />
		</>
	)
}

export default Home