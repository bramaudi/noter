import styles from '../assets/css/tooltip.module.css'

const defaultProps = {
	position: 'top',
	text: '',
	children: () => null
}

const Tooltip = (props = defaultProps) => {
	const { position, text, children } = props
	return (
		<div
			data-tooltip={text}
			className={styles.tooltip}
			className={styles[`tooltip__${position || 'top'}`]}
		>
			{children}
		</div>
	)
}

export default Tooltip