import { Navigate, useLocation } from 'react-router-dom'
import Loading from './Loading.jsx'
import useAuth from '../context/useAuth.js'

export default function RequireAuth({ children }) {
  const { isAuthenticated, isCheckingAuth } = useAuth()
  const location = useLocation()

  if (isCheckingAuth) return <Loading label="Verifying your session…" />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
