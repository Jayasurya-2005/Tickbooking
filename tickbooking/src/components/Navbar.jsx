import { Link } from 'react-router-dom'
import useAuth from '../context/useAuth.js'

export default function Navbar() {
  const { user, isCheckingAuth } = useAuth()

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link className="brand" to="/" aria-label="TickBook home">
          <span className="brand-mark">T</span>
          <span>tick<span>book</span></span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/#movies">Movies</Link>
          {!isCheckingAuth && user ? (
            <div className="nav-account">
              <Link className="nav-profile" to="/profile">
                <span className="nav-avatar" aria-hidden="true">{(user.name || user.email || 'U').slice(0, 1).toUpperCase()}</span>
                Profile
              </Link>
            </div>
          ) : !isCheckingAuth ? (
            <>
              <Link to="/login">Login</Link>
              <Link className="nav-register" to="/register">Register</Link>
            </>
          ) : <span className="nav-loading" role="status">Checking session…</span>}
        </nav>
      </div>
    </header>
  )
}
