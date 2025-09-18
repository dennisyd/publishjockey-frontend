import React, { useEffect } from 'react'; // Yancy Dennis
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TrackingService from './services/TrackingService';
import GoogleAnalyticsService from './services/GoogleAnalyticsService';
import {
  CssBaseline, ThemeProvider, createTheme, Box
} from '@mui/material';
import './i18n'; // Initialize i18n

// Import pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import PublishJockeyLanding from './PublishJockeyLanding';
import AdminDashboard from './pages/admin/AdminDashboard';
import SubmitTestimonial from './pages/SubmitTestimonial';
import ContactPage from './pages/ContactPage';
import SplitDoctor from './pages/SplitDoctor';
import ImageMagic from './pages/ImageMagic';
import About from './About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import HelpCenter from './pages/HelpCenter';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Pricing from './pages/Pricing';
import AccountSettings from './pages/AccountSettings';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import TestimonialsPage from './pages/TestimonialsPage';
import PaymentSuccess from './pages/PaymentSuccess';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AffiliateAgreement from './pages/AffiliateAgreement';
import AffiliateSignup from './pages/AffiliateSignup';
import AdminAffiliateDashboard from './pages/AdminAffiliateDashboard';

// Import auth components
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import VerifyEmail from './auth/VerifyEmail';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { PrivateRoute } from './auth/PrivateRoute';

// Import project workspace components
import { useParams } from 'react-router-dom';
import ProjectWorkspace from './components/ProjectWorkspace'; // You'll need to move the ProjectWorkspace component to its own file

// Import navigation and footer components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Import export timing manager
import ExportTimingManager from './components/ExportTimingManager';
import GoogleAnalyticsTracker from './components/GoogleAnalyticsTracker';

// Import icons for navigation
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import ImageIcon from '@mui/icons-material/Image';

// Clean, neutral MUI theme
const theme = createTheme({
  palette: {
    background: {
      default: '#f5f6fa',
      paper: '#fff',
    },
    primary: {
      main: '#2d3748', // dark neutral
    },
    secondary: {
      main: '#4fd1c5', // accent teal
    },
    text: {
      primary: '#222',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
});

function ProjectWorkspaceWrapper() {
  const { projectId } = useParams();
  return <ProjectWorkspace projectId={projectId || ''} />;
}

function App() {
  // Initialize tracking and handle referral clicks
  useEffect(() => {
    // Initialize tracking services
    TrackingService.initialize();
    GoogleAnalyticsService.initialize();
    
    // Check for referral parameters in URL
    const referralData = TrackingService.getReferralFromURL();
    if (referralData.code) {
      TrackingService.trackReferralClick(referralData.code, referralData.source || 'direct');
    }
    
    // Fix aria-hidden accessibility issue with Material-UI modals
    const handleAriaHiddenFix = () => {
      const rootElement = document.getElementById('root');
      if (rootElement && rootElement.getAttribute('aria-hidden') === 'true') {
        // Remove aria-hidden if no modal is actually open
        const openModals = document.querySelectorAll('.MuiModal-root[style*="display: block"], .MuiDialog-root[style*="display: block"]');
        if (openModals.length === 0) {
          rootElement.removeAttribute('aria-hidden');
        }
      }
    };
    
    // Check periodically to fix any aria-hidden issues
    const intervalId = setInterval(handleAriaHiddenFix, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Define navigation items
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'SplitDoctor', path: '/split-doctor', icon: <SplitscreenIcon /> },
    { label: 'ImageMagic', path: '/image-magic', icon: <ImageIcon /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    { label: 'Instructions', path: '/instructions', icon: <HelpOutlineIcon /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ExportTimingManager>
        <Router>
          <GoogleAnalyticsTracker />
          <AuthProvider>
            <SettingsProvider>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh' 
              }}>
                <Navigation />
                <Box sx={{ flexGrow: 1 }}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/submit-testimonial" element={<SubmitTestimonial />} />
                    <Route path="/admin" element={<ProtectedRoute requiredRole="admin" element={<AdminDashboard />} navItems={navItems} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:postId" element={<BlogPost />} />
                    <Route path="/" element={<PublishJockeyLanding />} />
                    <Route path="/help-center" element={<HelpCenter />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/testimonials" element={<TestimonialsPage />} />
                    <Route path="/affiliate-agreement" element={<AffiliateAgreement />} />
                    <Route path="/affiliate-signup" element={<AffiliateSignup />} />
                    <Route path="/payment-success" element={<ProtectedRoute element={<PaymentSuccess />} navItems={navItems} />} />
                    
                    {/* Protected routes with sidebar layout */}
                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} navItems={navItems} />} />
                    <Route path="/projects" element={<ProtectedRoute element={<Projects />} navItems={navItems} />} />
                    <Route path="/settings" element={<ProtectedRoute element={<Settings />} navItems={navItems} />} />
                    <Route path="/project/:projectId" element={<ProtectedRoute element={<ProjectWorkspaceWrapper />} navItems={navItems} />} />
                    <Route path="/projects/:projectId" element={<ProtectedRoute element={<ProjectWorkspaceWrapper />} navItems={navItems} />} />
                    <Route path="/account" element={<ProtectedRoute element={<AccountSettings />} navItems={navItems} />} />
                    <Route path="/users/:userId/account" element={<ProtectedRoute element={<AccountSettings />} navItems={navItems} />} />
                    <Route path="/split-doctor" element={<ProtectedRoute element={<SplitDoctor />} navItems={navItems} />} />
                    <Route path="/image-magic" element={<ProtectedRoute element={<ImageMagic />} navItems={navItems} />} />
                    <Route path="/affiliate" element={<ProtectedRoute element={<AffiliateDashboard />} navItems={navItems} />} />
                    <Route path="/admin/affiliates" element={<ProtectedRoute requiredRole="admin" element={<AdminAffiliateDashboard />} navItems={navItems} />} />
                  </Routes>
                </Box>
                {/* Global Footer */}
                <Footer />
              </Box>
            </SettingsProvider>
          </AuthProvider>
        </Router>
      </ExportTimingManager>
    </ThemeProvider>
  );
}

export default App; 