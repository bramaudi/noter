import styles from '../assets/css/masonry.module.css'
import Masonry from './Masonry'
import { autoTitleSize, invertToBW, truncateText } from "../helper/style"
import { formatDate } from '../helper/date'
import { Show } from 'solid-js'

const breakpointColumnsObj = {
	default: 4,
	1100: 4,
	700: 2,
	300: 1
}

const defaultProps = {
	notes: () => []
}

const Notes = (props = defaultProps) => {
	const { notes } = props
	return (
		<div className="p-3 font-medium">
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className={styles.container}
				columnClassName={styles.column}
			>
				{notes.map((note, i) => (
					<div style={{ background: note.color }}>
						<Show when={note.title !== '' && note.body !== ''}>
							<div className={`${autoTitleSize(note.title)}`} className="font-medium" style={{ color: invertToBW(note.color) }}>{truncateText(note.title)}</div>
							<div className={`${autoTitleSize(note.body)}`} style={{ color: invertToBW(note.color) }}>{truncateText(note.body)}</div>
						</Show>
						<Show when={note.title === '' || note.body === ''}>
							<div className={`${autoTitleSize(note.title || note.body)}`} style={{ color: invertToBW(note.color) }}>{truncateText(note.title || note.body)}</div>
						</Show>
						<div className="mt-2 text-xs text-right opacity-70" style={{ color: invertToBW(note.color) }}>{formatDate(note.created_at)}</div>
					</div>
				))}
			</Masonry>
		</div>
	)
}

export default Notes