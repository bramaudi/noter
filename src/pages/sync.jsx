import { Show } from "solid-js"
import { getLocalNotes } from "../models/notes"
import { useNote } from "../store/NoteContext"

const SyncPage = () => {
	const [note, setNote] = useNote()
	const showConfirm = getLocalNotes().length
	return (
		<div>
			<Show when={showConfirm}>
				<div className="text-xl">
					Data conflict
				</div>
				You have some local notes and this , please choose to <strong>Overwrite</strong>
				or <strong>Keep</strong> your local notes!
				<button className="block mb-1 p-2 rounded bg-red-300">
					Overwrite local notes
				</button>
				<button className="block p-2 rounded bg-red-300">
					Keep local notes
				</button>
			</Show>
		</div>
	)
}

export default SyncPage