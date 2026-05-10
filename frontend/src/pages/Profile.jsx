import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'
import { API_BASE } from '../utils/constants'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const fileRef = useRef(null)
  const [name, setName] = useState(user?.name || '')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passError, setPassError] = useState('')
  const [passSuccess, setPassSuccess] = useState('')
  const [changingPass, setChangingPass] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Name cannot be empty')
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const fd = new FormData()
      fd.append('name', name)
      if (imageFile) fd.append('profileImage', imageFile)
      const res = await api.put('/profile/update', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      updateUser(res.data.user)
      setSuccess('Profile updated successfully!')
      setImageFile(null)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError(err.response?.data?.message || 'Update failed') }
    finally { setSaving(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (!passForm.currentPassword || !passForm.newPassword) return setPassError('All fields required')
    if (passForm.newPassword.length < 6) return setPassError('New password must be at least 6 characters')
    if (passForm.newPassword !== passForm.confirmPassword) return setPassError('Passwords do not match')
    setChangingPass(true)
    setPassError('')
    setPassSuccess('')
    try {
      await api.put('/profile/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      })
      setPassSuccess('Password changed successfully!')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPassSuccess(''), 3000)
    } catch (err) { setPassError(err.response?.data?.message || 'Failed to change password') }
    finally { setChangingPass(false) }
  }

  const getInitials = (n) => n?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div style={{ margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="page-title"><i className="fas fa-user-circle" style={{ color: 'var(--primary)', marginRight: '10px' }} />My Profile</h1>
        <p className="page-subtitle">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px' }}>
          <i className="fas fa-id-card" style={{ color: 'var(--primary)', marginRight: '8px' }} />Profile Information
        </h3>

        {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation" /> {error}</div>}
        {success && <div className="alert alert-success"><i className="fas fa-circle-check" /> {success}</div>}

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'var(--primary-light)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: '700', overflow: 'hidden', border: '3px solid var(--border-color)'
            }}>
              {imagePreview
                ? <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : user?.profileImage
                  ? <img src={`${API_BASE}${user.profileImage}`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : getInitials(user?.name)
              }
            </div>
            <button onClick={() => fileRef.current?.click()} style={{
              position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px',
              background: 'var(--primary)', color: '#fff', border: '2px solid #fff',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '12px'
            }}>
              <i className="fas fa-camera" />
            </button>
          </div>
          <div>
            <p style={{ fontWeight: '600', fontSize: '16px' }}>{user?.name}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user?.email}</p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }} onClick={() => fileRef.current?.click()}>
              Change Photo
            </button>
          </div>
        </div>

        <input ref={fileRef} type="file" id="profile-image" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" id="profile-name" className="form-input" value={name}
              onChange={e => { setName(e.target.value); setError('') }} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={user?.email || ''} disabled
              style={{ background: 'var(--secondary-bg)', cursor: 'not-allowed' }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <><i className="fas fa-circle-notch fa-spin" /> Saving...</> : <><i className="fas fa-floppy-disk" /> Save Changes</>}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px' }}>
          <i className="fas fa-lock" style={{ color: 'var(--warning)', marginRight: '8px' }} />Change Password
        </h3>

        {passError && <div className="alert alert-error"><i className="fas fa-circle-exclamation" /> {passError}</div>}
        {passSuccess && <div className="alert alert-success"><i className="fas fa-circle-check" /> {passSuccess}</div>}

        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" id="current-pass" className="form-input" placeholder="Enter current password"
              value={passForm.currentPassword}
              onChange={e => { setPassForm(p => ({ ...p, currentPassword: e.target.value })); setPassError('') }} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" id="new-pass" className="form-input" placeholder="Min. 6 characters"
              value={passForm.newPassword}
              onChange={e => { setPassForm(p => ({ ...p, newPassword: e.target.value })); setPassError('') }} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" id="confirm-pass" className="form-input" placeholder="Re-enter new password"
              value={passForm.confirmPassword}
              onChange={e => { setPassForm(p => ({ ...p, confirmPassword: e.target.value })); setPassError('') }} />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={changingPass}>
            {changingPass ? <><i className="fas fa-circle-notch fa-spin" /> Changing...</> : <><i className="fas fa-lock" /> Change Password</>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
