import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';
import { AuthProvider } from './services/AuthContext';
import { CustomerRoute } from './components/ProtectedRoute';

// Public website
import WebsitePage, { ProductsPage, ServicesPage, ContactPage, WrappedGalleryPage, WrappedSparesPage } from './pages/WebsitePages';

// Auth
import LoginPage from './pages/LoginPage';
import { ForgotPasswordPage, ResetPasswordPage, RegisterPage } from './pages/AuthPages';

// Customer account portal
import CustomerPortal from './pages/CustomerPortal';

// Scrolls to the top of the page on every route change (React Router does not
// do this automatically), so clicking "View All Products" etc. always lands
// the visitor at the top of the destination page instead of wherever the
// previous page happened to be scrolled to.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public website */}
          <Route path="/"         element={<WebsitePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery"  element={<WrappedGalleryPage />} />
          <Route path="/spares"   element={<WrappedSparesPage />} />
          <Route path="/contact"  element={<ContactPage />} />

          {/* Customer auth */}
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />
          <Route path="/register"        element={<RegisterPage />} />

          {/* Customer account area */}
          <Route path="/account" element={<CustomerRoute><CustomerPortal /></CustomerRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
