import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/api'
import '../css/login.css'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.password) return setError('Password is required')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    setLoading(true)
    setError('')
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <div className="auth-brand-icon"><i className="fas fa-plane-departure" /></div>
            <span className="auth-brand-name">Traveloop</span>
          </div>
          <h1 className="auth-left-title">Set New Password</h1>
          <p className="auth-left-subtitle">Choose a strong password to protect your account.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-box-logo">
            <div className="auth-box-logo-icon"><i className="fas fa-lock" /></div>
            <span className="auth-box-logo-text">New Password</span>
          </div>
          <h2 className="auth-title">Set new password</h2>
          <p className="auth-subtitle">Enter and confirm your new password below</p>

          {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation" /> {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-icon-wrap">
                <i className="fas fa-lock input-icon" />
                <input type="password" id="reset-pass" className="form-input"
                  placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrap">
                <i className="fas fa-lock input-icon" />
                <input type="password" id="reset-confirm" className="form-input"
                  placeholder="Re-enter your new password" value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><i className="fas fa-circle-notch fa-spin" /> Resetting...</> : <><i className="fas fa-lock" /> Reset Password</>}
            </button>
          </form>
          <div className="auth-footer-text">
            <Link to="/login"><i className="fas fa-arrow-left" /> Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
