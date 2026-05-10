import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/login.css'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <div className="auth-brand-icon"><i className="fas fa-plane-departure" /></div>
            <span className="auth-brand-name">Traveloop</span>
          </div>
          <h1 className="auth-left-title">Plan Your Perfect Journey</h1>
          <p className="auth-left-subtitle">
            Create stunning trip itineraries, track your budget, and make every adventure unforgettable.
          </p>
          <div className="auth-features">
            {[
              { icon: 'fa-map-location-dot', text: 'Build detailed day-by-day itineraries' },
              { icon: 'fa-wallet', text: 'Track expenses & budget breakdowns' },
              { icon: 'fa-list-check', text: 'Packing checklist & travel notes' },
              { icon: 'fa-users', text: 'Share trips with the community' },
            ].map(f => (
              <div className="auth-feature-item" key={f.text}>
                <div className="auth-feature-icon"><i className={`fas ${f.icon}`} /></div>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-box-logo">
            <div className="auth-box-logo-icon"><i className="fas fa-plane-departure" /></div>
            <span className="auth-box-logo-text">Traveloop</span>
          </div>

          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue planning your adventures</p>

          {serverError && (
            <div className="alert alert-error">
              <i className="fas fa-circle-exclamation" /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <i className="fas fa-envelope input-icon" />
                <input
                  type="email" name="email" id="login-email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error"><i className="fas fa-circle-exclamation" />{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="flex-between">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--primary)' }}>Forgot password?</Link>
              </div>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <i className="fas fa-lock input-icon" />
                <input
                  type={showPass ? 'text' : 'password'} name="password" id="login-password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  style={{ paddingRight: '42px' }}
                />
                <button type="button" className="password-toggle" onClick={() => setShowPass(p => !p)}>
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              {errors.password && <span className="form-error"><i className="fas fa-circle-exclamation" />{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><i className="fas fa-circle-notch fa-spin" /> Signing in...</> : <><i className="fas fa-right-to-bracket" /> Sign In</>}
            </button>
          </form>

          <div className="auth-footer-text">
            Don't have an account? <Link to="/register">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
