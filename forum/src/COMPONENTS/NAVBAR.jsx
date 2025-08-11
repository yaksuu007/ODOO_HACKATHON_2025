import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/Auth"); // Redirect to Auth after logout
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="text-xl font-bold cursor-pointer">
          <Link to="/" className="text-white">
            MyApp
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/MyBookings" className="text-white hover:text-gray-300">
              My Bookings
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/Profile" className="text-white hover:text-gray-300">
                  Edit Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/OwnerDashboard"
                  className="text-white hover:text-gray-300"
                >
                  My Facilities
                </Link>
              </li>
              <li>
                <Link to="/Matches" className="text-white hover:text-gray-300">
                  Matches
                </Link>
              </li>
              <li>
                <Link to="/Community" className="text-white hover:text-gray-300">
                  Community
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300 focus:outline-none"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/Auth" className="text-white hover:text-gray-300">
                Login/Register
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 fill-current text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                fillRule="evenodd"
                d="M18.364 5.636a1 1 0 010 1.414L13.414 12l4.95 4.95a1 1 0 01-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 01-1.414-1.414L10.586 12 5.636 7.05a1 1 0 011.414-1.414L12 10.586l4.95-4.95a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            ) : (
              <path fillRule="evenodd" d="M4 5h16M4 12h16M4 19h16" clipRule="evenodd" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-blue-600 px-6 py-4 space-y-3">
          <li>
            <Link
              to="/"
              className="block text-white hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/MyBookings"
              className="block text-white hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              My Bookings
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link
                  to="/Profile"
                  className="block text-white hover:text-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  Edit Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/OwnerDashboard"
                  className="block text-white hover:text-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  My Facilities
                </Link>
              </li>
              <li>
                <Link
                  to="/Matches"
                  className="block text-white hover:text-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  Matches
                </Link>
              </li>
              <li>
                <Link
                  to="/Community"
                  className="block text-white hover:text-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  Community
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-white hover:text-gray-300 focus:outline-none"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/Auth"
                className="block text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Login/Register
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
