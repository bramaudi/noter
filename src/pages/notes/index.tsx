import { Show, onMount } from "solid-js"
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
	const [scroll] = useScroll()

	onMount(() => {
		const lastScrollY = scroll.y || parseInt(localStorage.getItem('scrollY'))
		console.log('lastScrollY', lastScrollY)
		if ('scrollBy' in window) {
			window.scrollBy({
				top: lastScrollY,
				behavior: 'smooth'
			})
		} else {
			window.scrollTo(0, lastScrollY)
		}
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