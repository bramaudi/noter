import styles from '../assets/css/masonry.module.css'
import Masonry from './Masonry'
import { autoTitleSize, invertToBW, truncateText } from "../helper/style"
import { formatDate } from '../helper/date'
import { For, Show } from 'solid-js'

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
				{notes().map(note => (
					<div style={{ background: note.color, color: invertToBW(note.color) }}>
						<Show when={note.title !== '' && note.body !== ''}>
							<div className={`${autoTitleSize(note.title)}`} className="font-medium">{truncateText(note.title)}</div>
							<div className={`${autoTitleSize(note.body)}`}>{truncateText(note.body)}</div>
						</Show>
						<Show when={note.title === '' || note.body === ''}>
							<div className={`${autoTitleSize(note.title || note.body)}`}>{truncateText(note.title || note.body)}</div>
						</Show>
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