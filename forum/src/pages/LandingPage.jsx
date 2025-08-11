import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Beams from '../COMPONENTS/Beams';
import './styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/venues');
    } else {
      navigate('/auth');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  // Sports images data (images placed in /public/images/)
  const sportsImages = [
    { id: 1, name: 'Tennis', image: '/images/tennis.jpg', description: 'Professional tennis courts with premium surfaces' },
    { id: 2, name: 'Basketball', image: '/images/basketball.jpg', description: 'Indoor and outdoor basketball facilities' },
    { id: 3, name: 'Badminton', image: '/images/badminton.jpg', description: 'Olympic-standard badminton courts' },
    { id: 4, name: 'Soccer', image: '/images/soccer.jpg', description: 'Full-size soccer fields and training grounds' },
    { id: 5, name: 'Cricket', image: '/images/cricket.jpg', description: 'Professional cricket grounds and nets' },
    { id: 6, name: 'Swimming', image: '/images/swimming.jpg', description: 'Olympic-size swimming pools and training facilities' },
  ];

  // Features data
  const features = [
    {
      icon: "🏟️",
      title: "Premium Venues",
      description: "Access to the highest quality sports facilities in your area"
    },
    {
      icon: "⚡",
      title: "Instant Booking",
      description: "Book courts and facilities in seconds with our streamlined process"
    },
    {
      icon: "📱",
      title: "Mobile App",
      description: "Book on the go with our mobile-optimized platform"
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive rates and special deals on premium venues"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tennis Player",
      rating: 5,
      content: "Quick Court made booking tennis courts so easy! I love the variety of venues available."
    },
    {
      name: "Mike Davis",
      role: "Basketball Coach",
      rating: 5,
      content: "As a coach, I need reliable booking systems. Quick Court delivers every time."
    },
    {
      name: "Emma Wilson",
      role: "Badminton Enthusiast",
      rating: 5,
      content: "The quality of courts and ease of booking has improved my game significantly."
    }
  ];

  return (
    <div className="landing-page dark-theme">
      {/* Hero Section with 3D Beams Background */}
      <section className="hero-section">
        {/* 3D Beams Background */}
        <div className="beams-background">
          <Beams 
            beamWidth={3}
            beamHeight={20}
            beamNumber={15}
            lightColor="#60a5fa"
            speed={1.5}
            noiseIntensity={2}
            scale={0.15}
            rotation={15}
          />
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Book Your Perfect
              <span className="highlight"> Sports Venue</span>
            </h1>
            <p className="hero-subtitle">
              Discover and book premium sports facilities, courts, and venues in your area. 
              From tennis to basketball, soccer to swimming - find your perfect match.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary btn-large" onClick={handleGetStarted}>
                {isLoggedIn ? 'Browse Venues' : 'Start Booking Now'}
              </button>
              <button className="btn-outline btn-large">
                View Venues
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Venues</span>
              </div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Bookings</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://source.unsplash.com/random/600x500/?sports-venue" alt="Sports Venue" />
          </div>
        </div>
      </section>

      {/* Sports Venues Showcase */}
      <section className="sports-showcase">
        <div className="container">
          <div className="section-header">
            <h2>Explore Sports Venues</h2>
            <p>From individual courts to multi-sport complexes, find the perfect venue for your game</p>
          </div>
          <div className="sports-grid">
            {sportsImages.map((sport) => (
              <div key={sport.id} className="sport-card">
                <div className="sport-image">
                  <img
                    src={sport.image}
                    alt={sport.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://source.unsplash.com/1200x800/?${sport.name.toLowerCase()}`;
                    }}
                  />
                  <div className="sport-overlay">
                    <h3>{sport.name}</h3>
                    <p>{sport.description}</p>
                    <button className="btn-primary">Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose CORTLY?</h2>
            <p>Experience the difference with our comprehensive sports venue booking platform</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in just three simple steps</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search Venues</h3>
              <p>Browse through our extensive collection of sports venues in your area</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Choose Your Time</h3>
              <p>Select your preferred date and time slot from available options</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book & Play</h3>
              <p>Confirm your booking and enjoy your game at the selected venue</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Join thousands of satisfied sports enthusiasts</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src={`https://source.unsplash.com/random/100x100/?portrait&${index}`} alt={testimonial.name} />
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Sports Journey?</h2>
            <p>Join thousands of athletes and sports enthusiasts who trust CORTLY for their venue bookings</p>
            <div className="cta-buttons">
              <button className="btn-primary btn-large" onClick={handleGetStarted}>
                {isLoggedIn ? 'Browse Venues' : 'Get Started Today'}
              </button>
              <button className="btn-outline btn-large">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-icon">🏟️</span>
                <span>CORTLY</span>
              </div>
              <p>Your premier destination for sports venue bookings. Connect with quality facilities and elevate your game.</p>
              <div className="social-links">
                <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Venues</a></li>
                <li><a href="#">Sports</a></li>
                <li><a href="#">About Us</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Sports</h3>
              <ul>
                <li><a href="#">Tennis</a></li>
                <li><a href="#">Basketball</a></li>
                <li><a href="#">Badminton</a></li>
                <li><a href="#">Soccer</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Info</h3>
              <div className="contact-info">
                 <p><i className="fas fa-envelope"></i> info@cortly.com</p>
                <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
                <p><i className="fas fa-map-marker-alt"></i> 123 Sports Ave, City</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 CORTLY. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;