import { For } from "solid-js"

const propsTypes = {
	signal: [() => null, () => null]
}

const FormTags = (props = propsTypes) => {
	const [formData, setFormData] = props.signal

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

	return (
		<>
			<div class="relative border-b-2 pb-2 mt-10 mb-5 focus-within:border-blue-500">
				<input
					onKeyPress={e => tagsAdd(e, setFormData)}
					type="text"
					name="note-tags"
					placeholder=" "
					class="block w-full appearance-none focus:outline-none bg-transparent"
					/>
				<label htmlFor="note-tags" class="absolute top-0 -z-1 duration-300 origin-0">Tags</label>
			</div>
			<For each={formData().tags.sort((a, b) => a !== b ? a < b ? -1 : 1 : 0)}>
				{tag => (
					<div
						className="inline-flex items-center pl-2 mr-2 mb-2 rounded-3xl bg-blue-200"
					>
						{tag}
						<button onClick={() => tagsRemove(tag, setFormData)} className="flex items-center justify-center w-5 h-5 text-xs font-semibold p-2 ml-1 rounded-full bg-blue-300 hover:bg-blue-400 text-blue-900" type="button">x</button>
					</div>
				)}
			</For>
		</>
	)
}

export default FormTags