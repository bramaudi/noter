import styles from '../assets/css/masonry.module.css'
import { onMount, onCleanup, For, Show } from 'solid-js'
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
	 * Shift focus using arrow keys
	 * @param {KeyboardEvent} e 
	 */
	 const handleNoteShiftFocus = (e) => {
		const currentIndex = e.target.getAttribute('id')?.match(/\d/)
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			if (currentIndex?.length) {
				// ~~() convert str to int
				document.getElementById(`note_${~~(currentIndex[0]) - 1}`)?.focus()
			}
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (currentIndex?.length) {
				// ~~() convert str to int
				document.getElementById(`note_${~~(currentIndex[0]) + 1}`)?.focus()
			}
    }
  }
	/**
	 * Navigate to read note page on Enter if a note have focus
	 * @param {KeyboardEvent} e 
	 */
	const navigateReadEvent = e => {
		if (e.key === 'Enter') {
			const isNote = e.target.getAttribute('id')?.match('note_')
			if (isNote?.length) e.target.$$click()
		}
	}
	/**
	 * Set note object & navigate to read section
	 * @param {structure} note Decrypted note
	 */
	const readNote = (note) => {
		setNote(n => ({...n, single: note}))
		setRoute('read')
	}

	onMount(() => {
		window.addEventListener('keydown', handleNoteShiftFocus)
		window.addEventListener('keydown', navigateReadEvent)
		document.getElementById('note_0')?.focus()
	})
	onCleanup(() => {
		window.removeEventListener('keydown', handleNoteShiftFocus)
		window.removeEventListener('keydown', navigateReadEvent)
	})
	
	return (
		<div className="p-3 font-medium">
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className={styles.container}
				columnClassName={styles.column}
			>
				{note.list.map((item, index) => (
					<div tabIndex="0" id={`note_${index}`} onClick={() => readNote(item)} style={{ background: item.color, color: invertToBW(item.color) }}>
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