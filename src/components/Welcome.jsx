import iconArrowRight from '../assets/icons/arrow-right.svg'
import iconCoffee from '../assets/icons/coffee.svg'
import iconUploadCloud from '../assets/icons/upload-cloud.svg'
import iconLock from '../assets/icons/lock.svg'
import { Link } from 'solid-app-router'
import supabase, { auth } from '../supabase'

const Welcome = () => {
	if (!auth) {
		supabase.auth.onAuthStateChange(() => {
			window.location.href = '/'
		})
	}
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="max-w-xl mb-14">

				<div className="p-5 m-5 leading-7 bg-white rounded-md shadow-md">
					<h1 className="text-4xl font-semibold">Catat</h1>
					<div className="p-2 font-light">
						— &nbsp; is a simple & secure taking notes app,
						come with sync features and modern UI design.
					</div>
					<div className="text-center">
						<Link
							href="/login"
							className="inline-flex items-center mt-5 p-2 px-3 rounded bg-green-700 hover:bg-green-900 text-gray-100"
							>
							<div className="mr-2">Continue</div>
							<img className="invert" src={iconArrowRight} alt="arrow-right" />
						</Link>
					</div>
				</div>

				<h2 className="text-4xl font-thin my-16 text-center">Features</h2>

					<div className="m-10 mx-6 flex items-center">
						<div className="flex-1 mr-2">
							<div className="text-2xl font-thin mb-2">Free & open source</div>
							<div className="font-light">
								<strong>Catat</strong> is totally free and open source with no hidden price or paywall,
								contributors are welcome.
							</div>
						</div>
						<div
							className="flex w-28 h-28 items-center justify-center p-5 ml-5 bg-yellow-100"
							style="border-radius: 30% 70% 70% 30% / 57% 55% 45% 43%"
							>
							<img
								className="flex w-28 h-28 opacity-70 mx-5 m-10"
								src={iconCoffee}
								alt="check" />
						</div>
					</div>

					<div className="m-10 mx-6 flex items-center text-right">
						<div
							className="flex w-28 h-28 items-center justify-center p-5 mr-5 bg-blue-100"
							style="border-radius: 55% 45% 77% 23% / 23% 62% 38% 77%"
							>
							<img
								className="flex w-28 h-28 opacity-70 mx-5 m-10"
								src={iconUploadCloud}
								alt="upload-cloud" />
						</div>
						<div className="flex-1 ml-2">
							<div className="text-2xl font-thin mb-2">Online sync / Self-hosted</div>
							<div className="font-light">
								Don't lost your notes & keep it sync across multiple devices with
								our <em>Supabase</em> cloud or you can self-hosted your own.
							</div>
						</div>
					</div>

					<div className="m-10 mx-6 mt-10 flex items-center">
						<div className="flex-1 ml-2">
							<div className="text-2xl font-thin mb-2">Encrypted notes</div>
							<div className="font-light">
								Your notes will encrypted before saving in database so you can
								take a private note with no worries.
							</div>
						</div>
						<div
							className="flex w-28 h-28 items-center justify-center p-5 ml-5 bg-green-100"
							style="border-radius: 35% 65% 62% 38% / 67% 30% 70% 33% "
							>
							<img
								className="flex w-28 h-28 opacity-70 mx-5 m-10"
								src={iconLock}
								alt="lock" />
						</div>
					</div>

			</div>
		</div>
	)
}

export default Welcome