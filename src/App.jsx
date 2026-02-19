import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Pages/Dashboard.jsx';
import CategoriesPage from './Pages/CategoriesPage.jsx';
import CategoryDetail from './Pages/CategoryDetail.jsx';
import Navbar from './components/Navbar.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav style={navStyle}>
          <Link to="/" style={linkStyle}>Dashboard</Link>
          <Link to="/categories" style={linkStyle}>Training Guides</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:categoryName" element={<CategoryDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

const navStyle = {
  display: 'flex',
  gap: '20px',
  padding: '20px',
  background: '#1a1a1a',
  borderBottom: '1px solid #333',
  marginBottom: '20px'
};

const linkStyle = {
  color: '#4CAF50',
  textDecoration: 'none',
  fontWeight: 'bold'
};

export default App;