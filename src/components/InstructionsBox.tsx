import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * InstructionsBox
 *
 * A reusable sidebar info box providing guidance on managing the title page and metadata.
 * Intended for use in project workspaces or settings sidebars.
 */
const InstructionsBox: React.FC = () => (
  <Box
    sx={{
      p: 2,
      mx: 2,
      my: 2,
      bgcolor: '#f5f7fa',
      borderRadius: 2,
      border: '1px solid #e0e0e0',
    }}
  >
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
      Title Page Instructions
    </Typography>
    <Typography variant="body2" color="text.secondary">
      • Click the <b>Title Page</b> in the section list to enter your book's title, subtitle, and author.<br />
      • By default, the title page is auto-generated from your metadata.<br />
      • Enable <b>User Custom Title Page</b> if you want to design your own title page (advanced users only).<br />
      • <b>Title</b> and <b>Author</b> are required for export.
    </Typography>
  </Box>
);

export default InstructionsBox; 