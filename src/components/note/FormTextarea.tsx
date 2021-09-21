import { NoteFormat } from "@models/notes"
import { onMount } from "solid-js"
import { invertToBW } from "../../helper/style"

const FormTextarea = (props: {
	signal: [Function, Function]
}) => {
	const [formData, setFormData] = props.signal

	/**
	 * Prevent moving to next field when press tab button
	 */
	const keepIndentation = (event: KeyboardEvent) => {
		const target = event.target as HTMLTextAreaElement
		if (event.key == 'Tab') {
			event.preventDefault();
			var start = target.selectionStart;
			var end = target.selectionEnd;
	
			// set textarea value to: text before caret + tab + text after caret
			target.value = target.value.substring(0, start) +
				"\t" + target.value.substring(end);
	
			// put caret at right position again
			target.selectionStart = target.selectionEnd = start + 1;
		}
	}

	return (
		<textarea
			tabIndex="2"
			onKeyDown={keepIndentation}
			onInput={e => setFormData((n: NoteFormat) => ({...n, body: (e.target as HTMLTextAreaElement).value}))}
			className="block w-full my-2 p-2 px-3 border-2 rounded outline-none focus:ring-0 focus:border-blue-500"
			style={{background: formData().color, color: invertToBW(formData().color)}}
			id="note-body"
			cols="30"
			rows="10"
			placeholder="Write a note here ..."
		>
			{formData().body}
		</textarea>
	)
}

export default FormTextarea