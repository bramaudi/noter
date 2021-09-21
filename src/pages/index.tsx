import styles from '@assets/css/masonry.module.css'
import { createEffect, For } from 'solid-js'
import supabase from '@services/supabase'
import { auth } from '@services/auth'
import { NoteDummy, notesFetchAll } from '@models/notes-dummy'
// Components
import divider from '@assets/divider.svg'
import iconGithub from '@assets/icons/github.svg'
import iconCheck from '@assets/icons/check.svg'
import { Link } from 'solid-app-router'
import Masonry from 'solid-masonry'
import { formatDate } from '@helper/date'
import { autoTitleSize } from '@helper/style'
import { encodeHTMLEntities, nl2br } from '@helper/string'
import { createSignal } from 'solid-js'
import { onMount } from 'solid-js'
import { onCleanup } from 'solid-js'

const breakpointColumnsObj = {
	default: 4,
	1100: 4,
	700: 2,
	300: 1
}

const FeatureCheck = ({ tips, children }: { tips?: string, children: string }) => {
	return (
		<div className="my-3 flex items-center">
			<img className="mr-2" src={iconCheck} alt="check" />
			<div>
				{children}
				{tips ? <small className="block text-xs text-gray-600">{tips}</small> : null}
			</div>
		</div>
	)
}

const IndexPage = () => {	
	const [dummy, setDummy] = createSignal<NoteDummy[]>([])

	const randomize = setInterval(() => {
		setDummy(notesFetchAll())
	}, 1500)

	createEffect(() => {
		if (!auth) {
			 // full refresh after login
			supabase.auth.onAuthStateChange(() => {
				window.location.href = '/notes'
			})
		}
	})

	onMount(() => {
		setDummy(notesFetchAll())
	})
	onCleanup(() => {
		clearInterval(randomize)
	})

	return (
		<div className="w-full bg-white">
			{/* Hero */}
			<div className="max-w-3xl mx-auto pb-10 sm:pb-0 sm:flex sm:items-center">

				<div className="flex-1 p-10 py-20">
					<div className="text-5xl font-semibold">Noter</div>
					<div className="mt-2">Free open source simple taking note's app with cloud backup & sync, work offline and PWA installable.</div>
					<div className="mt-5 flex items-center">
						<Link
							href="/notes"
							className="p-2 px-3 rounded bg-green-700 hover:bg-green-900 text-gray-100"
							>
							Getting started
						</Link>

						<a
							href="//github.com/bramaudi/noter"
							target="_blank"
							className="p-2 px-3 ml-3 flex items-center rounded bg-gray-300 hover:bg-gray-400 text-black"
						>
							<img className="w-4 mr-2" src={iconGithub} alt="github" />
							<div>Give a star</div>
						</a>
					</div>
				</div>

				<div className="flex-1 px-10 pt-15">
					<FeatureCheck>Free & open-source</FeatureCheck>
					<FeatureCheck tips="Install like native app & work offline">Progressive Web Apps-ready</FeatureCheck>
					<FeatureCheck>Backup or Sync notes</FeatureCheck>
					<FeatureCheck tips="Use it without login">Anonymous user</FeatureCheck>
					<FeatureCheck>Simple & Responsive UI</FeatureCheck>
				</div>

			</div>
			{/* Divider */}
			<div className="-my-1 w-full">
				<img src={divider} alt="Divider" className="w-full" />
			</div>
			{/* Ranomize */}
			<div className="p-5 pt-14 h-96 sm:h-72 overflow-hidden bg-green-700">
				<div className="max-w-3xl mx-auto">
					<Masonry
						breakpointCols={breakpointColumnsObj}
						className={styles.container}
						columnClassName={styles.column}
						each={dummy()}
					>
						{(item: NoteDummy) => (
							<div
								tabIndex="0"
								className="bg-white text-gray-900"
							>
								{/* Both title & body is available */}
								<div
									className={`font-medium ${autoTitleSize(item.title)}`}
								>
									{item.title}
								</div>
								<div
									className={`${autoTitleSize(item.body)}`}
									innerHTML={nl2br(encodeHTMLEntities(item.body))}
								></div>						{/* Tags & Date */}
								<div className="mt-2 text-xs flex items-center opacity-70">
									<div className="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
										<For each={item.tags}>
											{tag => (
												<span className="mr-2">#{tag}</span>
											)}
										</For>
									</div>
									<div className="ml-2 whitespace-nowrap text-right">{formatDate(item.created_at)}</div>
								</div>
							</div>
						)}
					</Masonry>
				</div>
			</div>
		</div>
	)
}

export default IndexPage