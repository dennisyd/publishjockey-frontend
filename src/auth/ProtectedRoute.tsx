import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider } from '@mui/material';
import './sidebar.css';

// Type for navigation items
interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface ProtectedRouteProps {
  element: React.ReactElement;
  navItems: NavItem[];
}

export function ProtectedRoute({ element, navItems }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  console.log("ProtectedRoute - Auth State:", { 
    currentUser: !!currentUser, 
    loading, 
    location: location.pathname 
  });

  // Only render content if authenticated
  const shouldRenderContent = !!currentUser;

  // Check if the current path matches the nav item path
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  if (loading) {
    console.log("ProtectedRoute - Loading");
    return (
      <Box 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!shouldRenderContent) {
    console.log("ProtectedRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute - Rendering with sidebar");
  
  return (
    <div className="sidebar-container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar */}
      <div data-sidebar className="sidebar" style={{
        display: 'flex',
        visibility: 'visible',
        width: '240px',
        position: 'relative',
        height: '100%',
        overflow: 'auto',
        zIndex: 1200,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        {/* Logo */}
        <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={require('../assets/publishjockey_logo.png')} 
              alt="Publish Jockey Logo" 
              style={{ width: '58px', height: '58px', objectFit: 'contain' }} 
            />
          </div>
        </div>
        
        {/* Navigation Items */}
        <div>
          {navItems.map((item) => (
            <a 
              key={item.path}
              href={item.path} 
              className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={(e) => {
                if (item.label === 'Instructions') {
                  e.preventDefault();
                  setInstructionsOpen(true);
                } else {
                  e.preventDefault();
                  navigate(item.path);
                }
              }}
            >
              {item.icon}
              <span style={{ marginLeft: '10px' }}>{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ paddingBottom: '0' }}>
        {element}
      </div>

      {/* Global Instructions Modal */}
      <Dialog open={instructionsOpen} onClose={() => setInstructionsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Instructions</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Title Page</Typography>
          <Typography variant="body2" paragraph>
            • Click the <b>Title Page</b> in the section list to enter your book's title, subtitle, and author.<br />
            • By default, the title page is auto-generated from your metadata.<br />
            • Enable <b>User Custom Title Page</b> if you want to design your own title page (advanced users only).<br />
            • <b>Title</b> and <b>Author</b> are required for export.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Importing Content</Typography>
          <Typography variant="body2" paragraph>
            • Use the <b>Import Content</b> button to upload .docx, .md, or .txt files, or import from Google Docs.<br />
            • Imported content will be placed in the selected section.<br />
            • Only supported file types are accepted. File size limit: 10 MB.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Exporting</Typography>
          <Typography variant="body2" paragraph>
            • Use the <b>Export Book</b> button to export your project as PDF, EPUB, DOCX, or HTML.<br />
            • Ensure your title and author are set before exporting.<br />
            • Customize export settings as needed for your publishing requirements.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInstructionsOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 