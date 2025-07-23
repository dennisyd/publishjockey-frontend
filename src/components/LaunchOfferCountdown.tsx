import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Timer as TimerIcon } from '@mui/icons-material';
import { getTimeRemaining, formatTimeRemaining } from '../config/launchOffer';

interface LaunchOfferCountdownProps {
  variant?: 'compact' | 'full';
}

const LaunchOfferCountdown: React.FC<LaunchOfferCountdownProps> = ({ 
  variant = 'full' 
}) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeLeft(remaining);
      
      if (!remaining) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return null; // Don't show countdown if offer has expired
  }

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TimerIcon sx={{ color: 'error.main', fontSize: 20 }} />
        <Typography variant="body2" color="error.main" fontWeight={600}>
          {formatTimeRemaining(timeLeft)} left
        </Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={3}
      sx={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        color: 'white',
        p: 2,
        mb: 3,
        textAlign: 'center',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        🚀 PRE-LAUNCH OFFER ENDING SOON!
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
        <TimerIcon sx={{ color: 'white' }} />
        <Typography variant="body1" fontWeight={600}>
          {formatTimeRemaining(timeLeft)} remaining
        </Typography>
      </Box>
      
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        Save up to $1,450 on professional book publishing tools
      </Typography>
    </Paper>
  );
};

export default LaunchOfferCountdown; 