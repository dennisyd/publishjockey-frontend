import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
  TextSnippet as TextSnippetIcon,
  Help as HelpIcon
} from '@mui/icons-material';

export interface ImportSettings {
  source: 'file' | 'gdocs';
  fileType?: 'docx' | 'md' | 'txt';
  fileName?: string;
  googleDocsUrl?: string;
}

// Document file metadata interface
interface ImportFile {
  file: File;
  type: 'docx' | 'md' | 'txt';
  preview: string;
}

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (settings: ImportSettings, file?: File) => Promise<void>;
  isLoading?: boolean;
  sectionName?: string;
}

const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  isLoading = false,
  sectionName = 'Section'
}) => {
  // Import source state
  const [importSource, setImportSource] = useState<'file' | 'gdocs'>('file');
  const [importFile, setImportFile] = useState<ImportFile | null>(null);
  const [googleDocsUrl, setGoogleDocsUrl] = useState('');
  const [error, setError] = useState('');
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset when closed
      setImportFile(null);
      setGoogleDocsUrl('');
      setError('');
    }
  }, [isOpen]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear previous errors
    setError('');
    
    // Determine file type from extension
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    let fileType: 'docx' | 'md' | 'txt' | null = null;
    
    if (['docx', 'doc'].includes(extension)) {
      fileType = 'docx';
    } else if (['md', 'markdown'].includes(extension)) {
      fileType = 'md';
    } else if (['txt', 'text'].includes(extension)) {
      fileType = 'txt';
    }
    
    if (!fileType) {
      setError(`Unsupported file format: .${extension}\nPlease upload only .docx, .md, or .txt files.`);
      return;
    }

    // Additional validation for file size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File too large. Please upload a file smaller than 10MB.');
      return;
    }
    
    // Create file preview
    createFilePreview(file).then(preview => {
      setImportFile({
        file,
        type: fileType as 'docx' | 'md' | 'txt',
        preview
      });
    });
  };

  // Create file preview
  const createFilePreview = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          const content = e.target.result;
          // Generate a preview (first few lines)
          const previewLines = content.split('\n').slice(0, 5);
          let preview = previewLines.join('\n');
          
          // Add ellipsis if the content is larger than the preview
          if (content.split('\n').length > 5) {
            preview += '\n...';
          }
          
          resolve(preview);
        } else {
          resolve('Preview not available');
        }
      };
      reader.onerror = () => {
        resolve('Could not preview file content');
      };
      
      // For text-based files, read as text
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (['txt', 'md', 'markdown', 'text'].includes(extension)) {
        reader.readAsText(file);
      } else {
        // For binary files like docx, we can't show a real preview
        resolve(`${file.name} (Preview not available for this file type)`);
      }
    });
  };

  // Handle Google Docs URL change
  const handleGoogleDocsUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoogleDocsUrl(e.target.value);
    setError('');
  };

  // Handle import button click
  const handleImport = async () => {
    // Validate input
    if (importSource === 'file' && !importFile) {
      setError('Please select a file to import');
      return;
    }
    
    if (importSource === 'gdocs' && !googleDocsUrl) {
      setError('Please enter a Google Docs URL');
      return;
    }
    
    // Validate Google Docs URL
    if (importSource === 'gdocs') {
      const isValidUrl = /https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/.test(googleDocsUrl);
      if (!isValidUrl) {
        setError('Please enter a valid Google Docs URL');
        return;
      }
    }
    
    try {
      // Create import settings
      const settings: ImportSettings = {
        source: importSource,
      };
      
      if (importSource === 'file' && importFile) {
        settings.fileType = importFile.type;
        settings.fileName = importFile.file.name;
        
        // Special handling for Markdown files to ensure correct MIME type
        // Create a new File object with the correct MIME type if it's a markdown file
        let fileToUpload = importFile.file;
        const extension = importFile.file.name.split('.').pop()?.toLowerCase() || '';
        
        if (['md', 'markdown'].includes(extension)) {
          // Force correct MIME type for Markdown files
          // Create a new file with the correct MIME type
          const blob = new Blob([await importFile.file.arrayBuffer()], { type: 'text/markdown' });
          fileToUpload = new File([blob], importFile.file.name, { type: 'text/markdown' });
          console.log("Corrected MIME type for Markdown file:", fileToUpload.type);
        }
        
        // Call the provided import handler with the possibly-corrected file
        await onImport(settings, fileToUpload);
      } else if (importSource === 'gdocs') {
        settings.googleDocsUrl = googleDocsUrl;
        // Call the provided import handler
        await onImport(settings);
      }
    } catch (err: any) {
      console.error('Import error:', err);
      
      // Handle different types of errors with more helpful messages
      if (err.response) {
        // Server responded with an error status code
        if (err.response.status === 500) {
          // Check for specific error messages in the response
          const responseText = err.response.data || '';
          
          if (typeof responseText === 'string' && responseText.includes('Unsupported file type')) {
            setError(
              'Server rejected the file: Unsupported file type.\n\n' +
              'The server only accepts these formats:\n' +
              '• Microsoft Word (.docx)\n' +
              '• Markdown (.md)\n' +
              '• Text (.txt)\n\n' +
              'Please convert your document to one of these formats and try again.'
            );
          } else {
            setError(
              'Server error (500) occurred during import. This could be due to:\n' +
              '• File format issues or corruption\n' +
              '• Server processing limitations\n' +
              '• Temporary server outage\n\n' +
              'Try with a simpler document or a different format.'
            );
          }
        } else if (err.response.status === 413) {
          setError('The file is too large for the server to process. Please try a smaller file.');
        } else if (err.response.status === 401 || err.response.status === 403) {
          setError('Authentication failed. You may need to log in again or check file permissions.');
        } else {
          // Handle other HTTP status codes
          setError(`Import failed: Server returned error code ${err.response.status}`);
        }
      } else if (err.request) {
        // No response received
        setError(
          'No response from server. Please check your internet connection and try again.'
        );
      } else if (err instanceof Error) {
        // Check for specific error messages
        if (err.message.includes('Unsupported file type')) {
          setError(
            'Unsupported file type. The server only accepts these formats:\n' +
            '• Microsoft Word (.docx)\n' +
            '• Markdown (.md)\n' +
            '• Text (.txt)\n\n' +
            'Please convert your document to one of these formats and try again.'
          );
        } else {
          setError(`Import failed: ${err.message}`);
        }
      } else {
        setError('Import failed: Unknown error');
      }
    }
  };

  // Get file type icon based on type
  const getFileTypeIcon = (type: 'docx' | 'md' | 'txt') => {
    switch (type) {
      case 'docx':
        return <DescriptionIcon color="primary" />;
      case 'md':
        return <ArticleIcon sx={{ color: 'success.main' }} />;
      case 'txt':
        return <TextSnippetIcon sx={{ color: 'text.secondary' }} />;
      default:
        return <DescriptionIcon />;
    }
  };

  // Get file type label
  const getFileTypeLabel = (type: 'docx' | 'md' | 'txt') => {
    switch (type) {
      case 'docx':
        return 'Microsoft Word';
      case 'md':
        return 'Markdown';
      case 'txt':
        return 'Text';
      default:
        return 'Document';
    }
  };

  // Add this method to toggle troubleshooting tips
  const toggleTroubleshooting = () => {
    setShowTroubleshooting(prev => !prev);
  };

  // Helper component for file conversion tips
  const FileConversionTips = () => {
    const [showTips, setShowTips] = useState(false);
    
    return (
      <Box sx={{ mt: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setShowTips(!showTips)}
        >
          <HelpIcon fontSize="small" sx={{ color: 'primary.main', mr: 0.5 }} />
          <Typography variant="caption" color="primary">
            {showTips ? 'Hide conversion tips' : 'How to convert your document to a supported format'}
          </Typography>
        </Box>
        
        {showTips && (
          <Box sx={{ mt: 1, p: 1.5, bgcolor: 'primary.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Document Conversion Tips:
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>From PDF:</strong> Use a PDF to Word converter like Adobe Acrobat, Microsoft Word, or online services like Smallpdf.
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>From other formats:</strong> Open your document in its original application and use "Save As" or "Export" to save as .docx, .md, or .txt.
            </Typography>
            
            <Typography variant="body2">
              <strong>Google Docs:</strong> Instead of converting, use the Google Docs import tab for documents stored in Google Docs.
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight="medium">Import Content</Typography>
        {sectionName && (
          <Typography variant="subtitle2" color="text.secondary">
            to {sectionName}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Tabs
          value={importSource}
          onChange={(_, newValue) => setImportSource(newValue as 'file' | 'gdocs')}
          variant="fullWidth"
          sx={{ 
            mb: 3,
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab 
            icon={<UploadFileIcon />} 
            label="File Upload" 
            value="file" 
            iconPosition="start"
            sx={{ fontWeight: 500 }}
          />
          <Tab 
            icon={<DescriptionIcon />} 
            label="Google Docs" 
            value="gdocs" 
            iconPosition="start"
            sx={{ fontWeight: 500 }}
          />
        </Tabs>

        {/* File Upload Section */}
        {importSource === 'file' && (
          <Box sx={{ mb: 3 }}>
            {!importFile ? (
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ 
                  height: 120, 
                  border: '2px dashed rgba(0,0,0,0.2)',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    border: '2px dashed rgba(0,0,0,0.3)',
                    bgcolor: 'rgba(0,0,0,0.01)'
                  }
                }}
              >
                <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography>Click to upload a document</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  (.DOCX, .MD, .TXT)
                </Typography>
                <input
                  type="file"
                  accept=".docx,.doc,.md,.markdown,.txt"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            ) : (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  position: 'relative'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getFileTypeIcon(importFile.type)}
                  <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 500 }}>
                    {importFile.file.name}
                  </Typography>
                  <Box 
                    sx={{ 
                      ml: 1, 
                      px: 1, 
                      py: 0.3, 
                      bgcolor: 'primary.50', 
                      borderRadius: 5,
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    {getFileTypeLabel(importFile.type)}
                  </Box>
                  <IconButton 
                    size="small" 
                    sx={{ ml: 'auto' }}
                    onClick={() => setImportFile(null)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="subtitle2">Preview:</Typography>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'grey.50', 
                    borderRadius: 1,
                    maxHeight: 120,
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    mt: 1
                  }}
                >
                  {importFile.preview || 'No preview available'}
                </Box>

                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{ mt: 2 }}
                >
                  Change File
                  <input
                    type="file"
                    accept=".docx,.doc,.md,.markdown,.txt"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </Paper>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Supported Formats:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 1,
                }}>
                  <DescriptionIcon color="primary" sx={{ mr: 0.5 }} fontSize="small" />
                  <Typography variant="body2">Microsoft Word (.docx)</Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 1,
                }}>
                  <ArticleIcon sx={{ color: 'success.main', mr: 0.5 }} fontSize="small" />
                  <Typography variant="body2">Markdown (.md)</Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 1,
                }}>
                  <TextSnippetIcon sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />
                  <Typography variant="body2">Text (.txt)</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Note: Only these file types are supported. Other formats may be rejected by the server.
              </Typography>
              
              <FileConversionTips />
            </Box>
          </Box>
        )}

        {/* Google Docs Section */}
        {importSource === 'gdocs' && (
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Google Docs URL"
              placeholder="https://docs.google.com/document/d/..."
              fullWidth
              value={googleDocsUrl}
              onChange={handleGoogleDocsUrlChange}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: googleDocsUrl ? (
                  <IconButton 
                    size="small" 
                    onClick={() => setGoogleDocsUrl('')}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ) : null
              }}
            />
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Make sure your Google Doc is <strong>shared with "Anyone with the link can view"</strong> for import to work correctly.
            </Alert>
            
            <Typography variant="subtitle2" gutterBottom>
              How to get a shareable Google Docs link:
            </Typography>
            <ol>
              <li>Open your document in Google Docs</li>
              <li>Click "Share" in the top-right corner</li>
              <li>Change access to "Anyone with the link"</li>
              <li>Copy the link and paste it above</li>
            </ol>
          </Box>
        )}

        {/* Error display with troubleshooting help */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              mb: 1,
              mx: 3,
              whiteSpace: 'pre-line',  // Allow line breaks in the error message
              '& .MuiAlert-message': {
                overflow: 'auto',
                maxHeight: '120px'
              }
            }}
            action={
              <Box>
                <Button 
                  color="error" 
                  size="small" 
                  onClick={toggleTroubleshooting}
                  sx={{ mr: 1 }}
                >
                  {showTroubleshooting ? 'Hide Help' : 'Show Help'}
                </Button>
                <Button 
                  color="error" 
                  size="small" 
                  onClick={() => setError('')}
                >
                  Dismiss
                </Button>
              </Box>
            }
          >
            {error}
          </Alert>
        )}

        {/* Troubleshooting panel */}
        {error && showTroubleshooting && (
          <Box sx={{ mx: 3, mb: 2, mt: 0, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Troubleshooting Tips:
            </Typography>
            
            <Box component="ul" sx={{ pl: 2, mt: 1, mb: 1 }}>
              {importSource === 'file' && (
                <>
                  <li>
                    <Typography variant="body2" gutterBottom>
                      Try converting your document to a different format (e.g., .docx to .md)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" gutterBottom>
                      Check if your file contains complex formatting, tables, or images that might cause issues
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" gutterBottom>
                      For large files, try splitting them into smaller sections
                    </Typography>
                  </li>
                </>
              )}
              
              {importSource === 'gdocs' && (
                <>
                  <li>
                    <Typography variant="body2" gutterBottom>
                      Verify the Google Docs sharing settings are set to "Anyone with the link can view"
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" gutterBottom>
                      Copy the link again from the Google Docs share dialog
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" gutterBottom>
                      If your document is very large or complex, try with a simpler document first
                    </Typography>
                  </li>
                </>
              )}
              
              <li>
                <Typography variant="body2" gutterBottom>
                  The server might be temporarily unavailable. Try again in a few minutes.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                  Check your internet connection and try again
                </Typography>
              </li>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => handleImport()}
                disabled={isLoading || 
                  (importSource === 'file' && !importFile) ||
                  (importSource === 'gdocs' && !googleDocsUrl)}
              >
                Try Again
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: 1.5 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          color="primary"
          disabled={isLoading || 
            (importSource === 'file' && !importFile) ||
            (importSource === 'gdocs' && !googleDocsUrl)}
          sx={{ 
            borderRadius: 1.5,
            px: 3,
            position: 'relative'
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress 
                size={24} 
                color="inherit" 
                sx={{ 
                  position: 'absolute', 
                  left: '50%', 
                  top: '50%', 
                  marginLeft: '-12px', 
                  marginTop: '-12px' 
                }} 
              />
              <span style={{ visibility: 'hidden' }}>Import</span>
            </>
          ) : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportModal; 