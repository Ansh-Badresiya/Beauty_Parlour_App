import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import BookAppointment from './pages/BookAppointment';
import Gallery from './pages/Gallery';
import Offers from './pages/Offers';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminOffers from './pages/admin/AdminOffers';
import AdminGallery from './pages/admin/AdminGallery';
import AdminAppointments from './pages/admin/AdminAppointments';

// Private Route Wrapper for Admin
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/admin" replace />;
}

// Layout for public pages
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/book" element={<PublicLayout><BookAppointment /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/offers" element={<PublicLayout><Offers /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/services" element={<PrivateRoute><AdminServices /></PrivateRoute>} />
        <Route path="/admin/offers" element={<PrivateRoute><AdminOffers /></PrivateRoute>} />
        <Route path="/admin/gallery" element={<PrivateRoute><AdminGallery /></PrivateRoute>} />
        <Route path="/admin/appointments" element={<PrivateRoute><AdminAppointments /></PrivateRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
