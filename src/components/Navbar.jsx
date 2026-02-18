// Import Link component for navigation
import { Link } from 'react-router-dom';

// Navigation bar component
function Navbar() {
  return (
    <nav style={{ padding: '20px', background: '#111', display: 'flex', gap: '20px', borderBottom: '1px solid #333' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
      <Link to="/categories" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Categories</Link>
    </nav>
  );
}

export default Navbar;