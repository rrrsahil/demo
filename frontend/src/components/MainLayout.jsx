import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuToggle={() => setSidebarOpen(p => !p)} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main style={{
          flex: 1,
          padding: '28px 24px',
          overflowY: 'auto',
          background: 'var(--secondary-bg)',
          minHeight: 'calc(100vh - var(--header-height))',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
