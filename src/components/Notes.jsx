import styles from '../assets/css/masonry.module.css'
import Masonry from './Masonry'
import { autoTitleSize } from "../helper/style"

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
				{notes().map((note, i) => (
					<div>
						<div className={`${autoTitleSize(note.title)}`}>({i + 1}) {note.title}</div>
						<div className="mt-2 text-xs text-right text-gray-500">{note.created_at}</div>
					</div>
				))}
			</Masonry>
		</div>
	)
}

export default Notes