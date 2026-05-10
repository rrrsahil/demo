import '../css/global.css'

const Loader = ({ fullPage = false, size = 36 }) => {
  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, flexDirection: 'column', gap: '16px'
      }}>
        <div style={{
          width: size, height: size,
          border: '3px solid #e2e8f0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite'
        }} />
        <p style={{ color: '#64748b', fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div className="page-loader">
      <div className="spinner" />
    </div>
  )
}

export default Loader
