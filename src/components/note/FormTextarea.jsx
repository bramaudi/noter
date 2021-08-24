import { onMount } from "solid-js"
import { invertToBW } from "../../helper/style"

const propsTypes = {
	signal: [() => null, () => null]
}

const FormTextarea = (props = propsTypes) => {
	const [formData, setFormData] = props.signal

	/**
	 * Prevent moving to next field when press tab button
	 * @param {KeyboardEvent} event 
	 */
	 const keepIndentation = event => {
		if (event.key == 'Tab') {
			event.preventDefault();
			var start = event.target.selectionStart;
			var end = event.target.selectionEnd;
	
			// set textarea value to: text before caret + tab + text after caret
			event.target.value = event.target.value.substring(0, start) +
				"\t" + event.target.value.substring(end);
	
			// put caret at right position again
			event.target.selectionStart =
				event.target.selectionEnd = start + 1;
		}
	}

	return (
		<textarea
			tabIndex="2"
			onKeyDown={keepIndentation}
			onInput={e => setFormData(n => ({...n, body: e.target.value}))}
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