import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import "./App.css"
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Bookings from './pages/Bookings'
import Inventory from './pages/Inventory'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Schedule from './pages/Schedule'
import Settings from './pages/Settings'
import { FaBars, FaCog, FaUser } from 'react-icons/fa'

// Simple Header component directly in App.jsx
const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <Link to="/" className="logo">
          Alexis Construction Services
        </Link>
      </div>
      <div className="header-right">
        <button className="settings-btn">
          <FaCog />
        </button>
        <div className="user-profile">
          <FaUser />
          <span className="user-name">Alexis</span>
        </div>
      </div>
    </header>
  )
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="app">
      <Header toggleSidebar={toggleSidebar} />
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/:id" element={<Payments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

// Add global styles
const styles = document.createElement('style')
styles.textContent = `
  body {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f8fafc;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .app-container {
    display: flex;
    flex: 1;
    position: relative;
  }

  .main-content {
    flex: 1;
    margin-left: 240px;
    margin-top: 60px;
    transition: margin-left 0.3s ease;
    min-height: calc(100vh - 60px);
    background-color: #f8fafc;
  }

  .sidebar.closed ~ .main-content {
    margin-left: 60px;
  }

  @media (max-width: 768px) {
    .main-content, .sidebar.closed ~ .main-content {
      margin-left: 0;
    }
  }

  /* Header styles */
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #2563eb;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    z-index: 50;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .logo {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    text-decoration: none;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .toggle-btn, .settings-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
  }
`
document.head.appendChild(styles)

export default App
