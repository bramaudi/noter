import { rgbToHex } from "./style";

const colorOptions = [ 'white', 'yellow', 'blue', 'green', 'red', 'purple', 'gray', 'indigo', 'pink' ]

/**
 * Append new tag
 * @param {Event} e 
 */
const tagsAdd = e => {
	// sanitize tag name
	const tag = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "")
	// Prevent submit form on enter
	if (e.key === 'Enter' && !!e.target.value) {
		e.preventDefault();
		setData(n => ({...n, tags: [ ...n.tags, tag ]}))
		e.target.value = ''
	}
}
/**
 * Remove added tag
 * @param {string} tag 
 */
const tagsRemove = (tag) => {
	setData(n => ({...n, tags: n.tags.filter(item => item !== tag)}))
}
/**
 * Select computed  bg color from element
 * @param {Event} e
 */
const colorSelect = e => {
	const computedStyle = window.getComputedStyle( e.target ,null);
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