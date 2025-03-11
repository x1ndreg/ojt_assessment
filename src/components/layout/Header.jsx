import { FaBars, FaCog, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

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
  );
};

export default Header;

/* Header Styles */
const styles = document.createElement("style");
styles.textContent = `
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
    transition: background-color 0.2s ease;
  }

  .user-profile:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .user-name {
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .logo {
      font-size: 1rem;
    }

    .user-name {
      display: none;
    }
  }
`;
document.head.appendChild(styles);
