import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/sidebar.css'

const NAV_ITEMS = [
  { section: 'Main', links: [
    { to: '/dashboard', icon: 'fas fa-gauge', label: 'Dashboard' },
    { to: '/trips', icon: 'fas fa-suitcase-rolling', label: 'My Trips' },
    { to: '/trips/create', icon: 'fas fa-plus-circle', label: 'Create Trip' },
  ]},
  { section: 'Explore', links: [
    { to: '/activities', icon: 'fas fa-compass', label: 'Activities' },
    { to: '/community', icon: 'fas fa-users', label: 'Community' },
  ]},
  { section: 'Account', links: [
    { to: '/profile', icon: 'fas fa-user-circle', label: 'Profile' },
  ]},
]

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose()
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <i className="fas fa-plane-departure" />
            </div>
            Traveloop
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <i className="fas fa-xmark" />
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ section, links }) => (
            <div className="sidebar-section" key={section}>
              <p className="sidebar-section-title">{section}</p>
              {links.map(({ to, icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  onClick={onClose}
                >
                  <i className={icon} />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <i className="fas fa-right-from-bracket" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
