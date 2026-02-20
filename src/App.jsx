import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Pages/Dashboard.jsx';
import CategoriesPage from './Pages/CategoriesPage.jsx';
import CategoryDetail from './Pages/CategoryDetail.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/categories" className="nav-link">Training Guides</Link>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categoryName" element={<CategoryDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;