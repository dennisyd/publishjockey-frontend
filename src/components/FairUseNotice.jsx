import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Tooltip
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import InfoIcon from '@mui/icons-material/Info';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DownloadIcon from '@mui/icons-material/Download';

/**
 * Fair Use notice component to inform users about content monitoring
 */
const FairUseNotice = ({ compact = false }) => {
  // Compact version for use in dashboard headers or smaller spaces
  if (compact) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: '#EDF7ED',
        px: 2, 
        py: 1, 
        borderRadius: 1,
        width: '100%'
      }}>
        <SecurityIcon sx={{ color: '#1B5E20', mr: 1 }} />
        <Typography variant="body2" color="#1B5E20" fontWeight="medium">
          Fair use <strong>AI</strong> protection active - Your current plan supports the creation of one book. 
        </Typography>
        <Tooltip title="Our system monitors each book for compliance with our fair use policy. Substantial changes that transform a project into a different book require a new purchase.">
          <InfoIcon sx={{ ml: 1, color: '#1B5E20', fontSize: '1rem', cursor: 'help' }} />
        </Tooltip>
      </Box>
    );
  }
  
  // Full version with more details
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2,
        border: '1px solid #E8F5E9',
        bgcolor: '#F1F8E9',
        borderRadius: 2,
        position: 'relative',
        mb: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <VerifiedUserIcon 
          sx={{ 
            color: '#388E3C', 
            fontSize: '2.5rem',
            mt: 0.5
          }} 
        />
        <Box>
          <Typography variant="h6" color="#2E7D32" gutterBottom>
            Fair Use Protection Active
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Our AI-powered system monitors book content to ensure compliance with our fair use policy. 
            Each license purchase entitles you to create and publish a single book. 
          </Typography>
          <Typography variant="body2" sx={{ color: '#388E3C', fontWeight: 500 }}>
            Making substantial changes to transform a project into a completely different book will require an additional purchase.
          </Typography>
          
          {/* Add information about manual downloads */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DownloadIcon sx={{ color: '#388E3C' }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> For security reasons, files must be manually downloaded by clicking the download button after export.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default FairUseNotice; 