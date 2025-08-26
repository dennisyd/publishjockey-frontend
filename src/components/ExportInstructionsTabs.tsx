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
      
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" gutterBottom>🌍 Language Support - 55 Languages!</Typography>
      <Typography variant="body2" paragraph>
        <strong>📊 PublishJockey supports 55 languages</strong> covering over <strong>5.5 billion speakers worldwide</strong> - 
        more than most global publishing platforms!
      </Typography>
      
      <Typography variant="body2" paragraph>
        📚 <strong>European (28):</strong> English, Spanish, French, German, Italian, Portuguese, Russian, Polish, 
        Dutch, Swedish, Norwegian, Danish, Finnish, Czech, Croatian, Romanian, Greek, Hungarian, Turkish, Estonian, 
        Latvian, Lithuanian, Macedonian, Serbian, Slovak, Slovenian, Galician, Icelandic.
      </Typography>
      
      <Typography variant="body2" paragraph>
        🌍 <strong>African (14):</strong> Swahili, Hausa, Yoruba, Igbo, Zulu, Xhosa, Shona, Malagasy, 
        Kinyarwanda, Kirundi, Luganda, Kikuyu, Sotho, Tswana.
      </Typography>
      
      <Typography variant="body2" paragraph>
        🇮🇳 <strong>Indic (9):</strong> Hindi (हिन्दी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), 
        Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), Oriya (ଓଡ଼ିଆ) 
        - all with native script support.
      </Typography>
      
      <Typography variant="body2" paragraph>
        🌏 <strong>Asian (4):</strong> Indonesian, Malaysian, Vietnamese, Filipino.
      </Typography>
      
      <Typography variant="body2" paragraph>
        <strong>🚀 Coming Soon:</strong><br />
        • RTL Languages: Arabic (العربية), Hebrew (עברית), Yiddish (יידיש)<br />
        • CJK Languages: Chinese (中文), Japanese (日本語), Korean (한국어)
      </Typography>
      
      <Typography variant="body2" paragraph sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
        Most book platforms support 1-5 languages. We support 55 languages with native scripts and complete localization! 🏆
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" gutterBottom>Full-Bleed Images</Typography>
      <Typography variant="body2" paragraph>
        PublishJockey does not currently support full-bleed (edge-to-edge) images or backgrounds. 
        For professional projects requiring full-bleed layouts, consider using specialized tools 
        like Adobe InDesign or working directly with your print provider.
      </Typography>
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