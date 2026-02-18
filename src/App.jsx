// Import React Router components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard.jsx';
import CategoriesPage from './Pages/CategoriesPage.jsx'; 
import Navbar from './components/Navbar.jsx';

// Main App component with routing
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </Router>
  );
}

export default App;