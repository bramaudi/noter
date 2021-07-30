import { createSignal, For } from "solid-js"
import { invertToBW, rgbToHex } from "../helper/style"
import iconArrowRight from '../assets/icons/arrow-right.svg'
import iconCheck from '../assets/icons/check.svg'

const CreateNote = (props) => {
	const { onBack } = props
	const navigateBack = () => {
		const { lastY, event } = onBack
		event()
		window.scrollTo(window, lastY)
	}
	const [title, setTitle] = createSignal('')
	const [body, setBody] = createSignal('')
	const [tags, setTags] = createSignal([])
	const [color, setColor] = createSignal('#fff')
	const [formError, setFormError] = createSignal(null)
	const tagsAdd = e => {
		if (e.key === 'Enter' && !!e.target.value) {
			e.preventDefault();
			setTags([ ...tags(), e.target.value.replace(/[^a-zA-Z0-9 ]/g, "") ])
			e.target.value = ''
		}
	}
	const tagsRemove = (value) => {
		setTags( tags().filter(item => item !== value) )
	}
	const colorSelect = e => {
		const computedStyle = window.getComputedStyle( e.target ,null);
		const bgColor = computedStyle.getPropertyValue('background-color')
		const [r, g, b] = bgColor.match(/\((.*)\)/)[1].split(',').map(c => c.trim())
		setColor(rgbToHex(r, g, b))
	}
	const submitNote = e => {
		e.preventDefault()
		if (body() === '') return setFormError('body')
		console.log({
			title: title(),
			body: body(),
			tags: tags(),
			color: color(),
		});
	}
	return (
		<div className="p-3">
			<form onSubmit={submitNote}>
				<div className="flex items-center mb-3">
					<button onClick={navigateBack} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400">
						<img className="w-5 h-5 transform -rotate-180" src={iconArrowRight} alt="back" />
					</button>
					<input
						onInput={e => setTitle(e.target.value)}
						className="mx-3 -mb-1 font-semibold outline-none border-b border-transparent focus:border-blue-500 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
						value={title()}
						placeholder="Untitled"
						/>
					<button type="submit" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400">
						<img className="w-5 h-5" src={iconCheck} alt="back" />
					</button>
				</div>
				<textarea
					onInput={e => setBody(e.target.value)}
					onFocus={e => { e.target.classList.remove('border-red-400'); setFormError(null) }}
					className="block w-full my-2 p-2 px-3 border-2 rounded outline-none focus:ring-0 focus:border-blue-500"
					className={formError() === 'body' && 'border-red-400'}
					style={{background: color(), color: invertToBW(color())}}
					id="note-body"
					cols="30"
					rows="10"
					placeholder="Write a note here ..."
					>	
				</textarea>
				<div className="">
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
					<input onChange={e => setColor(e.target.value)} type="color" id="note-color" className="hidden" />
				</div>
				{/* Tags */}
				<div class="relative border-b-2 my-5 focus-within:border-blue-500">
					<input
						onKeyPress={tagsAdd}
						type="text"
						name="note-tags"
						placeholder=" "
						class="block w-full appearance-none focus:outline-none bg-transparent"
						/>
					<label htmlFor="note-tags" class="absolute top-0 -z-1 duration-300 origin-0">Tags</label>
				</div>
				<For each={tags().sort((a, b) => a !== b ? a < b ? -1 : 1 : 0)}>
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

export default CreateNote