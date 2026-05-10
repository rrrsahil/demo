import { Link } from 'react-router-dom'
import '../css/global.css'

const NotFound = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexDirection: 'column', gap: '16px',
    fontFamily: 'Poppins, sans-serif', textAlign: 'center', padding: '20px'
  }}>
    <div style={{ fontSize: '80px' }}>✈️</div>
    <h1 style={{ fontSize: '72px', fontWeight: '700', color: '#e2e8f0', lineHeight: 1 }}>404</h1>
    <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#0f172a' }}>Page Not Found</h2>
    <p style={{ color: '#64748b', maxWidth: '360px' }}>
      Looks like this destination doesn't exist on our map yet.
    </p>
    <Link to="/dashboard" style={{
      marginTop: '8px', padding: '11px 24px',
      background: '#2563eb', color: '#fff', borderRadius: '8px',
      fontWeight: '500', fontSize: '14px', textDecoration: 'none'
    }}>
      Back to Dashboard
    </Link>
  </div>
)

export default NotFound
