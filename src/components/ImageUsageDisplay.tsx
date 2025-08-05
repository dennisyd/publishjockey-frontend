import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Button, Alert } from '@mui/material';
import { realImageService } from '../services/realImageService';

interface ImageUsageStats {
  used: number;
  allowed: number;
  additional: number;
  total: number;
  remaining: number;
  canUpload: boolean;
}

interface ImageUsageDisplayProps {
  onUpgradeClick?: () => void;
  showUpgradeButton?: boolean;
  compact?: boolean;
}

const ImageUsageDisplay: React.FC<ImageUsageDisplayProps> = ({
  onUpgradeClick,
  showUpgradeButton = true,
  compact = false
}) => {
  const [usage, setUsage] = useState<ImageUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const stats = await realImageService.getImageUsageStats();
      setUsage(stats);
      setError(null);
    } catch (err: any) {
      console.error('Image usage fetch error:', err);
      // Check if it's an authentication error
      if (err.message === 'Failed to fetch image usage') {
        setError('Please log in to view image usage statistics');
      } else {
        setError(err.message || 'Failed to fetch image usage');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: compact ? 1 : 2 }}>
        <Typography variant="body2" color="textSecondary">
          Loading image usage...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!usage) return null;

  const percentage = (usage.used / usage.total) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = !usage.canUpload;

  return (
    <Box sx={{ p: compact ? 1 : 2 }}>
      {!compact && (
        <Typography variant="h6" gutterBottom>
          Image Usage
        </Typography>
      )}
      
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" color="textSecondary">
          {usage.used} of {usage.total} images used
          {usage.additional > 0 && (
            <span> (includes {usage.additional} additional slots)</span>
          )}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={Math.min(percentage, 100)}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            backgroundColor: isAtLimit ? 'error.main' : isNearLimit ? 'warning.main' : 'primary.main',
            borderRadius: 4,
          },
        }}
      />

      {isNearLimit && (
        <Box sx={{ mt: 1 }}>
          {isAtLimit ? (
            <Alert severity="error" sx={{ py: 0.5 }}>
              <Typography variant="body2">
                Image limit reached! {showUpgradeButton && 'Purchase more slots to continue uploading.'}
              </Typography>
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ py: 0.5 }}>
              <Typography variant="body2">
                You're approaching your image limit ({usage.remaining} slots remaining).
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {showUpgradeButton && (isAtLimit || isNearLimit) && (
        <Box sx={{ mt: 1 }}>
          <Button
            variant={isAtLimit ? "contained" : "outlined"}
            color="primary"
            size="small"
            onClick={onUpgradeClick}
            disabled={!onUpgradeClick}
          >
            {usage.additional === 0 ? 'Get 100 more images ($25)' : 'Add more images ($10/100)'}
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="textSecondary">
          Cover images don't count toward your limit
        </Typography>
      </Box>
    </Box>
  );
};

export default ImageUsageDisplay;