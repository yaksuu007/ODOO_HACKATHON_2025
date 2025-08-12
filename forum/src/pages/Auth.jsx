import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Auth.css";

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    contact_number: "",
    designation: "player",
    profile_image: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirect') || '/';
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      setFormData({ ...formData, profile_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin
      ? "http://localhost:5001/api/login"
      : "http://localhost:5001/api/register";

    try {
      let response;
      if (!isLogin && formData.profile_image) {
        const formPayload = new FormData();
        formPayload.append("fullname", formData.fullname);
        formPayload.append("email", formData.email);
        formPayload.append("password", formData.password);
        formPayload.append("contact_number", formData.contact_number);
        formPayload.append("designation", formData.designation);
        formPayload.append("profile_image", formData.profile_image);

        response = await fetch(endpoint, {
          method: "POST",
          credentials: "include",
          body: formPayload,
        });
      } else {
        // For login or register without image
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      // Store user data in localStorage and update parent state
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }

      // On success, navigate to original destination (e.g., back to venue to book)
      navigate(redirectTo);
    } catch (err) {
      setError("Failed to connect to server");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="auth-logo-icon">🏟️</span>
            <span className="auth-logo-text">Quick Court</span>
          </div>
          <h1 className="auth-title">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="auth-subtitle">
            {isLogin 
              ? "Sign in to access your sports venue bookings"
              : "Join us to start booking sports venues"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  onChange={handleChange}
                  value={formData.fullname}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="contact_number"
                  onChange={handleChange}
                  value={formData.contact_number}
                  className="form-input"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Profile Image</label>
                <input
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">I am a</label>
                <div className="auth-options">
                  <label className={`auth-option ${formData.designation === 'player' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="designation"
                      value="player"
                      checked={formData.designation === "player"}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <span className="auth-option-icon">🏃</span>
                    <span className="auth-option-text">Player</span>
                  </label>

                  <label className={`auth-option ${formData.designation === 'facilities' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="designation"
                      value="facilities"
                      checked={formData.designation === "facilities"}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <span className="auth-option-icon">🏢</span>
                    <span className="auth-option-text">Facility Owner</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <a onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Sign In"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
