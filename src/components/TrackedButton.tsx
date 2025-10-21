import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useAnalytics } from '../hooks/useAnalytics';

interface TrackedButtonProps extends Omit<ButtonProps, 'onClick'> {
  trackingText?: string;
  trackingType?: string;
  trackingLocation?: string;
  trackingPlan?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Button component with automatic click tracking
 * Wraps Material-UI Button and adds analytics tracking
 */
export const TrackedButton: React.FC<TrackedButtonProps> = ({
  trackingText,
  trackingType = 'primary',
  trackingLocation = 'unknown',
  trackingPlan,
  onClick,
  children,
  ...buttonProps
}) => {
  const { trackCTAClick } = useAnalytics();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Track the click if tracking props are provided
    if (trackingText && trackingLocation) {
      trackCTAClick(
        trackingText,
        trackingType,
        trackingLocation,
        trackingPlan
      );
    }

    // Call the original onClick handler
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button
      {...buttonProps}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
