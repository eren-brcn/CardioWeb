import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Dashboard from './Pages/Dashboard.jsx';
import CategoriesPage from './Pages/CategoriesPage.jsx';
import CategoryDetail from './Pages/CategoryDetail.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <Router>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background:
            'radial-gradient(circle at 12% 8%, rgba(0, 194, 168, 0.16), transparent 42%), radial-gradient(circle at 90% 90%, rgba(255, 143, 63, 0.12), transparent 35%), #0a1218'
        }}
      >
        <Navbar />

        <Container component="main" maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 4 } }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categoryName" element={<CategoryDetail />} />
          </Routes>
        </Container>

        <Footer />
      </Box>
    </Router>
  );
}

export default App;