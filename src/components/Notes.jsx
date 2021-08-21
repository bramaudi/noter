import styles from '../assets/css/masonry.module.css'
import { For, Show } from 'solid-js'
import { autoTitleSize, invertToBW } from "../helper/style"
import { encodeHTMLEntities, nl2br, truncateText } from '../helper/string'
import { formatDate } from '../helper/date'
import { structure } from '../models/notes'
import Masonry from 'solid-masonry'
import { useNote } from '../store/NoteContext'

const breakpointColumnsObj = {
	default: 4,
	1100: 4,
	700: 2,
	300: 1
}

const propsTypes = {
	setRoute: () => null,
}

const Notes = (props = propsTypes) => {
	const { setRoute } = props
	const [note, setNote] = useNote()

	/**
	 * Set note object & navigate to read section
	 * @param {structure} note Decrypted note
	 */
	const readNote = (note) => {
		setNote(n => ({...n, single: note}))
		setRoute('read')
	}
	
	return (
		<div className="p-3 font-medium">
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className={styles.container}
				columnClassName={styles.column}
			>
				{note.list.map(item => (
					<div onClick={() => readNote(item)} style={{ background: item.color, color: invertToBW(item.color) }}>
						{/* Both title & body is available */}
						<Show when={item.title !== '' && item.body !== ''}>
							<div
								className={`${autoTitleSize(item.title)}`}
								className="font-medium"
							>
								{truncateText(item.title, 60, false)}
							</div>
							<div
								className={`${autoTitleSize(item.body)}`}
								innerHTML={nl2br(encodeHTMLEntities(truncateText(item.body)))}
							></div>
						</Show>
						{/* Missing title or body  */}
						<Show when={item.title === '' || item.body === ''}>
							<div
								className={`${autoTitleSize(item.title || item.body)}`}
								innerHTML={
									item.body !== ''
										? nl2br(encodeHTMLEntities(truncateText(item.body)))
										: truncateText(item.title, 60, false)
								}
							></div>
						</Show>
						{/* Tags & Date */}
						<div className="mt-2 text-xs flex items-center opacity-70">
							<div className="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
								<For each={item.tags}>
									{tag => (
										<span className="mr-2">#{tag}</span>
									)}
								</For>
							</div>
							<div className="ml-2 whitespace-nowrap text-right">{formatDate(item.created_at)}</div>
						</div>
					</div>
				))}
			</Masonry>
		</div>
	)
}

export default Notes