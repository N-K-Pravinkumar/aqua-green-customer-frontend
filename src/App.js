import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
