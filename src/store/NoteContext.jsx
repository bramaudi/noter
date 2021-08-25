import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { notesFormat } from '../models/notes'

const NoteContext = createContext()

export const NoteProvider = (props) => {
	const [note, setNote] = createStore({
		single: notesFormat,
		list: [notesFormat]
	})
	const store = [note, setNote]

	return (
		<NoteContext.Provider value={store}>
			{props.children}
		</NoteContext.Provider>
	)
}

export const useNote = () => useContext(NoteContext)