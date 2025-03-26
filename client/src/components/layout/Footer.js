import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-copyright">
          &copy; {currentYear} Teacher-Focused LMS. All rights reserved.
        </div>
        <ul className="footer-links">
          <li>
            <Link to="/" className="footer-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="footer-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="footer-link">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms" className="footer-link">
              Terms of Service
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
