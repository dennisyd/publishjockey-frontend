import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Alert,
  Paper
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';

/**
 * Component to display fair use warning when a violation is detected
 */
const FairUseWarning = ({ 
  open, 
  onClose, 
  warningMessage, 
  similarityScore,
  onPurchaseClick 
}) => {
  const navigate = useNavigate();
  
  // Function to handle purchase additional book
  const handlePurchase = () => {
    if (onPurchaseClick) {
      onPurchaseClick();
    } else {
      // Default behavior - navigate to pricing page
      navigate('/pricing');
    }
    onClose();
  };
  
  // Function to continue anyway
  const handleContinue = () => {
    onClose();
  };
  
  // Format similarity score as percentage
  const formattedScore = similarityScore 
    ? `${Math.round(similarityScore * 100)}%` 
    : 'Unknown';
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: { borderTop: '6px solid #f44336' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="error" fontSize="large" />
        <Typography variant="h5" component="span" fontWeight="bold">
          Important Notice: Potential Fair Use Policy Violation
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Our system has detected significant changes to your book content while maintaining the same book project. 
          This pattern suggests creating a new book within an existing purchase, which violates our fair use policy.
        </Alert>
        
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9' }}>
          <Typography variant="h6" gutterBottom>
            Content Similarity Score: {formattedScore}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your current book content differs significantly from the original version that was exported.
            We detected only {formattedScore} similarity with your original book content.
          </Typography>
        </Paper>
        
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Details:
          </Typography>
          <ul>
            <li>
              <Typography>Each book purchase is intended for a single book project</Typography>
            </li>
            <li>
              <Typography>Substantial changes that transform it into a different book require a new purchase</Typography>
            </li>
            <li>
              <Typography>This is your first notification regarding this issue</Typography>
            </li>
          </ul>
        </Box>
        
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Consequences:
          </Typography>
          <Typography>
            If this pattern is detected again, your account will be temporarily suspended pending review.
          </Typography>
        </Box>
        
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Appeal Process:
          </Typography>
          <Typography>
            In case of suspension, you will need to submit an appeal explaining your usage. Reinstatement will depend on our team's review.
          </Typography>
        </Box>
        
        {warningMessage && (
          <Box mt={3} dangerouslySetInnerHTML={{ __html: warningMessage }} />
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button onClick={handleContinue} color="inherit" variant="outlined">
          Continue Anyway
        </Button>
        <Button onClick={handlePurchase} color="primary" variant="contained" autoFocus>
          Purchase Additional Book
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FairUseWarning; 