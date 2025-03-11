import { Link } from 'react-router-dom'
import { FaBars, FaUserCircle, FaCog } from 'react-icons/fa'

const Navbar = ({ setSidebarOpen }) => {
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <Link to="/" className="navbar-brand">
            <h1>Alexis Construction Services</h1>
          </Link>
        </div>
        <div className="navbar-right">
          <Link to="/settings" className="navbar-icon">
            <FaCog />
          </Link>
          <div className="navbar-user">
            <FaUserCircle />
            <span>Alexis</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

/* Navbar Styles */
const styles = document.createElement('style')
styles.textContent = `
  .navbar {
    background-color: #1e40af;
    color: white;
    height: 60px;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 20px;
  }
  
  .navbar-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .sidebar-toggle {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
  }
  
  .navbar-brand {
    text-decoration: none;
    color: white;
  }
  
  .navbar-brand h1 {
    font-size: 1.2rem;
    margin: 0;
  }
  
  .navbar-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .navbar-icon {
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
  }
  
  .navbar-user {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }
`
document.head.appendChild(styles) 