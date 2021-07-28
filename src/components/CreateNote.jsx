import { createSignal } from "solid-js"

const CreateNote = () => {
	const [title, setTitle] = createSignal('')
	return (
		<div>
			<form>
				<div class="relative border-b-2 focus-within:border-blue-500">
					<input
						onInput={e => setTitle(e.target.value)}
						type="text" name="note-title" placeholder=" " class="block w-full appearance-none focus:outline-none bg-transparent" />
					<label htmlFor="note-title" class="absolute top-0 -z-1 duration-300 origin-0">Title</label>
				</div>
			</form>
		</div>
	)
}

export default CreateNote