import { createSignal, For } from "solid-js"
import { invertToBW, rgbToHex } from "../helper/style"
import iconArrowRight from '../assets/icons/arrow-right.svg'
import iconCheck from '../assets/icons/check.svg'
import notesModel from '../models/notes'
import { toIsoString } from "../helper/date"

const propsTypes = {
	note: () => notesModel.structure,
	setSingleNote: () => null,
	setNotes: () => null,
	setRoute: () => null,
}

const EditNote = (props = propsTypes) => {
	const { note, setSingleNote, setNotes, setRoute } = props
	const [data, setData] = createSignal(note())
	const tagsAdd = e => {
		if (e.key === 'Enter' && !!e.target.value) {
			e.preventDefault();
			setData(n => ({
				...n,
				tags: [ ...n.tags, e.target.value.replace(/[^a-zA-Z0-9 ]/g, "") ]
			}))
			e.target.value = ''
		}
	}
	const tagsRemove = (value) => {
		setData(n => ({
			...n,
			tags: n.tags.filter(item => item !== value)
		}))
	}
	const colorSelect = e => {
		const computedStyle = window.getComputedStyle( e.target ,null);
		const bgColor = computedStyle.getPropertyValue('background-color')
		const [r, g, b] = bgColor.match(/\((.*)\)/)[1].split(',').map(c => c.trim())
		setData(n => ({...n, color: rgbToHex(r, g, b)}))
	}
	const submitEditNote = (e) => {
		e.preventDefault()
		try {
			data().updated_at = toIsoString(new Date())
			notesModel.update(data())
			// change local note
			setSingleNote(data())
			setNotes( n => n.map(x => x.id == data().id ? data() : x).sort(notesModel.order) )
			setRoute('read')
		} catch (error) {
			alert(error)
		}
	}
	return (
		<div className="p-3 mx-auto max-w-xl">
			<form onSubmit={submitEditNote}>
				<div className="flex items-center mb-3">
					{/* Back */}
					<button onClick={() => setRoute('read')} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400">
						<img className="w-5 h-5 transform -rotate-180" src={iconArrowRight} alt="back" />
					</button>
					{/* Note title */}
					<input
						onInput={e => setData(n => ({...n, title: e.target.value}))}
						className="mx-3 -mb-1 font-medium outline-none bg-transparent border-b border-transparent focus:border-blue-500 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
						value={data().title}
						placeholder="Untitled"
						/>
					{/* Save */}
					<button type="submit" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400">
						<img className="w-5 h-5" src={iconCheck} alt="back" />
					</button>
				</div>
				<textarea
					onInput={e => setData(n => ({...n, body: e.target.value}))}
					className="block w-full my-2 p-2 px-3 border-2 rounded outline-none focus:ring-0 focus:border-blue-500"
					style={{background: data().color, color: invertToBW(data().color)}}
					id="note-body"
					cols="30"
					rows="10"
					placeholder="Write a note here ..."
				>
					{data().body}
				</textarea>
				<div className="">
					<span onClick={colorSelect} className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md bg-white border border-gray-200 hover:border-gray-500"></span>
					<span onClick={colorSelect} className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md bg-yellow-200 border border-gray-200 hover:border-gray-500"></span>
					<span onClick={colorSelect} className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md bg-blue-200 border border-gray-200 hover:border-gray-500"></span>
					<span onClick={colorSelect} className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md bg-green-200 border border-gray-200 hover:border-gray-500"></span>
					<span onClick={colorSelect} className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md bg-red-200 border border-gray-200 hover:border-gray-500"></span>
					<span onClick={colorSelect} className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md bg-purple-200 border border-gray-200 hover:border-gray-500"></span>
					<span onClick={colorSelect} className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md bg-gray-300 border border-gray-200 hover:border-gray-500"></span>
					<span onClick={colorSelect} className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md bg-indigo-200 border border-gray-200 hover:border-gray-500"></span>
					<span onClick={colorSelect} className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md bg-pink-200 border border-gray-200 hover:border-gray-500"></span>
					<label
						className="cursor-pointer inline-block w-6 h-6 mr-2 mb-0 rounded-md border border-gray-200 hover:border-gray-500"
						htmlFor="note-color"
						style={{ background: 'linear-gradient(155deg, rgba(255,0,0,1) 20%, rgba(250,255,0,1) 34%, rgba(54,255,0,1) 47%, rgba(0,255,230,1) 59%, rgba(0,0,255,1) 76%, rgba(243,0,255,1) 89%, rgba(255,0,0,1) 100%)' }}
						title="Custom"
					>
					</label>
					<input onChange={e => setData(n => ({...n, color: e.target.value}))} type="color" id="note-color" className="hidden" />
				</div>
				{/* Tags */}
				<div class="relative border-b-2 pb-2 mt-10 mb-5 focus-within:border-blue-500">
					<input
						onKeyPress={tagsAdd}
						type="text"
						name="note-tags"
						placeholder=" "
						class="block w-full appearance-none focus:outline-none bg-transparent"
						/>
					<label htmlFor="note-tags" class="absolute top-0 -z-1 duration-300 origin-0">Tags</label>
				</div>
				<For each={data().tags.sort((a, b) => a !== b ? a < b ? -1 : 1 : 0)}>
					{tag => (
						<div
							className="inline-flex items-center pl-2 mr-2 mb-2 rounded-3xl bg-blue-200"
						>
							{tag}
							<button onClick={() => tagsRemove(tag)} className="flex items-center justify-center w-5 h-5 text-xs font-semibold p-2 ml-1 rounded-full bg-blue-300 hover:bg-blue-400 text-blue-900" type="button">x</button>
						</div>
					)}
				</For>
			</form>
		</div>
	)
}

export default EditNote