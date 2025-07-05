import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Container,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  styled
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';
import MarkdownIcon from '@mui/icons-material/Code';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

// API URL
const API_URL = 'http://localhost:3001/api';

// Define API response types
interface SplitDoctorResponse {
  success: boolean;
  message: string;
  data?: {
    sectionCount: number;
    docxZipPath?: string;
    mdZipPath: string;
    outputDir?: string;
  };
  error?: string;
}

// Define custom props for DropZone
interface DropZoneProps {
  isDragActive: boolean;
  children?: React.ReactNode;
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

// Styled components for file upload
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DropZone = styled(Paper)<{ isDragActive: boolean }>(({ theme, isDragActive }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  border: isDragActive ? `2px dashed ${theme.palette.primary.main}` : `2px dashed ${theme.palette.grey[400]}`,
  backgroundColor: isDragActive ? theme.palette.grey[100] : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.primary.main,
  },
  '& svg': {
    fontSize: 48,
    marginBottom: theme.spacing(2),
    color: isDragActive ? theme.palette.primary.main : theme.palette.grey[500],
  }
}));

// Main component
const SplitDoctor: React.FC = () => {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ message: string, docxLink: string, mdLink: string } | null>(null);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      console.log('File selected via input:', selectedFile.name, selectedFile.size, selectedFile.type);
      
      if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setError('Please upload a valid .docx file');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      
      // Don't reset the input value here, as it causes the refresh issue
      // If we need to clear it, do it only after successful upload
    }
  };

  // Handle file drag events
  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      console.log('File dropped:', droppedFile.name, droppedFile.size, droppedFile.type);
      
      if (droppedFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setError('Please upload a valid .docx file');
        return;
      }
      
      setFile(droppedFile);
      setError(null);
    } else {
      console.log('No files in drop event');
    }
  };

  // Upload and process the file
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    // Double-check that the file is the correct type
    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setError('Please upload a valid Microsoft Word (.docx) file');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    console.log('Starting file upload process', { fileName: file.name, fileSize: file.size });

    try {
      const formData = new FormData();
      formData.append('document', file);
      
      console.log('Submitting to:', `${API_URL}/split-document`);
      console.log('Token available:', !!token);

      const response = await axios.post<SplitDoctorResponse>(
        `${API_URL}/split-document`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          // Add timeout to prevent hanging requests
          timeout: 60000, // 60 seconds
        }
      );
      
      console.log('Response received:', response.data);

      if (response.data.success && response.data.data) {
        // Get the direct paths
        const docxPath = response.data.data.docxZipPath;
        const mdPath = response.data.data.mdZipPath;
        
        // Parse the paths to get just the file name and directory name
        let docxUrl = '';
        const mdMatch = mdPath.match(/\/public-files\/([^/]+)\/([^/]+)$/);
        
        if (!mdMatch) {
          console.error('Invalid markdown download path returned from server', { mdPath });
          setError('Error processing download paths. Please try again.');
          return;
        }
        
        // Get the filename and directory components
        const mdDir = mdMatch[1];
        const mdFile = mdMatch[2];
        
        // Log the raw paths
        console.log('Parsed download paths:', {
          mdDir, mdFile
        });
        
        // Create direct file URLs using the most direct path possible
        const baseUrl = 'http://localhost:3001';
        
        // Only set docxUrl if docxPath exists
        if (docxPath) {
          const docxMatch = docxPath.match(/\/public-files\/([^/]+)\/([^/]+)$/);
          if (docxMatch) {
            const docxDir = docxMatch[1];
            const docxFile = docxMatch[2];
            docxUrl = `${baseUrl}/public-files/${docxDir}/${docxFile}`;
          }
        }
        
        const mdUrl = `${baseUrl}/public-files/${mdDir}/${mdFile}`;
        
        console.log('Final download URLs:', {
          docx: docxUrl || 'Not available',
          md: mdUrl
        });
        
        setSuccess({
          message: response.data.message,
          docxLink: docxUrl,
          mdLink: mdUrl
        });
      } else {
        setError(response.data.message || 'Failed to process file');
        console.error('API returned error:', response.data);
      }
    } catch (err: any) {
      console.error('Error uploading file:', err);
      
      // More detailed error logging
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      } else if (err.request) {
        console.error('Request made but no response received');
      }
      
      setError(err.response?.data?.message || 'Error processing file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFile(null);
    setError(null);
    setSuccess(null);
    // Don't reset the loading state here, it should be handled by handleUpload
  };

  // Trigger file input click
  const handleFileInputClick = () => {
    const fileInput = document.getElementById('docx-file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          SplitDoctor
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Upload a Microsoft Word (.docx) document and split it by Heading 1 sections
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        {!success ? (
          <Box>
            <DropZone
              isDragActive={isDragActive}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleFileInputClick}
            >
              <CloudUploadIcon />
              <Typography variant="h6" gutterBottom>
                Drag & Drop or Click to Upload
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {file ? `Selected: ${file.name}` : 'Only .docx files are supported'}
              </Typography>
              
              <VisuallyHiddenInput
                type="file"
                id="docx-file-input"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileSelect}
              />
              
              <Button
                variant="contained"
                startIcon={<FileUploadIcon />}
                sx={{ mt: 2 }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent DropZone click
                  handleFileInputClick();
                }}
              >
                Select File
              </Button>
            </DropZone>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                disabled={!file || loading}
                onClick={handleUpload}
                sx={{ minWidth: 120 }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FileUploadIcon />}
              >
                {loading ? 'Processing...' : 'Process File'}
              </Button>
              
              {file && (
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              {success.message}
            </Alert>
            
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Download Options
              </Typography>
              
              <Stack spacing={2}>
                {success.docxLink && (
                  <Button
                    variant="contained"
                    startIcon={<ArticleIcon />}
                    href={success.docxLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                  >
                    Download Word Documents (.docx)
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  startIcon={<MarkdownIcon />}
                  href={success.mdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                >
                  Download Markdown Files (.md)
                </Button>
              </Stack>
            </Paper>
            
            <Button 
              variant="outlined" 
              onClick={handleReset}
              startIcon={<FileUploadIcon />}
              fullWidth
            >
              Process Another Document
            </Button>
          </Box>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Divider sx={{ my: 4 }} />
      
      <Paper elevation={1} sx={{ p: 3, backgroundColor: 'background.default' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
          <Typography variant="h6">How to Use SplitDoctor</Typography>
        </Box>
        
        <Typography variant="body2" paragraph>
          SplitDoctor helps you split your Word document into separate files based on heading structure.
        </Typography>
        
        <Typography variant="body2" component="div">
          <ol>
            <li>Upload a .docx file (Microsoft Word document)</li>
            <li>The tool will split your document at each Heading 1 section</li>
            <li>Download the split files in either DOCX or Markdown format</li>
          </ol>
        </Typography>
        
        <Typography variant="subtitle2" color="primary" sx={{ mt: 2 }}>
          Tips for best results:
        </Typography>
        
        <Typography variant="body2" component="div">
          <ul>
            <li>Use Heading 1 style for each major section in your document</li>
            <li>Make sure your document is properly structured with consistent heading levels</li>
            <li>Tables will be preserved and converted to pipe-formatted tables in Markdown</li>
            <li>For images, placeholders will be inserted automatically, but you'll need to manually upload each image using the toolbar</li>
          </ul>
        </Typography>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          The SplitDoctor detects only Heading 1 (H1) styles in the Word document to simplify processing.
        </Alert>
      </Paper>
    </Container>
  );
};

export default SplitDoctor; 