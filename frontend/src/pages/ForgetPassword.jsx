import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'
import '../css/login.css'

const ForgetPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return setError('Email is required')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address')
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setSuccess(res.data.message + (res.data.resetUrl ? ` Dev URL: ${res.data.resetUrl}` : ''))
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
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
          <h1 className="auth-left-title">Reset Your Password</h1>
          <p className="auth-left-subtitle">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-box-logo">
            <div className="auth-box-logo-icon"><i className="fas fa-key" /></div>
            <span className="auth-box-logo-text">Forgot Password</span>
          </div>
          <h2 className="auth-title">Reset your password</h2>
          <p className="auth-subtitle">We'll send you a reset link to your email</p>

          {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation" /> {error}</div>}
          {success && <div className="alert alert-success"><i className="fas fa-circle-check" /> {success}</div>}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrap">
                  <i className="fas fa-envelope input-icon" />
                  <input type="email" id="forgot-email" className="form-input"
                    placeholder="you@example.com" value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? <><i className="fas fa-circle-notch fa-spin" /> Sending...</> : <><i className="fas fa-paper-plane" /> Send Reset Link</>}
              </button>
            </form>
          )}

          <div className="auth-footer-text">
            <Link to="/login"><i className="fas fa-arrow-left" /> Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
