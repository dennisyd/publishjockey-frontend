import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Container,
  CircularProgress,
  Alert,
  Stack,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Card
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InfoIcon from '@mui/icons-material/Info';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';


// API URL
const API_URL = process.env.REACT_APP_EXPORT_API_URL || 'https://publishjockey-export.onrender.com'; // Use export-backend for ImageMagic

// Define API response types
interface ImageMagicResponse {
  success: boolean;
  message: string;
  originalSize?: {
    width: number;
    height: number;
  };
  newSize?: {
    width: number;
    height: number;
  };
  outputPath?: string;
  kdpReady?: boolean;
  dpi?: number;
  bookSize?: string;
  error?: string;
}

interface KdpSize {
  id: string;
  name: string;
  width: number;
  height: number;
  dpi: number;
}

interface KdpSizesResponse {
  success: boolean;
  sizes: KdpSize[];
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

const PreviewBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& img': {
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1]
  }
}));

// Main component
const ImageMagic: React.FC = () => {
  const token = localStorage.getItem('token');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<ImageMagicResponse | null>(null);
  const [bookSize, setBookSize] = useState<string>('auto');
  const [kdpSizes, setKdpSizes] = useState<KdpSize[]>([]);

  // Fetch KDP sizes on component mount
  useEffect(() => {
    const fetchKdpSizes = async () => {
      try {
        const response = await axios.get<KdpSizesResponse>(`${API_URL}/kdp-sizes`);
        if (response.data.success && response.data.sizes) {
          setKdpSizes(response.data.sizes);
        }
      } catch (err) {
        console.error('Error fetching KDP sizes:', err);
      }
    };

    fetchKdpSizes();
  }, []);

  // Create preview when file changes
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Clean up on unmount
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // Handle book size change
  const handleBookSizeChange = (event: SelectChangeEvent) => {
    setBookSize(event.target.value);
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      console.log('File selected via input:', selectedFile.name, selectedFile.size, selectedFile.type);
      
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload a valid image file (JPEG, PNG)');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
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
      
      if (!droppedFile.type.startsWith('image/')) {
        setError('Please upload a valid image file (JPEG, PNG)');
        return;
      }
      
      setFile(droppedFile);
      setError(null);
    } else {
      console.log('No files in drop event');
    }
  };

  // Upload and process the image
  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image file first');
      return;
    }

    // Double-check that the file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG)');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    console.log('Starting image upload process', { fileName: file.name, fileSize: file.size, bookSize });

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('bookSize', bookSize);
      
      console.log('Submitting to:', `${API_URL}/upscale-image`);
      console.log('Token available:', !!token);

      const response = await axios.post<ImageMagicResponse>(
        `${API_URL}/upscale-image`, 
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

      if (response.data.success) {
        setSuccess(response.data);
      } else {
        setError(response.data.message || 'Failed to process image');
        console.error('API returned error:', response.data);
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      
      // More detailed error logging
      if (err.response) {
        console.error('Error response:', err.response.data);
        
        // Check if image is likely too small (less than 100KB)
        const isImageTooSmall = file.size < 100 * 1024;
        const errorDetails = err.response.data.details || '';
        
        if (isImageTooSmall) {
          setError(`The image failed to convert. Your source image (${Math.round(file.size / 1024)} KB) is likely too small for high-quality upscaling. Please use a larger image with more resolution.`);
        } else if (errorDetails.toLowerCase().includes('small') || errorDetails.toLowerCase().includes('resolution')) {
          setError(`Image processing failed: ${errorDetails}. Please try using a larger image with higher resolution.`);
        } else {
          setError(err.response.data.error || 'Failed to process image. Please check that your image meets the minimum size requirements.');
        }
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('No response from server. Please try again later.');
      } else {
        setError('Failed to process image: ' + (err.message || 'Unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setSuccess(null);
    setBookSize('auto');
  };

  // Handle file input click
  const handleFileInputClick = () => {
    document.getElementById('image-upload-input')?.click();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        ImageMagic: KDP Book Cover Creator
      </Typography>
      
      <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
        Transform your images into high-resolution covers ready for Amazon KDP publishing.
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Stack spacing={3}>
          {/* Book Size Selector */}
          <FormControl fullWidth>
            <InputLabel id="book-size-label">Book Size</InputLabel>
            <Select
              labelId="book-size-label"
              id="book-size-select"
              value={bookSize}
              label="Book Size"
              onChange={handleBookSizeChange}
            >
              <MenuItem value="auto">Auto Detect (Best Match for Your Image)</MenuItem>
              {kdpSizes.map((size) => (
                <MenuItem key={size.id} value={size.id}>
                  {size.name} - {size.width}x{size.height} pixels
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" sx={{ mt: 1, ml: 1, color: 'text.secondary' }}>
              Select the book size that matches your KDP publishing specifications. Auto-detect will choose the best size based on your image's aspect ratio.
            </Typography>
          </FormControl>
          
          {/* File Upload Area */}
          <DropZone
            isDragActive={isDragActive}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleFileInputClick}
          >
            <ImageIcon />
            <Typography variant="h6" gutterBottom>
              {file ? 'Image Selected' : 'Upload Cover Image'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {file 
                ? `File: ${file.name} (${Math.round(file.size / 1024)} KB)` 
                : 'Drag and drop an image here, or click to select'}
            </Typography>
            {!file && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                Recommended: Images larger than 1000x1500 pixels (at least 200KB) for best results
              </Typography>
            )}
            {file && file.size < 100 * 1024 && (
              <Typography variant="caption" color="warning.main" sx={{ mt: 1, mb: 1, display: 'block' }}>
                Warning: Your image is quite small ({Math.round(file.size / 1024)} KB). For high-quality KDP covers, 
                larger images (200KB+) are recommended.
              </Typography>
            )}
            <Button 
              component="label"
              startIcon={<FileUploadIcon />}
              sx={{ mt: 2 }}
            >
              Select Image
              <VisuallyHiddenInput
                id="image-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>
          </DropZone>
          
          {/* Preview Area */}
          {preview && (
            <PreviewBox>
              <Typography variant="subtitle1" gutterBottom>
                Preview:
              </Typography>
              <img src={preview} alt="Preview" />
            </PreviewBox>
          )}
          
          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* Success Message and Download Link */}
          {success && (
            <Card elevation={3} sx={{ mt: 4, p: 3 }}>
              <Typography variant="h6" gutterBottom color="success.main">
                <CheckCircleOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Image Successfully Upscaled!
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Typography variant="body2">
                  Original size: {success.originalSize.width}x{success.originalSize.height} pixels
                </Typography>
                <Typography variant="body2">
                  New size: {success.newSize.width}x{success.newSize.height} pixels ({success.dpi} DPI)
                </Typography>
                <Typography variant="body2">
                  Book size: {success.bookSize}
                </Typography>
                <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontWeight: 500 }}>
                  <ScheduleIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                  Note: This file will be automatically deleted after 15 minutes. Please download it now.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<DownloadIcon />}
                  href={`${API_URL}${success.outputPath}`}
                  target="_blank"
                  sx={{ mt: 2 }}
                >
                  Download KDP-Ready Cover
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<RefreshIcon />}
                  sx={{ mt: 2 }}
                >
                  Process Another Image
                </Button>
              </Box>
            </Card>
          )}
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Upscale for KDP'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
          </Box>
        </Stack>
      </Paper>
      
      {/* Information Box */}
      <Paper elevation={2} sx={{ p: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <InfoIcon fontSize="large" />
          </Grid>
          <Grid item xs>
            <Typography variant="h6" gutterBottom>
              About KDP Cover Requirements
            </Typography>
            <Typography variant="body2">
              • Amazon KDP requires high-resolution book covers at 300 DPI<br />
              • ImageMagic supports all popular KDP book sizes from 5"x8" to 8.5"x11"<br />
              • The recommended pixel size for a 6"x9" book is 3600x5400 pixels<br />
              • For best results, upload images with at least 1000x1500 pixels and 200KB+ file size<br />
              • Very small images (under 100KB) may lack sufficient detail for quality upscaling<br />
              • ImageMagic automatically upscales your image to the appropriate size<br />
              • Processed files are temporarily stored and automatically deleted after 15 minutes<br />
              • Be sure to download your upscaled image promptly
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ImageMagic; 