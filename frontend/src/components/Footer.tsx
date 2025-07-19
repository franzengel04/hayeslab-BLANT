import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-branding">
            <h3>Hayes Lab</h3>
            <p style={{ marginBottom: '0px' }}>University of California, Irvine</p>
          </div>
          <div className="footer-sections">
            <div className="footer-contact">
              <h4>Contact</h4>
              <p><a href="mailto:whayes@uci.edu" style={{ color: '#9ca3af', textDecoration: 'none' }}>whayes@uci.edu</a></p>
            </div>
            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="https://twitter.com/hayeslab" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
                <a href="https://github.com/hayeslab" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} Hayes Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 