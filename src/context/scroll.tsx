import { createContext, useContext } from "solid-js"
import { Store, SetStoreFunction, createStore } from "solid-js/store"

type Scroll = {
	y: number
}
type Context = [
	scroll: Store<Scroll>,
	setScroll: SetStoreFunction<Scroll>
]

const ScrollContext = createContext<Context>()

export const ScrollProvider = (props: { children: unknown }) => {
	const [scroll, setScroll] = createStore({
		y: 0
	})

	return (
		<ScrollContext.Provider value={[scroll, setScroll]}>
			{props.children}
		</ScrollContext.Provider>
	)
}

export const useScroll = () => useContext(ScrollContext)