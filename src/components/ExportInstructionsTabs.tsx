import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Box, Typography, Divider } from '@mui/material';

const exportTypes = [
  { label: 'PDF', value: 'pdf' },
  { label: 'EPUB', value: 'epub' },
  { label: 'DOCX', value: 'docx' },
];

const instructions: Record<string, React.ReactNode> = {
  pdf: (
    <Box>
      <Typography variant="h6" gutterBottom>PDF Export Instructions</Typography>
      <Typography variant="body2" paragraph>
        • PDF is best for print-ready files and professional publishing.<br />
        • Choose your book size and binding type.<br />
        • Margins and bleed can be customized for print requirements.<br />
        • Ensure all sections are complete before exporting.
      </Typography>
      {/* Add to the FAQ/help section for PDF export: */}
      {/*
      Q: Can I create full-bleed images or backgrounds (images that extend to the edge of the page)?

      A: PublishJockey does not support full-bleed (edge-to-edge) images or backgrounds in exported PDFs. This feature is typically required for professional photo books, art books, or children's books with images that run to the very edge of the printed page. Achieving true bleed requires specialized print layout tools and careful setup, which is beyond the scope of this export tool. If your project requires full-bleed images, we recommend using a professional desktop publishing application (such as Adobe InDesign or Affinity Publisher) and working directly with your print provider's specifications.
      */}
    </Box>
  ),
  epub: (
    <Box>
      <Typography variant="h6" gutterBottom>EPUB Export Instructions</Typography>
      <Typography variant="body2" paragraph>
        • EPUB is the standard for eBooks and digital distribution.<br />
        • You can upload a cover image (JPG or PNG) for your EPUB.<br />
        • Table of Contents will be auto-generated.<br />
        • Use simple formatting for best compatibility with e-readers.
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" gutterBottom>Cover Image</Typography>
      <Typography variant="body2">
        • To add a cover, use the cover image upload option below.<br />
        • Recommended size: at least 1600px on the shortest side.<br />
        • Supported formats: JPG, PNG.
      </Typography>
    </Box>
  ),
  docx: (
    <Box>
      <Typography variant="h6" gutterBottom>DOCX Export Instructions</Typography>
      <Typography variant="body2" paragraph>
        • DOCX is ideal for editing in Microsoft Word or sharing drafts.<br />
        • Section headings will be preserved.<br />
        • Some advanced formatting may not be supported.<br />
        • Review your document after export for layout adjustments.
      </Typography>
    </Box>
  ),
};

interface ExportInstructionsTabsProps {
  open: boolean;
  onClose: () => void;
  initialTab?: string;
}

const ExportInstructionsTabs: React.FC<ExportInstructionsTabsProps> = ({ open, onClose, initialTab = 'pdf' }) => {
  const [tab, setTab] = useState(initialTab);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Instructions</DialogTitle>
      <DialogContent dividers>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          {exportTypes.map((type) => (
            <Tab key={type.value} label={type.label} value={type.value} />
          ))}
        </Tabs>
        <Box sx={{ mt: 1 }}>{instructions[tab]}</Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportInstructionsTabs; 