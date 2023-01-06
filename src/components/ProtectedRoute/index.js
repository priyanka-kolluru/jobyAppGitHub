import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'

const ProtectedRoute = props => {
  const token = Cookies.get('jwt_token')

  if (token !== undefined) {
    return <Route {...props} />
  }
  return <Redirect to="/login" />
}
export default ProtectedRoute
