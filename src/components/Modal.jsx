import { createEffect, onCleanup } from "solid-js"

const propsType = {
	onClose: () => null,
	show: () => false,
	children: []
}

const Modal = (props = propsType) => {
	const { show, onClose, children } = props
	const onEscape = (e) => {
		if ((e.charCode || e.keyCode) === 27) {
			onClose()
		}
	}
	createEffect(() => {
		document.body.addEventListener('keydown', onEscape)
		onCleanup(() => {
			document.body.removeEventListener('keydown', onEscape)
		})
	})
	return (
		<div
			class="transition duration-300 ease-in-out fixed z-30 left-0 w-full top-0 h-full flex items-center justify-center overflow-auto bg-black bg-opacity-30"
			class={show() ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
			onClick={onClose}
			>
			<div class="m-5 p-5 rounded-lg bg-white" onClick={e => e.stopPropagation()}>
				{children}
			</div>
		</div>
	)
}

export default Modal