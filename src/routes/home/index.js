import { Component } from 'preact'

import AppList from '@/components/app-list'
import Api from '@/api'

// import style from './style.css'

class Home extends Component {
	state = {
		latest: [],
		trending: []
	}

	componentDidMount () {
		this.fetchApps()
	}

	fetchApps = async () => {
		const time = Date.now()
		const page_trending = Math.floor(time / (1000 * 60 * 60)) % 53
		const page_new = time % 25

		const trending = await (Api.Apps()
		.query({ _embed: 'icons' })
		.query({ _page: page_trending, _limit: 5 })
		.get())

		this.setState({ trending })

		const latest = await (Api.Apps()
		.query({ _embed: 'icons' })
		.query({ _page: page_new, _limit: 10 })
		.get())

		this.setState({ latest })
	}

	render ({}, { latest, trending }) {
		return (
			<div class='container'>
				<AppList apps={trending} title='Trending' />
				<AppList apps={latest} title='New' />
				<footer class='mt-10'>
					<Links />
				</footer>
			</div>
		)
	}
}

const Links = () => {
  const links = [
		{ title: 'Submit App', link: 'https://shashwat988522.typeform.com/to/vUK59PFC' },
		{ title: 'Twitter', link: 'https://twitter.com/testflight_live' },
		{ title: 'Email', link: 'mailto:testflightlive@gmail.com'}
	]

  return (
    <ul>
      {links.map(({ link, title }, index) => <li class='list'><a href={link}key={index}>{title}</a></li>)}
    </ul>
  )
}

export default Home
