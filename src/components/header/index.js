import { Component } from 'preact'
import { route } from 'preact-router'

import CategoryList from '@/components/category-list'

import LogoSVG from '@/assets/icons/base-logo.svg'

import style from './style.css'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false
    }
  }

  toggle = () => {
    this.setState({ active: !this.state.active })
  }

  render ({ categories }, { active }) {
    return (
      <nav class='highlight opaque fixed w-full box-shadow overflow-y-scroll'>
        <div class='container flex justify-between'>
          <Logo />
          { active ? <Search categories={categories} toggle={this.toggle} /> : null }
          <ToggleSearch active={active} toggle={this.toggle} />
        </div>
      </nav>
    )
  }
}

const Logo = () => (
  <a href='/' class='pr-2'>
    <img src={LogoSVG} alt='Logo' style={{ width: 44, height: 44 }} />
  </a>
)

const Search = ({ categories, toggle }) => {

  const stopHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const change = (event) => {
    toggle()
    route(`/search/${event.target.value}`)
  }

  return (
    <div class='md:px-20 w-full' onClick={toggle}>
      <div class='input-container opaque box-shadow' onClick={stopHandler}>
        {/* <Icon icon='Search' class='input-icon' /> */}
        <input type='text' placeholder='Search Apps' class='input bg-transparent' onChange={change}  />
      </div>
      <div class='overflow-x-hidden'>
        <div class='overflow-y-scroll' style={{ height: 'calc(100vh - 60px)', marginRight: -20 }}>
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  )
}

const ToggleSearch = ({ active, toggle }) => (
  <div class='pt-4 cursor-pointer' onClick={toggle}>
    <div class={`${style.bar} ${active ? style.barActive : ''}`} />
    <div class={`${style.bar} ${active ? style.barActive : ''}`} />
  </div>
)

export default Header