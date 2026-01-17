// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiDroplet, 
  FiMapPin, 
  FiDollarSign, 
  FiBell, 
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight 
} from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  

  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
    { id: 2, name: 'User Management (KYC)', icon: <FiUsers />, path: '/user-management' },
    { id: 3, name: 'Fuel Configuration', icon: <FiDroplet />, path: '/fuel-configuration' },
    { id: 4, name: 'Station Management', icon: <FiMapPin />, path: '/station-management' },
    { id: 5, name: 'Transaction Management', icon: <FiDollarSign />, path: '/transaction-management' },
    { id: 6, name: 'Notification & News', icon: <FiBell />, path: '/notification-news' },
  ];

  const handleSignOut = () => {
    console.log('Signing out...');
    // Add your sign out logic here
    // For example: Clear tokens, redirect to login
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  

  const handleItemClick = () => {
    // Close sidebar on mobile when clicking a menu item
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        className="sidebar-mobile-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container - Increased width to 280px */}
      <div className={`sidebar-container ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <NavLink 
            to="/dashboard" 
            className="sidebar-logo" 
            onClick={handleItemClick}
          >
            <FiDroplet className="logo-icon" />
            {!isCollapsed && <span className="logo-text">FUELNOMIC</span>}
          </NavLink>
          {/* <button 
            className="sidebar-collapse-btn"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button> */}
        </div>

        {/* Menu Items - Using NavLink for navigation */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-menu-item ${isActive ? 'active' : ''}`
              }
              onClick={handleItemClick}
              end
            >
              <span className="menu-item-icon">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="menu-item-text">{item.name}</span>
                  <span className="active-indicator"></span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out Button */}
        <div className="sidebar-footer">
          <button 
            className="signout-btn"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <span className="signout-icon"><FiLogOut /></span>
            {!isCollapsed && <span className="signout-text">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;