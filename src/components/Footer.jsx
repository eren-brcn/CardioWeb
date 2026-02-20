import React from 'react';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} <span className="neon-text">CardioWeb</span> — Built for Strength</p>
        <div className="footer-links">
          <span>Privacy</span>
          <span>Support</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;