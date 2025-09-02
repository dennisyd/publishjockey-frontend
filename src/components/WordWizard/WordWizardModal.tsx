import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as DocumentIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  DragHandle as DragIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { classifyDocuments, convertToBookStructure, validateImport } from '../../utils/WordWizard';

interface WordWizardModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (bookData: any) => void;
}

interface ClassificationResult {
  frontMatter: any[];
  mainMatter: any[];
  backMatter: any[];
  metadata: {
    title: string;
    author: string;
    language: string;
    totalSections: number;
  };
}

const steps = ['Upload ZIP', 'Review Classification', 'Import Book'];

const WordWizardModal: React.FC<WordWizardModalProps> = ({ open, onClose, onImport }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [bookData, setBookData] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.zip')) {
      setZipFile(file);
      setError(null);
      processZipFile(file);
    } else {
      setError('Please upload a ZIP file containing your documents.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip']
    },
    multiple: false
  });

  const processZipFile = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Processing ZIP file:', file.name, 'Size:', file.size);

      // Read the ZIP file
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);
      
      console.log('ZIP loaded successfully, files:', Object.keys(zipData.files));

      // Extract all markdown/text files
      const extractedDocuments = [];
      
      for (const [filename, zipEntry] of Object.entries(zipData.files)) {
        // Skip directories and non-text files
        if (zipEntry.dir) continue;
        
        // Only process markdown, text, and document files
        const ext = filename.split('.').pop()?.toLowerCase();
        if (!ext || !['md', 'txt', 'docx'].includes(ext)) {
          console.log('Skipping non-text file:', filename);
          continue;
        }

        try {
          console.log('Extracting:', filename);
          const content = await zipEntry.async('string');
          
          if (content.trim()) { // Only include non-empty files
            extractedDocuments.push({
              filename,
              content: content.trim()
            });
            console.log(`Extracted ${filename}: ${content.length} characters`);
          }
        } catch (extractError) {
          console.warn(`Failed to extract ${filename}:`, extractError);
        }
      }

      if (extractedDocuments.length === 0) {
        throw new Error('No valid text files found in ZIP. Please ensure your ZIP contains .md, .txt, or .docx files.');
      }

      console.log(`Successfully extracted ${extractedDocuments.length} documents`);
      setDocuments(extractedDocuments);
      
      // Classify the documents
      console.log('Classifying documents...');
      const classificationResult = classifyDocuments(extractedDocuments);
      console.log('Classification result:', classificationResult);
      setClassification(classificationResult);

      // Convert to book structure
      const convertedBookData = convertToBookStructure(classificationResult);
      console.log('Converted book data:', convertedBookData);
      setBookData(convertedBookData);

      // Validate the import
      const validationResult = validateImport(convertedBookData);
      console.log('Validation result:', validationResult);
      setValidation(validationResult);

      setActiveStep(1);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process ZIP file. Please try again.';
      setError(errorMessage);
      console.error('ZIP processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (bookData && validation?.isValid) {
      onImport(bookData);
      handleClose();
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setZipFile(null);
    setDocuments([]);
    setClassification(null);
    setBookData(null);
    setValidation(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  const renderUploadStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s ease'
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop your ZIP file here' : 'Drag & drop your ZIP file here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          or click to browse files
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }}>
          Choose File
        </Button>
      </Box>

      {zipFile && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Selected: {zipFile.name}
          </Typography>
          {loading && <LinearProgress sx={{ mt: 2 }} />}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );

  const renderClassificationStep = () => {
    if (!classification) return null;

    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="h6" gutterBottom>
          📚 Detected Book Structure
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Book Metadata:
          </Typography>
          <Chip label={`Title: ${classification.metadata.title}`} sx={{ mr: 1, mb: 1 }} />
          <Chip label={`Author: ${classification.metadata.author}`} sx={{ mr: 1, mb: 1 }} />
          <Chip label={`Language: ${classification.metadata.language.toUpperCase()}`} sx={{ mr: 1, mb: 1 }} />
          <Chip label={`${classification.metadata.totalSections} sections`} sx={{ mr: 1, mb: 1 }} />
        </Box>

        {/* Front Matter */}
        {classification.frontMatter.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              📖 Front Matter ({classification.frontMatter.length} sections)
            </Typography>
            <List dense>
              {classification.frontMatter.map((doc, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <DocumentIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={doc.filename}
                    secondary={`Confidence: ${(doc.confidence * 100).toFixed(0)}%`}
                  />
                  <Chip 
                    size="small" 
                    label={`${(doc.confidence * 100).toFixed(0)}%`}
                    color={doc.confidence > 0.8 ? 'success' : doc.confidence > 0.5 ? 'warning' : 'default'}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Main Matter */}
        {classification.mainMatter.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              📚 Main Matter ({classification.mainMatter.length} sections)
            </Typography>
            <List dense>
              {classification.mainMatter.slice(0, 5).map((doc, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <DocumentIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={doc.filename}
                    secondary={`Confidence: ${(doc.confidence * 100).toFixed(0)}%`}
                  />
                  <Chip 
                    size="small" 
                    label={`${(doc.confidence * 100).toFixed(0)}%`}
                    color={doc.confidence > 0.8 ? 'success' : doc.confidence > 0.5 ? 'warning' : 'default'}
                  />
                </ListItem>
              ))}
              {classification.mainMatter.length > 5 && (
                <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                  ... and {classification.mainMatter.length - 5} more sections
                </Typography>
              )}
            </List>
          </Paper>
        )}

        {/* Back Matter */}
        {classification.backMatter.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              📝 Back Matter ({classification.backMatter.length} sections)
            </Typography>
            <List dense>
              {classification.backMatter.map((doc, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <DocumentIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={doc.filename}
                    secondary={`Confidence: ${(doc.confidence * 100).toFixed(0)}%`}
                  />
                  <Chip 
                    size="small" 
                    label={`${(doc.confidence * 100).toFixed(0)}%`}
                    color={doc.confidence > 0.8 ? 'success' : doc.confidence > 0.5 ? 'warning' : 'default'}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Validation Results */}
        {validation && (
          <Box sx={{ mt: 3 }}>
            {validation.isValid ? (
              <Alert severity="success" icon={<CheckIcon />}>
                Ready to import! All validation checks passed.
              </Alert>
            ) : (
              <Alert severity="error" icon={<ErrorIcon />}>
                Validation failed: {validation.errors.join(', ')}
              </Alert>
            )}
            
            {validation.warnings.length > 0 && (
              <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 1 }}>
                Warnings: {validation.warnings.join(', ')}
              </Alert>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          🪄 <Typography variant="h6">WordWizard Import</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && renderUploadStep()}
        {activeStep === 1 && renderClassificationStep()}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        
        {activeStep === 1 && (
          <>
            <Button onClick={() => setActiveStep(0)}>
              Back
            </Button>
            <Button 
              variant="contained" 
              onClick={handleImport}
              disabled={!validation?.isValid}
              startIcon={<CheckIcon />}
            >
              Import Book
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WordWizardModal;
