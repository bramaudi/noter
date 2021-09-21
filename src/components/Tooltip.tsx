import styles from '../assets/css/tooltip.module.css'
import { JSXElement } from 'solid-js'

const Tooltip = (props: {
	position?: string,
	className?: string
	text: string,
	children: JSXElement
}) => {
	const {position, text, children} = props
	return (
		<div
			data-tooltip={text}
			className={`${styles[`tooltip__${position || 'top'}`]} ${styles.tooltip} ${props.className}`}
		>
			{children}
		</div>
	)
}

export default Tooltip