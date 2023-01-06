import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = data => {
    const {history} = this.props
    Cookies.set('jwt_token', data.jwt_token, {expires: 30})
    history.replace('/')
  }

  onSubmitUser = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      this.onSubmitSuccess(data)
    } else {
      this.setState({errorMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-background">
        <div className="card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form className="form" onSubmit={this.onSubmitUser}>
            <label htmlFor="username" className="labels">
              USERNAME
            </label>
            <input
              type="text"
              className="inputs"
              id="username"
              value={username}
              placeholder="Username"
              onChange={this.onChangeUsername}
            />
            <label htmlFor="password" className="labels">
              PASSWORD
            </label>
            <input
              type="password"
              className="inputs"
              id="password"
              value={password}
              placeholder="Password"
              onChange={this.onChangePassword}
            />
            <button type="submit" className="btn">
              Login
            </button>
            <p className="error">{errorMsg}</p>
          </form>
        </div>
      </div>
    )
  }
}
export default Login
