import { useNavigate } from "solid-app-router";
import { For, Show } from "solid-js";
import { formatDate } from "@helper/date";
import { encodeHTMLEntities, nl2br, truncateText } from "@helper/string";
import { autoTitleSize, invertToBW } from "@helper/style";
import { NoteFormat } from "@models/notes";
import { useNote } from "@context/note";
import { useScroll } from "@context/scroll"

const Card = (props: {
	item: NoteFormat,
	index: number
}) => {
	const noteTitle = props.item.title ? truncateText(props.item.title, 60, false) : ''
	const noteBody = props.item.body ? truncateText(props.item.body, window.innerWidth > 768 ? 300 : 150, false) : ''
	const navigate = useNavigate()
	const [, setScroll] = useScroll()
	const [, setNote] = useNote()

	/**
	 * Set note object & navigate to read section
	 * @param {NoteFormat} note Decrypted note
	 */
	 const readNote = (note: NoteFormat) => {
		setNote(n => ({...n, single: note}))
		setScroll('y', window.scrollY)
		localStorage.setItem('scrollY', window.scrollY.toString())
		navigate('/notes/read')
	}

	return (
		<div
			tabIndex="0"
			id={`note_${props.index}`}
			onClick={() => readNote(props.item)}
			style={{
				background: props.item.color,
				color: props.item.color && invertToBW(props.item.color)
			}}
		>
			{/* Both title & body is available */}
			<Show when={props.item.title !== '' && props.item.body !== ''}>
				<div
					className={`font-medium ${autoTitleSize(props.item.title)}`}
				>
					{noteTitle}
				</div>
				<div
					className={`${autoTitleSize(props.item.body)}`}
					innerHTML={nl2br(encodeHTMLEntities(noteBody))}
				></div>
			</Show>
			{/* Missing title or body  */}
			<Show when={props.item.title === '' || props.item.body === ''}>
				<div
					className={`${autoTitleSize(props.item.title || props.item.body)}`}
					innerHTML={
						props.item.body !== ''
							? nl2br(encodeHTMLEntities(noteBody))
							: noteTitle
					}
				></div>
			</Show>
			{/* Tags & Date */}
			<div className="mt-2 text-xs flex items-center opacity-70">
				<div className="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
					<For each={props.item.tags}>
						{tag => (
							<span className="mr-2">#{tag}</span>
						)}
					</For>
				</div>
				<div className="ml-2 whitespace-nowrap text-right">
					{formatDate(props.item.created_at)}
				</div>
			</div>
		</div>
	)
}

export default Card