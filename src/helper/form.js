import { rgbToHex } from "./style";

const colorOptions = [ 'white', 'yellow', 'blue', 'green', 'red', 'purple', 'gray', 'indigo', 'pink' ]

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
	tagsAdd,
	tagsRemove,
	colorSelect,
}