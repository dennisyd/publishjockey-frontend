import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress
} from '@mui/material';
import { realImageService } from '../services/realImageService';

interface ImageSlotPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isFirstPurchase?: boolean;
}

const ImageSlotPurchaseModal: React.FC<ImageSlotPurchaseModalProps> = ({
  open,
  onClose,
  onSuccess,
  isFirstPurchase = true
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(isFirstPurchase ? '100' : '100');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseOptions = isFirstPurchase
    ? [
        { quantity: 100, price: 25, label: '100 images for $25', description: 'First-time purchase special' }
      ]
    : [
        { quantity: 100, price: 10, label: '100 images for $10', description: 'Additional block' },
        { quantity: 200, price: 20, label: '200 images for $20', description: 'Better value' },
        { quantity: 500, price: 50, label: '500 images for $50', description: 'Best value' }
      ];

  const handlePurchase = async () => {
    try {
      setLoading(true);
      setError(null);

      const quantity = parseInt(selectedOption);
      
      // For now, we'll just call the backend to update the user's slots
      // In a real implementation, this would integrate with Stripe
      const result = await realImageService.purchaseImageSlots(quantity);
      
      console.log('Purchase successful:', result);
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to purchase image slots');
    } finally {
      setLoading(false);
    }
  };

  const selectedOptionData = purchaseOptions.find(option => option.quantity.toString() === selectedOption);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Purchase Additional Image Slots
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {isFirstPurchase 
            ? "You've reached your image limit. Purchase additional slots to continue uploading images."
            : "Purchase more image slots to expand your storage."
          }
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {purchaseOptions.map((option) => (
              <Card 
                key={option.quantity}
                variant="outlined" 
                sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  border: selectedOption === option.quantity.toString() ? 2 : 1,
                  borderColor: selectedOption === option.quantity.toString() ? 'primary.main' : 'grey.300'
                }}
                onClick={() => setSelectedOption(option.quantity.toString())}
              >
                <CardContent sx={{ py: 2 }}>
                  <FormControlLabel
                    value={option.quantity.toString()}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="h6" component="div">
                          {option.label}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {option.description}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ${(option.price / option.quantity).toFixed(2)} per image
                        </Typography>
                      </Box>
                    }
                    sx={{ margin: 0, width: '100%' }}
                  />
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </FormControl>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Cover images don't count toward your limit. Only content images are tracked.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePurchase}
          disabled={loading || !selectedOptionData}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading 
            ? 'Processing...' 
            : `Purchase for $${selectedOptionData?.price || 0}`
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageSlotPurchaseModal;