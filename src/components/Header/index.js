import './index.css'
import {AiFillHome} from 'react-icons/ai'
import {IoBagSharp} from 'react-icons/io5'
import {FiLogOut} from 'react-icons/fi'

import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        alt="website logo"
        className="logo"
      />
      <ul className="small-screens">
        <Link to="/">
          <li>
            <AiFillHome className="reactIcons" />
          </li>
        </Link>
        <Link to="/jobs">
          <li>
            <IoBagSharp className="reactIcons" />
          </li>
        </Link>
        <Link to="/login">
          <li>
            <FiLogOut className="reactIcons" onClick={onLogout} />
          </li>
        </Link>
      </ul>
      <div className="big-screens">
        <Link to="/" className="link">
          <p className="name">Home</p>
        </Link>
        <Link to="/jobs" className="link">
          <p className="name">Jobs</p>
        </Link>
      </div>
      <div className="big-screens">
        <Link to="/login">
          <button type="button" className="btn " onClick={onLogout}>
            Logout
          </button>
        </Link>
      </div>
    </div>
  )
}
export default Header
