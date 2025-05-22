import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import ExportCompletionDialog from './ExportCompletionDialog';

/**
 * Example component showing how to use the ExportCompletionDialog
 * This is just for demonstration purposes
 */
const ExportDialogUsageExample = () => {
  // Dialog open state
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Example generation times (these would typically come from your backend)
  const [generationTimes, setGenerationTimes] = useState({
    pdf: 15.2,
    epub: 8.4,
    word: 7.1
  });
  
  // Simulate starting an export process
  const handleStartExport = async () => {
    // In a real application, you would:
    // 1. Call your backend API to generate the files
    // 2. Track the generation time for each format
    // 3. Open the dialog when complete
    
    // Simulate API call with a delay
    console.log('Starting export process...');
    
    // Simulate different times for each format
    const startTime = Date.now();
    
    // Simulate PDF generation (takes the longest)
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds for demo
    const pdfTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Simulate EPUB generation
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 more second
    const epubTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Simulate Word generation
    await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 more seconds
    const wordTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Update the generation times
    setGenerationTimes({
      pdf: pdfTime,
      epub: epubTime,
      word: wordTime
    });
    
    // Open the dialog
    setDialogOpen(true);
  };
  
  // Handle file download
  const handleDownload = (format) => {
    // In a real application, you would:
    // 1. Initiate the download for the specific format
    // 2. Track download analytics, etc.
    
    // Example implementation
    console.log(`Downloading ${format} file...`);
    
    // Simulate a download (in a real app, you'd redirect to a download URL)
    alert(`Downloading ${format.toUpperCase()} file...`);
    
    // In a real application:
    // window.location.href = `/api/download?format=${format}&projectId=${projectId}`;
  };
  
  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Export Your Book
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleStartExport}
        sx={{ 
          px: 4, 
          py: 1.5, 
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 600
        }}
      >
        Generate Book Files
      </Button>
      
      {/* The Export Completion Dialog */}
      <ExportCompletionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        timings={generationTimes}
        onDownload={handleDownload}
      />
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Click the button above to simulate generating book files and see the export completion dialog.
      </Typography>
    </Box>
  );
};

export default ExportDialogUsageExample; 