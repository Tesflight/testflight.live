import { Component } from 'preact'
import { QRCodeSVG } from '@cheprasov/qrcode'
import Url from 'url-request'

import Api from '@/api'
import { SVGComponent } from '@/components/util'
import HeadTag from '@/components/head'
import DevProfile from '@/components/dev-profile'

import style from './style.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      app: props.app || {
        icons: [{}],
        screenshots: [{}],
      }
    }
  }

  async componentWillMount () {
    if (typeof window !== 'undefined') {
		  await this.fetchApp()
    }
	}

	fetchApp = async () => {
		const app = await (Url(`${Api.Base.url}/apps/${this.props.id}?_embed=screenshots&_embed=icons`)
		.get())
    
    const devId = app.devId
    if (devId) {
      const dev = await (Url(`${Api.Base.url}/devs/${devId}?_embed=avatars`)
		.get())
      app.dev = dev
    }

		this.setState({ app })
	}

	render ({ }, { app }) {
		return (
			<article >
        <section class='container'>
          <Head  app={app} />
          <Header app={app} />
          <Description text={app.description} />
        </section>
        <Screenshots screenshots={app.screenshots} />
        <section class='container space-y-10'>
          <Links app={app} />
          <DevProfile dev={app.dev} />
        </section>
			</article>
		)
	}
}

const Head = ({ app = {} }) => {
  if (!app.id || Object.keys(app).length === 0 ) {
    return
  }

  const title = `${app.name} - ${app.categories}`
  const description = (app.description || '').slice(0, 100)
  const twitter = `@${(app.twitter || '/testflight_live').split('/').pop()}`

  return (
    <HeadTag
      title={title}
      description={description}
      image={{
        favicon: app.icons[0].url,
        android: app.icons[0].url,
        apple: app.icons[0].url
      }}
      url={`https://testflight.live/app/${app.id}`}
      twitter={twitter}
      manifest='/manifest.json'
    />
  )
}

class Header extends Component {
  state = {
    get: false
  }

  install = () => {
    this.setState({ get: true })
  }

  render ({ app }, { get }) {
    return (
      <header class='flex md:mt-4'>
        <Logo app={app} get={get} />
        <div class='ml-6'>
          <h3>{app.name}</h3>
          <h4 class='text-gray-light-6 mb-2 md:mb-24'>{app.categories}</h4>
          <Status app={app} get={get} install={this.install} />
        </div>
      </header>
    )
  } 
}
  
const Logo = ({ app: { icons, testflight_url }, get }) => {
  if (typeof window !== 'undefined') {
    const isMobile = window.screen.width <= 1000
    if (get && !isMobile) {
      return <QrCode link={testflight_url} class={`${style.qr} box-shadow`} />
    }
  }
  return <img src={icons[0].url} class={`${style.logo} box-shadow`} />
}

const Status = ({ app, get, install }) => {
  switch (app.status) {
    case 'Public':
      if (get) {
        return <a class='btn bg-green-dark' href={app.testflight_url}>INSTALL</a>
      }
      return <button class='btn' onClick={install}>GET</button>
    default:
      return (
        <span>{app.status}</span>
      )
  }
}

const CHAR_LIMIT = 290

class Description extends Component {
  state = {
    expand: false
  }

  toggle = () => {
    this.setState({ expand: !this.state.expand })
  }

  render({ text = '' }, { expand }) {
    const isButton = !expand && text.length > CHAR_LIMIT
    return (
      <div class='mt-10 font-light text-sm'>
        <p class='text-sm'>{expand ? text : text.slice(0, CHAR_LIMIT)}</p>
        {isButton ? <button onClick={this.toggle} class='float-right text-blue-dark' style={{ marginTop: -20, marginRight: 20}}>more</button> : null}
      </div>
    )
  }
}

const Screenshots = ({ screenshots }) => (
    <section class={`${style.scOut} overflow-y-hidden my-6`}>
      <div class={`${style.scIn} flex overflow-x-scroll pb-10 px-4`}>
        {screenshots.map((screenshot, index) => <img src={screenshot.url} key={index} class={`${style.screenshot} box-shadow mr-6`} />)}
      </div>
    </section>
)

const Links = ({ app: { website, twitter, email } }) => {
  const links = []
  if (website) {
    links.push({ title: 'Website', link: website })
  }
  if (twitter) {
    links.push({ title: 'Twitter', link: twitter })
  }
  if (email) {
    links.push({ title: 'Email', link: `mailto:${email}` })
  }

  return (
    <ul>
      {links.map(({ link, title }, index) => <li class='list'><a href={link}key={index}>{title}</a></li>)}
    </ul>
  )
}

const QrCode = ({ link, ...props }) => {
  const qrSVG = new QRCodeSVG(link)
  const svg = qrSVG.toString()
  const SVG = SVGComponent(svg)

  return <SVG {...props} />
}

export default App