import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { FaBlog, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaBlog /> BlogHub
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/create" className="nav-link">Create Post</Link>
            </>
          )}
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <span className="nav-user">
                <FaUser /> {currentUser?.username}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                 Login
              </Link>
              <Link to="/register" className="btn-register">
                 Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;