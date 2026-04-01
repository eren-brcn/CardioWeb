import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { hasAuthSession } from './services/authStorage';

const Dashboard = lazy(() => import('./Pages/Dashboard.jsx'));
const CategoriesPage = lazy(() => import('./Pages/CategoriesPage.jsx'));
const CategoryDetail = lazy(() => import('./Pages/CategoryDetail.jsx'));
const LoginPage = lazy(() => import('./Pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./Pages/SignupPage.jsx'));
const ProfilePage = lazy(() => import('./Pages/ProfilePage.jsx'));
const SettingsPage = lazy(() => import('./Pages/SettingsPage.jsx'));
const PrivacyPage = lazy(() => import('./Pages/PrivacyPage.jsx'));
const SupportPage = lazy(() => import('./Pages/SupportPage.jsx'));
const TermsPage = lazy(() => import('./Pages/TermsPage.jsx'));
const NotFoundPage = lazy(() => import('./Pages/NotFoundPage.jsx'));

function PublicOnlyRoute({ children }) {
  return hasAuthSession() ? <Navigate to="/" replace /> : children;
}

function App() {
  const { t } = useTranslation();

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
          <Suspense fallback={<Box sx={{ py: 6, textAlign: 'center' }}>{t('app.loading')}</Box>}>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
              <Route path="/categories/:categoryName" element={<ProtectedRoute><CategoryDetail /></ProtectedRoute>} />
              <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
              <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Container>

        <Footer />
      </Box>
    </Router>
  );
}

export default App;