import { NavLink } from 'react-router-dom'
import { 
  FaHome, 
  FaUsers, 
  FaCalendarAlt, 
  FaTools, 
  FaMoneyBillWave, 
  FaChartBar, 
  FaCog,
  FaCalendarWeek
} from 'react-icons/fa'

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <FaHome /> },
    { path: '/clients', name: 'Clients', icon: <FaUsers /> },
    { path: '/bookings', name: 'Bookings', icon: <FaCalendarAlt /> },
    { path: '/inventory', name: 'Inventory', icon: <FaTools /> },
    { path: '/payments', name: 'Payments', icon: <FaMoneyBillWave /> },
    { path: '/reports', name: 'Reports', icon: <FaChartBar /> },
    { path: '/schedule', name: 'Schedule', icon: <FaCalendarWeek /> },
    { path: '/settings', name: 'Settings', icon: <FaCog /> },
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-item">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  isActive ? 'sidebar-link active' : 'sidebar-link'
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar

/* Sidebar Styles */
const styles = document.createElement('style')
styles.textContent = `
  /* Main layout structure */
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

  /* Sidebar styles */
  .sidebar {
    background-color: #1e293b;
    color: white;
    position: fixed;
    top: 60px; /* Account for header height */
    left: 0;
    bottom: 0;
    z-index: 40;
    transition: width 0.3s ease;
    overflow-x: hidden;
    overflow-y: auto;
  }
  
  .sidebar.open {
    width: 240px;
  }
  
  .sidebar.closed {
    width: 60px;
  }
  
  .sidebar-content {
    padding: 0;
    height: 100%;
  }
  
  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-item {
    margin: 0;
    width: 100%;
  }
  
  .sidebar-link {
    display: flex;
    align-items: center;
    padding: 14px 16px;
    color: #e2e8f0;
    text-decoration: none;
    transition: all 0.2s ease;
    width: 100%;
    border-left: 3px solid transparent;
  }
  
  .sidebar-link:hover {
    background-color: #334155;
  }
  
  .sidebar-link.active {
    background-color: #3b82f6;
    color: white;
    border-left: 3px solid #60a5fa;
  }
  
  .sidebar-icon {
    font-size: 1.25rem;
    min-width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .sidebar-text {
    margin-left: 12px;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.3s ease;
    font-size: 0.95rem;
  }
  
  .sidebar.closed .sidebar-text {
    opacity: 0;
    width: 0;
    display: none;
  }

  /* Search input in sidebar */
  .sidebar input[type="text"] {
    width: calc(100% - 32px);
    margin: 8px 16px;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #4b5563;
    background-color: #1f2937;
    color: white;
    font-size: 0.9rem;
  }

  .sidebar.closed input[type="text"] {
    display: none;
  }

  /* Main content area styles */
  .main-content {
    flex: 1;
    margin-left: 240px;
    margin-top: 60px; /* Account for header height */
    transition: margin-left 0.3s ease;
    min-height: calc(100vh - 60px);
    background-color: #f8fafc;
  }

  .sidebar.closed ~ .main-content {
    margin-left: 60px;
  }

  /* Apply to all page containers */
  .dashboard, .clients-page, .bookings-page, .inventory-page, 
  .payments-page, .reports-page, .schedule-page, .settings-page {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 40px;
  }

  /* Common page header styles */
  .page-header, .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .page-header h1, .dashboard-header h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  /* Button styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .btn-primary {
    background-color: #3b82f6;
    color: white;
    border: none;
  }

  .btn-primary:hover {
    background-color: #2563eb;
  }

  .btn-secondary {
    background-color: #f3f4f6;
    color: #1f2937;
    border: 1px solid #e5e7eb;
  }

  .btn-secondary:hover {
    background-color: #e5e7eb;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
    }

    .sidebar.open {
      transform: translateX(0);
      width: 240px;
    }

    .main-content, .sidebar.closed ~ .main-content {
      margin-left: 0;
    }

    .dashboard, .clients-page, .bookings-page, .inventory-page, 
    .payments-page, .reports-page, .schedule-page, .settings-page {
      padding: 16px;
      padding-bottom: 60px;
    }
  }
`
document.head.appendChild(styles) 