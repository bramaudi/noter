import iconPlus from '../assets/icons/plus.svg'

const FloatActionButton = (props) => (
	<div {...props} className="fixed right-7 bottom-7 opacity-70 cursor-pointer">
		<div className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 text-gray-300">
			<img className="w-10 h-10 invert" src={iconPlus} alt="+" />
		</div>
	</div>
)

export default FloatActionButton