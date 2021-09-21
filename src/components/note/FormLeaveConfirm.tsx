import Modal from "../Modal"

const FormLeaveConfirm = ({ signal, onConfirm } : {
	signal:[Function, Function],
	onConfirm: (e: MouseEvent) => void
}) => {
	const [modal, setModal] = signal
	return (
		<Modal signal={[modal, setModal]}>
			<div className="p-2">You have made changes, leave without saving?</div>
			<div className="p-2 flex items-center">
				<button
					onClick={onConfirm}
					type="button"
					className="cursor-pointer p-2 rounded whitespace-nowrap bg-red-300 hover:bg-red-400 focus:ring focus:outline-none"
				>
					Yes, don't save
				</button>
				<button
					onClick={() => setModal(false)}
					type="button"
					className="cursor-pointer p-2 rounded ml-auto focus:ring focus:outline-none"
				>
					Cancel
				</button>
			</div>
		</Modal>
	)
}

export default FormLeaveConfirm