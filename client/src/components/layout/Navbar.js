import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          Teacher LMS
        </Link>

        <button className="navbar-toggler" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </button>

        <ul className={`navbar-nav ${showMenu ? 'show' : ''}`}>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>

              {(user?.role === 'teacher' || user?.role === 'admin') && (
                <>
                  <li className="nav-item">
                    <Link to="/templates" className="nav-link">
                      Templates
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/exercises" className="nav-link">
                      Exercises
                    </Link>
                  </li>
                </>
              )}

              {user?.role === 'student' && (
                <li className="nav-item">
                  <Link to="/exercises" className="nav-link">
                    Exercises
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <Link to="/submissions" className="nav-link">
                  Submissions
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </li>

              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
