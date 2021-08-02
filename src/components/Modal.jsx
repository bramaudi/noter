import { createEffect, onCleanup } from "solid-js"

const propsTypes = {
	onClose: () => null,
	show: () => false,
	children: []
}

const Modal = (props = propsTypes) => {
	const { show, onClose, children } = props
	/**
	 * Close modal when escape button pressed
	 * @param {Event} e 
	 * @returns 
	 */
	const onEscape = (e) => ((e.charCode || e.keyCode) === 27)
		? onClose()
		: null

	createEffect(() => {
		document.body.addEventListener('keydown', onEscape)
	})
	onCleanup(() => {
		document.body.removeEventListener('keydown', onEscape)
	})
	return (
		<div
			onClick={onClose}
			class={show() ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
			class="transition duration-300 ease-in-out fixed z-30 left-0 w-full top-0 h-full flex items-center justify-center overflow-auto bg-black bg-opacity-30"
		>
			<div onClick={e => e.stopPropagation()} class="m-5 p-5 rounded-lg bg-white">
				{children}
			</div>
		</div>
	)
}

export default Modal