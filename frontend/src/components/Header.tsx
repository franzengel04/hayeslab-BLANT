// src/components/Header.tsx
import React from 'react';

import { Link } from 'react-router-dom';
import './Header.css'; // Assuming your header's styling is in App.css
import SanaLogo from '../assets/sana-logo-white.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        {/* Container for logo and text to keep them together */}
        <Link to="/" className="site-logo-container">
          {/* Add the SANA logo image here */}
          <img
            src={SanaLogo}
            alt="SANA Logo"
            className="sana-logo"
          />
          <span className="site-logo-text">Hayes Lab</span>
        </Link>
      </div>
      <nav className="header-nav">
        <Link to="/submit-job" className="nav-link">Submit New Job</Link>
        <Link to="/lookup-job" className="nav-link">Lookup Previous Job</Link>
        <a href="/contact-us" className="nav-link">Contact Us</a>
        {/* <a href="/login" className="nav-link">Login/Register</a> */}
      </nav>
    </header>
  );
};

export default Header;