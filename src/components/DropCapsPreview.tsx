import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface DropCapsPreviewProps {
  open: boolean;
  onClose: () => void;
  selectedStyle: string;
  language: string;
}

const DropCapsPreview: React.FC<DropCapsPreviewProps> = ({
  open,
  onClose,
  selectedStyle,
  language
}) => {
  const dropCapStyles = [
    { key: 'none', name: 'None', description: 'Standard paragraph opening' },
    { key: 'traditional', name: 'Traditional', description: 'Classic large letter design' },
    { key: 'raised', name: 'Raised', description: 'Elevated letter above the baseline' },
    { key: 'decorated', name: 'Decorated', description: 'Ornamental styling with embellishments' }
  ];

  // No preview data needed - renders directly with CSS

  const renderPreviewContent = (style: string) => {
    // Create enhanced visual representation based on style
    const getDropCapStyle = (style: string) => {
      switch (style) {
        case 'traditional':
          return {
            fontSize: '4em',
            fontWeight: 'bold',
            color: '#2c3e50',
            float: 'left',
            lineHeight: '0.7',
            margin: '0 0.1em 0.1em 0',
            fontFamily: '"Times New Roman", serif',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          };
        case 'raised':
          return {
            fontSize: '3.5em',
            fontWeight: 'bold',
            color: '#34495e',
            float: 'left',
            lineHeight: '0.8',
            margin: '0.2em 0.1em 0.2em 0',
            fontFamily: '"Georgia", serif',
            position: 'relative',
            top: '-0.2em',
            textShadow: '1px 1px 2px rgba(0,0,0,0.15)'
          };
        case 'decorated':
          return {
            fontSize: '4.2em',
            fontWeight: 'bold',
            color: '#8b4513',
            float: 'left',
            lineHeight: '0.65',
            margin: '0 0.05em 0.1em 0',
            fontFamily: '"Old English Text MT", serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            background: 'linear-gradient(45deg, #d4af37, #b8860b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          };
        default:
          return {};
      }
    };

    const dropCapStyle = getDropCapStyle(style);

    return (
      <Box sx={{ mt: 2, p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
        {/* Chapter Title */}
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: 'serif',
            color: 'text.primary',
            fontWeight: 'bold'
          }}
        >
          Chapter 1: The Beginning
        </Typography>

        {/* Sample Text with Drop Cap - Using actual text from your screenshots */}
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: '1.1rem',
            color: 'text.primary',
            '& .drop-cap': dropCapStyle,
            '& .preview-text': {
              marginLeft: style !== 'none' ? '0.5em' : '0'
            }
          }}
        >
          {style !== 'none' && (
            <span className="drop-cap">S</span>
          )}
          <span className="preview-text">
            elf-publishing has opened the doors for millions of authors. But
            while the gates are open, the path is anything but smooth. The
            dream of finishing your manuscript and instantly selling it on Ama-
            zon or Barnes & Noble often collides with the reality of technical
            hurdles, confusing requirements, and unexpected costs.
          </span>
        </Typography>

        {/* Additional preview text - More from your screenshots */}
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            lineHeight: 1.8,
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: '1.1rem',
            color: 'text.secondary'
          }}
        >
          Sometimes the best way to understand the value of a tool is to see
          it in action. Behind every book is an author with a dream — and
          behind every author is a journey filled with struggles, setbacks, and
          breakthroughs.
        </Typography>

        {/* Style-specific decorations */}
        {style === 'decorated' && (
          <Box sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ width: '60px', height: '2px', bgcolor: '#d4af37' }} />
            <Typography variant="caption" sx={{ color: '#8b4513', fontFamily: 'serif' }}>
              ✦ Ornamental Design ✦
            </Typography>
            <Box sx={{ width: '60px', height: '2px', bgcolor: '#d4af37' }} />
          </Box>
        )}

        {style === 'raised' && (
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
            ↑ Letter elevated above baseline for distinctive appearance
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
          Preview of {style === 'none' ? 'standard paragraph' : `${style} drop cap`} style
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Drop Caps Preview</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {dropCapStyles.map((style) => (
            <Grid item xs={12} sm={6} key={style.key}>
              <Card
                variant={selectedStyle === style.key ? 'outlined' : 'elevation'}
                sx={{
                  borderColor: selectedStyle === style.key ? 'primary.main' : 'divider',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{style.name}</Typography>
                    <Chip
                      label={style.key}
                      size="small"
                      color={selectedStyle === style.key ? 'primary' : 'default'}
                      variant={selectedStyle === style.key ? 'filled' : 'outlined'}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {style.description}
                  </Typography>

                  {renderPreviewContent(style.key)}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            These previews show how each drop cap style will appear in your final PDF export.
            The actual rendering will be handled by our professional typesetting engine for the highest quality results.
          </Typography>
        </Alert>
      </DialogContent>
    </Dialog>
  );
};

export default DropCapsPreview;
