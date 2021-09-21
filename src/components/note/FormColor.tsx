import { For } from "solid-js"
import { rgbToHex } from "@helper/style"
import { NoteFormat } from "@models/notes"

const colorOptions = [ 
	'bg-white', 
	'bg-yellow-200', 
	'bg-blue-200', 
	'bg-green-200', 
	'bg-red-200', 
	'bg-purple-200', 
	'bg-gray-200', 
	'bg-indigo-200', 
	'bg-pink-200',
]

const FormColor = ({ setFormData }: { setFormData: Function }) => {
	/**
	 * Select computed  bg color from element
	 */
	const colorSelect = (event: Event, setData: Function) => {
		const computedStyle = window.getComputedStyle((event.target as HTMLElement), null);
		const bgColor = computedStyle.getPropertyValue('background-color')
		const bgColorMatch = bgColor.match(/\((.*)\)/)
		let r = 255, g = 255, b = 255
		if (bgColorMatch) {
			[r, g, b] = bgColorMatch[1].split(',').map(c => parseInt(c.trim()))
		}
		setData((n: NoteFormat) => ({...n, color: rgbToHex(r, g, b)}))
	}

	return (
		<>
			<For each={colorOptions}>
				{color => (
					<span
						tabIndex="0"
						onClick={e => colorSelect(e, setFormData)}
						className={`cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md border focus:ring focus:outline-none border-gray-200 hover:border-gray-500 ${color}`}
					></span>
				)}
			</For>
			<label
				className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md border border-gray-200 hover:border-gray-500"
				htmlFor="note-color"
				style={{ background: 'linear-gradient(155deg, rgba(255,0,0,1) 20%, rgba(250,255,0,1) 34%, rgba(54,255,0,1) 47%, rgba(0,255,230,1) 59%, rgba(0,0,255,1) 76%, rgba(243,0,255,1) 89%, rgba(255,0,0,1) 100%)' }}
				title="Custom"
			>
			</label>
			<input
				onChange={e => setFormData((n: NoteFormat) => ({...n, color: (e.target as HTMLInputElement).value}))}
				type="color"
				id="note-color"
				className="hidden"
			/>
		</>
	)
}

export default FormColor