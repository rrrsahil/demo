import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/header.css'

const API_BASE = 'http://localhost:5000'

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <header className="header">
      <nav className="navbar">
        {/* Logo */}
        <Link to="/dashboard" className="nav-logo">
          <div className="nav-logo-icon">
            <i className="fas fa-plane-departure" />
          </div>
          <span className="nav-logo-text">Traveloop</span>
        </Link>

        {/* Right Side */}
        <div className="nav-right">
          {/* User Dropdown */}
          <div className="nav-user" ref={dropdownRef} onClick={() => setDropdownOpen(p => !p)}>
            <div className="nav-avatar">
              {user?.profileImage
                ? <img src={`${API_BASE}${user.profileImage}`} alt={user.name} />
                : getInitials(user?.name)
              }
            </div>
            <span className="nav-user-name">{user?.name}</span>
            <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}
               style={{ fontSize: '11px', color: 'var(--text-muted)' }} />

            {dropdownOpen && (
              <div className="user-dropdown">
                <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border-color)', marginBottom: '6px' }}>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>{user?.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user?.email}</p>
                </div>
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <i className="fas fa-user" /> My Profile
                </Link>
                <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <i className="fas fa-gauge" /> Dashboard
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <i className="fas fa-right-from-bracket" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger for mobile */}
          <button className="hamburger" onClick={onMenuToggle} aria-label="Toggle menu">
            <i className="fas fa-bars" />
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Header
