import { rgbToHex } from "./style";

const colorOptions = [ 
	'bg-white-200', 
	'bg-yellow-200', 
	'bg-blue-200', 
	'bg-green-200', 
	'bg-red-200', 
	'bg-purple-200', 
	'bg-gray-200', 
	'bg-indigo-200', 
	'bg-pink-200',
]

/**
	 * Prevent moving to next field when press tab button
	 * @param {InputEvent} event 
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
/**
 * Append new tag
 * @param {Event} event
 * @param {Function} setData // data signal setter
 */
const tagsAdd = (event, setData) => {
	// sanitize tag name
	const tag = event.target.value.replace(/[^a-zA-Z0-9 ]/g, "")
	// Prevent submit form on enter
	if (event.key === 'Enter' && !!event.target.value) {
		event.preventDefault();
		setData(n => ({...n, tags: [ ...n.tags, tag ]}))
		event.target.value = ''
	}
}
/**
 * Remove added tag
 * @param {string} tag 
 * @param {Function} setData // data signal setter
 */
const tagsRemove = (tag, setData) => {
	setData(n => ({...n, tags: n.tags.filter(item => item !== tag)}))
}
/**
 * Select computed  bg color from element
 * @param {Event} event
 * @param {Function} setData // data signal setter
 */
const colorSelect = (event, setData) => {
	const computedStyle = window.getComputedStyle( event.target ,null);
	const bgColor = computedStyle.getPropertyValue('background-color')
	const [r, g, b] = bgColor.match(/\((.*)\)/)[1].split(',').map(c => c.trim())
	setData(n => ({...n, color: rgbToHex(r, g, b)}))
}

export default {
	colorOptions,
	keepIndentation,
	tagsAdd,
	tagsRemove,
	colorSelect,
}