import styles from '../assets/css/masonry.module.css'
import { For, Show } from 'solid-js'
import { autoTitleSize, invertToBW } from "../helper/style"
import { truncateText } from '../helper/string'
import { formatDate } from '../helper/date'
import { structure } from '../models/notes'
import Masonry from './Masonry'

const breakpointColumnsObj = {
	default: 4,
	1100: 4,
	700: 2,
	300: 1
}

const propsTypes = {
	notes: () => [structure],
	setSingleNote: () => null,
	setRoute: () => null,
}

const Notes = (props = propsTypes) => {
	const { notes, setSingleNote, setRoute } = props
	/**
	 * Set note object & navigate to read section
	 * @param {structure} note Decrypted note
	 */
	const readNote = (note) => {
		setSingleNote(note)
		setRoute('read')
	}
	return (
		<div className="p-3 font-medium">
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className={styles.container}
				columnClassName={styles.column}
			>
				{notes().map(note => (
					<div onClick={() => readNote(note)} style={{ background: note.color, color: invertToBW(note.color) }}>
						{/* Both title & body is available */}
						<Show when={note.title !== '' && note.body !== ''}>
							<div className={`${autoTitleSize(note.title)}`} className="font-medium">{truncateText(note.title)}</div>
							<div className={`${autoTitleSize(note.body)}`}>{truncateText(note.body)}</div>
						</Show>
						{/* Missing title or body  */}
						<Show when={note.title === '' || note.body === ''}>
							<div className={`${autoTitleSize(note.title || note.body)}`}>{truncateText(note.title || note.body)}</div>
						</Show>
						{/* Tags & Date */}
						<div className="mt-2 text-xs flex items-center opacity-70">
							<div className="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
								<For each={note.tags}>
									{tag => (
										<span className="mr-2">#{tag}</span>
									)}
								</For>
							</div>
							<div className="ml-2 whitespace-nowrap text-right">{formatDate(note.created_at)}</div>
						</div>
					</div>
				))}
			</Masonry>
		</div>
	)
}

export default Notes