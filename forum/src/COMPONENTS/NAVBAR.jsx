import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./NAVBAR.css";

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in on component mount and when user prop changes
  useEffect(() => {
    const checkAuthStatus = () => {
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        // Check localStorage or session for user data
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            setCurrentUser(user);
            setIsLoggedIn(true);
          } catch (error) {
            console.error('Error parsing user data:', error);
            setCurrentUser(null);
            setIsLoggedIn(false);
          }
        } else {
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      }
    };

    checkAuthStatus();
  }, [user]);

  const handleProfileClick = () => {
    navigate('/Profile');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setCurrentUser(null);
    setIsLoggedIn(false);
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/" className="logo-link">
              <img src="/images/logo-cortly.png" alt="CORTLY" style={{ width: 28, height: 28, borderRadius: '50%' }} />
              <span className="logo-text">CORTLY</span>
            </Link>
          </div>
          
          <div className="nav-menu">
            <Link 
              to="/" 
              className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
              onClick={handleNavLinkClick}
            >
              Home
            </Link>
            <Link 
              to="/VenueListing" 
              className={`nav-link ${isActiveRoute('/VenueListing') ? 'active' : ''}`}
              onClick={handleNavLinkClick}
            >
              Venues
            </Link>
            <Link 
              to="/Facilities" 
              className={`nav-link ${isActiveRoute('/Facilities') ? 'active' : ''}`}
              onClick={handleNavLinkClick}
            >
              Facilities
            </Link>
            <Link 
              to="/Matches" 
              className={`nav-link ${isActiveRoute('/Matches') ? 'active' : ''}`}
              onClick={handleNavLinkClick}
            >
              Matches
            </Link>
            {isLoggedIn && (
              <>
                <Link 
                  to="/MyBookings" 
                  className={`nav-link ${isActiveRoute('/MyBookings') ? 'active' : ''}`}
                  onClick={handleNavLinkClick}
                >
                  My Bookings
                </Link>
                <Link 
                  to="/OwnerDashboard" 
                  className={`nav-link ${isActiveRoute('/OwnerDashboard') ? 'active' : ''}`}
                  onClick={handleNavLinkClick}
                >
                  My Facilities
                </Link>
              </>
            )}
          </div>

          <div className="nav-actions">
            {isLoggedIn ? (
              <div className="user-profile">
                <div className="profile-dropdown">
                  <button className="profile-button" onClick={handleProfileClick}>
                    <div className="profile-avatar">
                      {currentUser?.profile_image ? (
                        <img src={currentUser.profile_image} alt={currentUser.fullname} />
                      ) : (
                        <span className="avatar-initial">
                          {currentUser?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <span className="profile-name">{currentUser?.fullname || 'User'}</span>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/Profile" className="dropdown-item" onClick={handleNavLinkClick}>
                      <i className="fas fa-user"></i> Profile
                    </Link>
                    <Link to="/MyBookings" className="dropdown-item" onClick={handleNavLinkClick}>
                      <i className="fas fa-calendar"></i> My Bookings
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/Auth" className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/Auth" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="hamburger" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
      <div className={`mobile-sidebar ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-sidebar-header">
          <div className="nav-logo">
            <Link to="/" className="logo-link" onClick={closeMobileMenu}>
              <img src="/images/logo-cortly.png" alt="CORTLY" style={{ width: 24, height: 24, borderRadius: '50%' }} />
              <span className="logo-text">CORTLY</span>
            </Link>
          </div>
          <button className="mobile-sidebar-close" onClick={closeMobileMenu}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="mobile-nav-menu">
          <Link 
            to="/" 
            className={`mobile-nav-link ${isActiveRoute('/') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <i className="fas fa-home"></i>
            Home
          </Link>
          <Link 
            to="/VenueListing" 
            className={`mobile-nav-link ${isActiveRoute('/VenueListing') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <i className="fas fa-map-marker-alt"></i>
            Venues
          </Link>
          <Link 
            to="/Facilities" 
            className={`mobile-nav-link ${isActiveRoute('/Facilities') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <i className="fas fa-building"></i>
            Facilities
          </Link>
          <Link 
            to="/Matches" 
            className={`mobile-nav-link ${isActiveRoute('/Matches') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <i className="fas fa-futbol"></i>
            Matches
          </Link>
          {isLoggedIn && (
            <>
              <Link 
                to="/MyBookings" 
                className={`mobile-nav-link ${isActiveRoute('/MyBookings') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-calendar"></i>
                My Bookings
              </Link>
              <Link 
                to="/OwnerDashboard" 
                className={`mobile-nav-link ${isActiveRoute('/OwnerDashboard') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-building"></i>
                My Facilities
              </Link>
            </>
          )}
        </div>

        <div className="mobile-nav-menu">
          {isLoggedIn ? (
            <>
              <Link to="/Profile" className="mobile-nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-user"></i>
                Profile
              </Link>
              <button onClick={handleLogout} className="mobile-nav-link">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/Auth" className="mobile-nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </Link>
              <Link to="/Auth" className="mobile-nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-user-plus"></i>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
