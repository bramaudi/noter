import { Show, onMount, onCleanup } from "solid-js"
import { useNavigate } from "solid-app-router"
// Services
import { useNote } from '@context/note'
import { useScroll } from "@context/scroll"
// Components
import Header from '@components/Header'
import FloatActionButton from '@components/FloatActionButton'
import Empty from '@components/Empty'
import NoteList from '@components/note/List'

const Home = () => {
	const navigate = useNavigate()
	const [note] = useNote()
	const [scroll, setScroll] = useScroll()

	const handleSaveScroll = () => {
		setScroll('y', window.scrollY)
	}

	onMount(() => {		
		window.scrollTo(0, scroll.y + 10)
		window.addEventListener('scroll', handleSaveScroll)
	})
	onCleanup(() => {
		window.removeEventListener('scroll', handleSaveScroll)
	})

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