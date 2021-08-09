import { createContext, createSignal, useContext } from "solid-js"
import { structure } from '../models/notes'

const NoteContext = createContext()

export const NoteProvider = (props) => {
	const defaultNote = {
		single: structure,
		list: [structure]
	}
	const [note, setNote] = createSignal(props.notes || defaultNote)
	const store = [note, setNote]

	return (
		<NoteContext.Provider value={store}>
			{props.children}
		</NoteContext.Provider>
	)
}

export const useNote = () => useContext(NoteContext)