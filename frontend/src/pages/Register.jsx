import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/login.css'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.')
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
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <div className="auth-brand-icon"><i className="fas fa-plane-departure" /></div>
            <span className="auth-brand-name">Traveloop</span>
          </div>
          <h1 className="auth-left-title">Start Your Travel Story Today</h1>
          <p className="auth-left-subtitle">
            Join thousands of travelers who plan smarter, travel better, and experience more with Traveloop.
          </p>
          <div className="auth-features">
            {[
              { icon: 'fa-rocket', text: 'Get started in under 2 minutes' },
              { icon: 'fa-shield-halved', text: 'Secure & private by default' },
              { icon: 'fa-cloud', text: 'All your trips saved to the cloud' },
              { icon: 'fa-mobile-screen', text: 'Works on mobile, tablet, and desktop' },
            ].map(f => (
              <div className="auth-feature-item" key={f.text}>
                <div className="auth-feature-icon"><i className={`fas ${f.icon}`} /></div>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-box-logo">
            <div className="auth-box-logo-icon"><i className="fas fa-plane-departure" /></div>
            <span className="auth-box-logo-text">Traveloop</span>
          </div>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Fill in the details below to get started</p>

          {serverError && (
            <div className="alert alert-error">
              <i className="fas fa-circle-exclamation" /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <i className="fas fa-user input-icon" />
                <input type="text" name="name" id="reg-name" className="form-input"
                  placeholder="John Doe" value={form.name} onChange={handleChange} autoComplete="name" />
              </div>
              {errors.name && <span className="form-error"><i className="fas fa-circle-exclamation" />{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <i className="fas fa-envelope input-icon" />
                <input type="email" name="email" id="reg-email" className="form-input"
                  placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
              {errors.email && <span className="form-error"><i className="fas fa-circle-exclamation" />{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <i className="fas fa-lock input-icon" />
                <input type={showPass ? 'text' : 'password'} name="password" id="reg-password"
                  className="form-input" placeholder="Min. 6 characters" value={form.password}
                  onChange={handleChange} style={{ paddingRight: '42px' }} />
                <button type="button" className="password-toggle" onClick={() => setShowPass(p => !p)}>
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              {errors.password && <span className="form-error"><i className="fas fa-circle-exclamation" />{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrap">
                <i className="fas fa-lock input-icon" />
                <input type="password" name="confirmPassword" id="reg-confirm"
                  className="form-input" placeholder="Re-enter your password"
                  value={form.confirmPassword} onChange={handleChange} />
              </div>
              {errors.confirmPassword && <span className="form-error"><i className="fas fa-circle-exclamation" />{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><i className="fas fa-circle-notch fa-spin" /> Creating account...</> : <><i className="fas fa-user-plus" /> Create Account</>}
            </button>
          </form>

          <div className="auth-footer-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
