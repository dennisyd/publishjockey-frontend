import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
import { http } from '../services/http';

interface WordCountDisplayProps {
  projectId: string | null;
  wordLimit: number | null;
  compact?: boolean;
  onUpgradeClick?: () => void;
  showForAllUsers?: boolean; // New prop to show word count for all users
  onWordLimitStatusChange?: (isOverLimit: boolean) => void; // Callback when word limit status changes
  refreshTrigger?: number; // Increment to trigger word count refresh
}

interface WordCountData {
  wordCount: number;
  wordLimit: number | null;
  wordsRemaining: number | null;
  isValid: boolean;
}

const WordCountDisplay: React.FC<WordCountDisplayProps> = ({
  projectId,
  wordLimit,
  compact = false,
  onUpgradeClick,
  showForAllUsers = false,
  onWordLimitStatusChange,
  refreshTrigger = 0
}) => {
  const [wordData, setWordData] = useState<WordCountData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setWordData(null);
      return;
    }

    // Show for all users if showForAllUsers is true, or if there's a word limit
    if (!showForAllUsers && !wordLimit) {
      setWordData(null);
      return;
    }

    const fetchWordCount = async () => {
      setLoading(true);
      try {
        const response = await http.get(`/projects/${projectId}/wordcount`);
        if (response.data.success) {
          const data = response.data.data;
          setWordData(data);
          
          // Notify parent component about word limit status
          if (onWordLimitStatusChange && data.wordLimit !== null) {
            onWordLimitStatusChange(!data.isValid);
          }
        }
      } catch (error) {
        console.error('Error fetching word count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWordCount();
  }, [projectId, wordLimit, showForAllUsers, refreshTrigger]);

  // Don't show anything if no project, or if not showing for all users and no word limit
  if (!projectId || (!showForAllUsers && !wordLimit)) {
    return null;
  }

  if (loading) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          Counting words...
        </Typography>
      </Box>
    );
  }

  if (!wordData) {
    return null;
  }

  const hasWordLimit = wordData.wordLimit !== null;
  const progress = hasWordLimit ? (wordData.wordCount / wordData.wordLimit!) * 100 : 0;
  const isOverLimit = hasWordLimit && !wordData.isValid;
  const isNearLimit = hasWordLimit && progress > 80;

  return (
    <Box>
      {!compact && (
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Word Count
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: hasWordLimit ? 1 : 0 }}>
        <Typography 
          variant={compact ? "body2" : "body1"} 
          color={isOverLimit ? "error.main" : "text.primary"}
          sx={{ fontWeight: isOverLimit ? 600 : 400 }}
        >
          {hasWordLimit ? (
            `${wordData.wordCount.toLocaleString()} / ${wordData.wordLimit?.toLocaleString()} words`
          ) : (
            `${wordData.wordCount.toLocaleString()} words`
          )}
        </Typography>
        
        {hasWordLimit && wordData.wordsRemaining !== null && (
          <Typography 
            variant="body2" 
            color={isOverLimit ? "error.main" : isNearLimit ? "warning.main" : "text.secondary"}
          >
            ({wordData.wordsRemaining.toLocaleString()} remaining)
          </Typography>
        )}
      </Box>

      {/* Progress bar - only show for users with word limits */}
      {hasWordLimit && (
        <LinearProgress
          variant="determinate"
          value={Math.min(100, progress)}
          color={isOverLimit ? "error" : isNearLimit ? "warning" : "primary"}
          sx={{ 
            height: compact ? 4 : 6, 
            borderRadius: 2,
            mb: isOverLimit || (isNearLimit && onUpgradeClick) ? 1 : 0
          }}
        />
      )}

      {/* Warning messages - only for users with word limits */}
      {hasWordLimit && isOverLimit && (
        <Typography variant="body2" color="error.main" sx={{ mt: 0.5 }}>
          Content exceeds word limit. Please reduce content or upgrade your plan.
        </Typography>
      )}
      
      {hasWordLimit && isNearLimit && !isOverLimit && onUpgradeClick && (
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="body2" color="warning.main">
            Approaching word limit.
          </Typography>
          <Button 
            size="small" 
            onClick={onUpgradeClick}
            sx={{ mt: 0.5, fontSize: '0.75rem' }}
          >
            Upgrade Plan
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default WordCountDisplay;
