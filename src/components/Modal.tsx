import { createEffect, onCleanup, JSXElement } from "solid-js"

const Modal = (props: {
	signal: [Function, Function],
	children: JSXElement
}) => {
	const [state, setState] = props.signal

	/**
	 * Close modal when escape button pressed
	 */
	const onEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') setState(false)
	}

	createEffect(() => {
		state()
			? window.addEventListener('keydown', onEscape)
			: window.removeEventListener('keydown', onEscape)
	})
	onCleanup(() => {
		window.removeEventListener('keydown', onEscape)
	})
	
	return (
		<div
			onClick={() => setState(false)}
			className={`
				transition duration-300 ease-in-out fixed z-30 left-0 w-full top-0 h-full flex items-center justify-center overflow-auto bg-black bg-opacity-30
				${state() ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
			`}
		>
			<div onClick={e => e.stopPropagation()} class="m-5 p-5 rounded-lg bg-white">
				{props.children}
			</div>
		</div>
	)
}

export default Modal