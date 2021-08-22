import iconPlus from '../assets/icons/plus.svg'

const FloatActionButton = (props) => (
	<button {...props} className="fixed right-7 bottom-7 opacity-70 cursor-pointer rounded-full ring-green-900 focus:ring focus:outline-none">
		<div className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 text-gray-300">
			<img className="w-10 h-10 invert" src={iconPlus} alt="+" />
		</div>
	</button>
)

export default FloatActionButton