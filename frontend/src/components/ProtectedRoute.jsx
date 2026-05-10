import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

const ProtectedRoute = () => {
  const { token, loading } = useAuth()
  if (loading) return <Loader fullPage />
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
