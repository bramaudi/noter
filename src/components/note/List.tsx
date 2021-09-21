import { onMount, onCleanup } from "solid-js"
import Masonry from "solid-masonry"
import styles from "@assets/css/masonry.module.css"
import Card from "./Card"
import { NoteFormat } from "@models/notes"

const breakpointColumnsObj = {
	default: 4,
	1100: 4,
	700: 2,
	300: 1
}

const NoteList = (props: { notes: NoteFormat[] }) => {
	/**
	 * Shift focus using arrow keys
	 */
	 const handleNoteShiftFocus = (e: KeyboardEvent) => {
		const currentIndex = (e.target as HTMLElement).getAttribute('id')?.match(/\d/)
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
	 */
	const navigateReadEvent = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			const isNote = (e.target as HTMLElement).getAttribute('id')?.match('note_')
			if (isNote?.length) (e.target as HTMLElement).click()
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleNoteShiftFocus)
		window.addEventListener('keydown', navigateReadEvent)
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
				each={props.notes}
			>
				{(item, index) => <Card item={item} index={index} />}
			</Masonry>
		</div>
	)
}

export default NoteList