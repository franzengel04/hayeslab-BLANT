import React from 'react';

import { Link } from 'react-router-dom';
import './Header.css';
import SanaLogo from '../../../public/sana-logo-white.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="https://hayeslab.ics.uci.edu/" className="site-logo-container">
          <img
            src={SanaLogo}
            alt="SANA Logo"
            className="sana-logo"
          />
          <span className="site-logo-text">Hayes Lab</span>
        </Link>
      </div>
      <nav className="header-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About BLANT</Link>
        <Link to="/submit-job" className="nav-link">Submit New Job</Link>
        <Link to="/lookup-job" className="nav-link">Lookup Previous Job</Link>
        <a href="/contact-us" className="nav-link">Contact Us</a>
        {/* <a href="/login" className="nav-link">Login/Register</a> */}
      </nav>
    </header>
  );
};

export default Header;