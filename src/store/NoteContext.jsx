import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { structure } from '../models/notes'

const NoteContext = createContext()

export const NoteProvider = (props) => {
	const [note, setNote] = createStore({
		single: structure,
		list: [structure]
	})
	const store = [note, setNote]

	return (
		<NoteContext.Provider value={store}>
			{props.children}
		</NoteContext.Provider>
	)
}

export const useNote = () => useContext(NoteContext)