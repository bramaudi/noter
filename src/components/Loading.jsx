import { createSignal, onCleanup, onMount } from 'solid-js'
import styles from '../assets/css/masonry.module.css'
import Masonry from './Masonry'

const breakpointColumnsObj = {
	default: 4,
	1100: 4,
	700: 2,
	300: 1
}

const Loading = () => {
	let randomizeInterval
	const [data, setData] = createSignal([1,2,3,4])
	const randomHeight = () => {
		const heightList = [150, 200, 250]
		return heightList[Math.floor(Math.random() * heightList.length)]
	}
	onMount(() => {
		setData(data().map(() => randomHeight()))
		randomizeInterval = setInterval(() => {
			setData(data().map(() => randomHeight()))
		}, 2500)
	})
	onCleanup(() => {
		clearInterval(randomizeInterval)
	})
	return (
		<div className="p-3 animate-pulse">
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className={styles.container}
			>
				{data().map(height => (
					<div
						style={{ height: height + 'px' }}
						class="m-2 mr-0 font-light leading-relaxed border rounded-lg p-3 bg-gray-300"
					></div>
				))}
			</Masonry>
		</div>
	)
}

export default Loading