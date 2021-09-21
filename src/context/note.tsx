import { createContext, useContext } from "solid-js"
import { Store, SetStoreFunction, createStore } from "solid-js/store"
import { NoteFormat, noteEmpty } from "@models/notes"

type Note = {
	single: NoteFormat,
	list: NoteFormat[]
}
type Context = [
	Store<Note>,
	SetStoreFunction<Note>
]

const NoteContext = createContext<Context>()

export const NoteProvider = (props: {
	initial: NoteFormat[]
	children: unknown
}) => {
	const [note, setNote] = createStore({
		single: noteEmpty,
		list: props.initial
	})

	return (
		<NoteContext.Provider value={[note, setNote]}>
			{props.children}
		</NoteContext.Provider>
	)
}

export const useNote = () => useContext<Context>(NoteContext)