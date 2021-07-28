import { createSignal, For, onMount, Show } from "solid-js"
// Services
import auth from '../services/auth'
import notesModel from '../models/notes-dummy'
// Components
import styles from './index.module.css'
import Header from '../components/Header'
import FloatActionButton from '../components/FloatActionButton'
import Welcome from '../components/Welcome'
import Masonry from '../components/Masonry'

const Home = () => {
	const [notes, setNotes] = createSignal([])
	const formatDate = (dateString) => {
		const current = new Date()
		const x = new Date(dateString)
		const year = current.getFullYear() !== x.getFullYear() ? `, ${x.getFullYear()}` : ''
		const months_lang = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		const month = months_lang[x.getMonth()]
		const date = x.getDate()
		return `${month} ${date} ${year}`
	}
	const fetchNotes = () => {
		const { error, data } = notesModel.index()
		if (error) console.error(error)
		setNotes(data.map(
			note => ({
				...note,
				created_at: formatDate(note.created_at),
				updated_at: formatDate(note.updated_at),
			})
		))
	}
	const autoTitleSize = (str = '') => {
		const { length: len } = str
		if (len < 10) return 'text-2xl'
		else if (len < 30) return 'text-xl'
		else if (len < 50) return 'text-lg'
		else return 'text-sm'
	}
	onMount(() => {
		fetchNotes()
	})
	const breakpointColumnsObj = {
		default: 4,
		1100: 3,
		700: 2,
		300: 1
	}
	return (
		<>
			<Show when={auth}>
				<Header />
				<div className="p-3 font-medium">
					<Masonry
						breakpointCols={breakpointColumnsObj}
						className={styles.grid}
						columnClassName={styles.grid_column}
					>
						{notes().map((note, i) => (
							<div>
								<div className={`${autoTitleSize(note.title)}`}>({i + 1}) {note.title}</div>
								<div className="mt-2 text-xs text-right text-gray-500">{note.created_at}</div>
							</div>
						))}
					</Masonry>
				</div>
				<FloatActionButton />
			</Show>
			<Show when={!auth}>
				<Welcome />
			</Show>
		</>
	)
}

export default Home