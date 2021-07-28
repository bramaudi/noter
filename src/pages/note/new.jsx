import { Link, useNavigate } from "solid-app-router"
import { createSignal } from "solid-js"
import supabase from "../../supabase"

const createNote = () => {
	const navigate = useNavigate()
	const [note, setNote] = createSignal({
		title: '',
		body: '',
		tags: ''
	})
	const postNewNote = async (e) => {
		e.preventDefault()
		const filteredNote = {
			...note(),
			tags: note().tags.split(',')
		}
		const { error } = await supabase
			.from('notes')
			.insert(filteredNote)
		if (error) console.log(error.message);
		navigate('/')
	}
	return (
		<div className="p-5">
			<form onSubmit={postNewNote} className="my-5">
				<div class="relative border-b-2 focus-within:border-blue-500">
					<input
						onInput={e => setNote(note => ({ ...note, title: e.target.value }))}
						type="text" name="note-title" placeholder=" " class="block w-full appearance-none focus:outline-none bg-transparent" />
					<label htmlFor="note-title" class="absolute top-0 -z-1 duration-300 origin-0">Title</label>
				</div>
				<textarea
					onInput={e => setNote(note => ({ ...note, body: e.target.value }))}
					className="block w-full my-5 p-2 px-3 border-2 rounded outline-none focus:ring-0 focus:border-blue-500"
					id="note-body"
					cols="30"
					rows="10"
					placeholder="Write a note here ..."
					></textarea>
				<div class="my-10 relative border-b-2 focus-within:border-blue-500">
					<input
						onInput={e => setNote(note => ({ ...note, tags: e.target.value }))}
						type="text" name="note-tags" placeholder=" " class="block w-full appearance-none focus:outline-none bg-transparent" />
					<label htmlFor="note-tags" class="absolute top-0 -z-1 duration-300 origin-0">Tags</label>
					<small>Separate with comma</small>
				</div>
				<button
					className="inline-block p-2 px-3 rounded bg-green-700 hover:bg-green-900 text-gray-100"
					type="submit">
					Submit
				</button>
				<Link
					className="inline-block p-2 px-3 ml-3 rounded bg-blue-200 hover:bg-blue-300"
					href="/">
					Back
				</Link>
			</form>
		</div>
	)
}

export default createNote