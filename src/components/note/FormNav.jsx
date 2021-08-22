import { onMount, onCleanup } from 'solid-js'
import iconArrowRight from '../../assets/icons/arrow-right.svg'
import iconCheck from '../../assets/icons/check.svg'

const propsTypes = {
	signal: [() => null, () => null],
	onBack: () => null,
}

const FormNav = (props = propsTypes) => {
	const refs = { submitButton: null }
	const {onBack,signal} = props
	const [formData, setFormData] = signal

	/**
	 * Click save button on Ctrl+Enter
	 * @param {KeyboardEvent} event 
	 */
	 const navigateSubmitEvent = (event) => {
		if (event.ctrlKey && event.key === 'Enter') {
			refs.submitButton.click()
		}
	}

	onMount(() => {
		window.addEventListener('keydown', navigateSubmitEvent)
	})
	onCleanup(() => {
		window.removeEventListener('keydown', navigateSubmitEvent)
	})

	return (
		<div className="flex items-center mb-3">
			{/* Back */}
			<button onClick={onBack} type="button" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400">
				<img className="w-5 h-5 transform -rotate-180" src={iconArrowRight} alt="back" />
			</button>
			{/* Note title */}
			<input
				onInput={e => setFormData(n => ({...n, title: e.target.value}))}
				className="mx-3 -mb-1 font-medium outline-none bg-transparent border-b border-transparent focus:border-blue-500 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
				value={formData().title}
				placeholder="Untitled"
				/>
			{/* Save */}
			<button ref={refs.submitButton} type="submit" className="cursor-pointer p-2 rounded whitespace-nowrap bg-gray-300 hover:bg-gray-400">
				<img className="w-5 h-5" src={iconCheck} alt="back" />
			</button>
		</div>
	)
}

export default FormNav