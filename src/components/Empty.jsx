import iconCheck from '../assets/icons/check.svg'

const Empty = () => (
	<div className="flex items-center justify-center mt-52">
		<div className="px-5">
			<img src={iconCheck} alt="check" className="block w-20 h-20 mx-auto mb-3" />
			<div>Notes is empty</div>
		</div>
	</div>
)

export default Empty