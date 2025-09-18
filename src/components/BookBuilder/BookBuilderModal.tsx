import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedSectionNamesObject } from '../../utils/bookStructureLocalization';
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
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as DocumentIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  DragHandle as DragIcon,
  ArrowDropDown as ArrowDropDownIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import {
  CSS
} from '@dnd-kit/utilities';
import { classifyDocuments, convertToBookStructure, validateImport } from '../../utils/BookBuilder';

interface BookBuilderModalProps {
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

// Steps will be translated in the component

// Sortable item component
interface SortableItemProps {
  id: string;
  doc: any;
  matterType: 'front' | 'main' | 'back';
  onMoveToMatter: (docId: string, fromMatter: string, toMatter: string) => void;
  t: (key: string) => string;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, doc, matterType, onMoveToMatter, t }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMoveClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoveClose = () => {
    setAnchorEl(null);
  };

  const handleMoveToSection = (targetMatter: string) => {
    onMoveToMatter(id, matterType, targetMatter);
    handleMoveClose();
  };

  const getMatterOptions = () => {
    const options = [];
    if (matterType !== 'front') options.push({ value: 'front', label: `📑 ${t('bookBuilder.classification.frontMatter')}`, description: t('bookBuilder.classification.frontMatterDesc') });
    if (matterType !== 'main') options.push({ value: 'main', label: `📚 ${t('bookBuilder.classification.mainMatter')}`, description: t('bookBuilder.classification.mainMatterDesc') });
    if (matterType !== 'back') options.push({ value: 'back', label: `📝 ${t('bookBuilder.classification.backMatter')}`, description: t('bookBuilder.classification.backMatterDesc') });
    return options;
  };

  return (
    <ListItem 
      ref={setNodeRef}
      style={style}
      sx={{
        border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper'
      }}
    >
      <ListItemIcon {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
        <DragIcon fontSize="small" />
      </ListItemIcon>
      <ListItemIcon>
        <DocumentIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText 
        primary={doc.title || doc.filename}
        secondary={`${t('bookBuilder.classification.confidence')}: ${(doc.confidence * 100).toFixed(0)}%`}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Chip 
          size="small" 
          label={`${(doc.confidence * 100).toFixed(0)}%`}
          color={doc.confidence > 0.8 ? 'success' : doc.confidence > 0.5 ? 'warning' : 'default'}
        />
        <Button
          size="small"
          variant="outlined"
          onClick={handleMoveClick}
          endIcon={<ArrowDropDownIcon />}
          sx={{ minWidth: 'auto', px: 1 }}
        >
          {t('bookBuilder.classification.move')}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMoveClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {getMatterOptions().map((option) => (
            <MenuItem 
              key={option.value} 
              onClick={() => handleMoveToSection(option.value)}
              sx={{ minWidth: 200 }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {option.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </ListItem>
  );
};

const BookBuilderModal: React.FC<BookBuilderModalProps> = ({ open, onClose, onImport }) => {
  const { t, i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [bookData, setBookData] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
          // Ensure UTF-8 encoding for proper Spanish/European character handling
          const content = await zipEntry.async('string');
          
          if (content.trim()) { // Only include non-empty files
            // Clean up filename encoding issues (common with Spanish accents)
            const cleanFilename = filename
              .replace(/_n\.md$/, 'ón.md')  // Fix introducción -> introducci_n
              .replace(/_([aeiou])([^.])/g, 'ó$2') // General accent fixes
              .normalize('NFC'); // Normalize Unicode characters
            
            extractedDocuments.push({
              filename: cleanFilename,
              content: content.trim()
            });
            console.log(`Extracted ${cleanFilename}: ${content.length} characters`);
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
      
      // Classify the documents using user-selected language
      // Classifying documents
      const userLanguage = i18n.language || 'en';
      // Using dashboard language for classification
      const classificationResult = classifyDocuments(extractedDocuments, userLanguage);
      // Classification completed
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

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !classification) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      // Find which matter type contains the active item
      const fromMatter = classification.frontMatter.find(doc => doc.filename === activeId) ? 'front' :
                        classification.mainMatter.find(doc => doc.filename === activeId) ? 'main' : 'back';
      
      const toMatter = classification.frontMatter.find(doc => doc.filename === overId) ? 'front' :
                      classification.mainMatter.find(doc => doc.filename === overId) ? 'main' : 'back';

      if (fromMatter === toMatter) {
        // Reorder within same matter type
        const matterArray = fromMatter === 'front' ? classification.frontMatter :
                           fromMatter === 'main' ? classification.mainMatter : classification.backMatter;
        
        const oldIndex = matterArray.findIndex(doc => doc.filename === activeId);
        const newIndex = matterArray.findIndex(doc => doc.filename === overId);

        const newArray = arrayMove(matterArray, oldIndex, newIndex);
        
        setClassification(prev => prev ? {
          ...prev,
          [fromMatter === 'front' ? 'frontMatter' : fromMatter === 'main' ? 'mainMatter' : 'backMatter']: newArray
        } : null);
      }
    }
  };

  // Handle moving items between matter types
  const handleMoveToMatter = (docFilename: string, fromMatter: string, toMatter: string) => {
    if (!classification) return;

    const fromArray = fromMatter === 'front' ? classification.frontMatter :
                     fromMatter === 'main' ? classification.mainMatter : classification.backMatter;
    
    const toArray = toMatter === 'front' ? classification.frontMatter :
                   toMatter === 'main' ? classification.mainMatter : classification.backMatter;

    const docIndex = fromArray.findIndex(doc => doc.filename === docFilename);
    if (docIndex === -1) return;

    const doc = fromArray[docIndex];
    const newFromArray = [...fromArray];
    newFromArray.splice(docIndex, 1);

    const newToArray = [...toArray, doc];

    // Create the updated classification object
    const updatedClassification = {
      ...classification,
      [fromMatter === 'front' ? 'frontMatter' : fromMatter === 'main' ? 'mainMatter' : 'backMatter']: newFromArray,
      [toMatter === 'front' ? 'frontMatter' : toMatter === 'main' ? 'mainMatter' : 'backMatter']: newToArray
    };

    // Update the classification state
    setClassification(updatedClassification);

    // Update book data and validation using the updated classification
    const updatedBookData = convertToBookStructure(updatedClassification);
    setBookData(updatedBookData);
    const validationResult = validateImport(updatedBookData);
    setValidation(validationResult);
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
          {isDragActive ? t('bookBuilder.upload.dragDrop') : t('bookBuilder.upload.dragDrop')}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t('bookBuilder.upload.orClick')}
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }}>
          {t('bookBuilder.upload.chooseFile')}
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
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ py: 2 }}>
          {/* Instructions */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('bookBuilder.classification.title')}
            </Typography>
            <Typography variant="body2">
              {t('bookBuilder.classification.subtitle')}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" display="block">
                • <strong>{t('bookBuilder.classification.frontMatter')}:</strong> {t('bookBuilder.classification.frontMatterDesc')}
              </Typography>
              <Typography variant="caption" display="block">
                • <strong>{t('bookBuilder.classification.mainMatter')}:</strong> {t('bookBuilder.classification.mainMatterDesc')}
              </Typography>
              <Typography variant="caption" display="block">
                • <strong>{t('bookBuilder.classification.backMatter')}:</strong> {t('bookBuilder.classification.backMatterDesc')}
              </Typography>
            </Box>
          </Alert>

          {/* Essential Pages Notice */}
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              ✨ {t('bookBuilder.messages.systemPages')}
            </Typography>
            <Typography variant="body2">
              {t('bookBuilder.messages.languageNote', { language: classification?.metadata?.language || 'English' })}
            </Typography>
          </Alert>

          {/* Import Tip */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              {t('bookBuilder.messages.importTip')}
            </Typography>
          </Alert>
          
          <Typography variant="h6" gutterBottom>
            {t('bookBuilder.detectedBookStructure')}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('bookBuilder.dragToReorder')}
          </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('bookBuilder.bookMetadata')}
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
              📖 {getLocalizedSectionNamesObject(i18n.language).frontMatter} ({classification.frontMatter.length} sections)
            </Typography>
            <SortableContext 
              items={classification.frontMatter.map(doc => doc.filename)}
              strategy={verticalListSortingStrategy}
            >
              <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                {classification.frontMatter.map((doc) => (
                  <SortableItem
                    key={doc.filename}
                    id={doc.filename}
                    doc={doc}
                    matterType="front"
                    onMoveToMatter={handleMoveToMatter}
                    t={t}
                  />
                ))}
              </List>
            </SortableContext>
          </Paper>
        )}

        {/* Main Matter */}
        {classification.mainMatter.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              📚 {getLocalizedSectionNamesObject(i18n.language).mainMatter} ({classification.mainMatter.length} sections)
            </Typography>
            <SortableContext 
              items={classification.mainMatter.map(doc => doc.filename)}
              strategy={verticalListSortingStrategy}
            >
              <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                {classification.mainMatter.map((doc) => (
                  <SortableItem
                    key={doc.filename}
                    id={doc.filename}
                    doc={doc}
                    matterType="main"
                    onMoveToMatter={handleMoveToMatter}
                    t={t}
                  />
                ))}
              </List>
            </SortableContext>
          </Paper>
        )}

        {/* Back Matter */}
        {classification.backMatter.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              📝 {getLocalizedSectionNamesObject(i18n.language).backMatter} ({classification.backMatter.length} sections)
            </Typography>
            <SortableContext 
              items={classification.backMatter.map(doc => doc.filename)}
              strategy={verticalListSortingStrategy}
            >
              <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                {classification.backMatter.map((doc) => (
                  <SortableItem
                    key={doc.filename}
                    id={doc.filename}
                    doc={doc}
                    matterType="back"
                    onMoveToMatter={handleMoveToMatter}
                    t={t}
                  />
                ))}
              </List>
            </SortableContext>
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
      </DndContext>
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
          📚 <Typography variant="h6">{t('bookBuilder.title')}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {[
            t('bookBuilder.steps.upload'),
            t('bookBuilder.steps.review'),
            t('bookBuilder.steps.import')
          ].map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && renderUploadStep()}
        {activeStep === 1 && renderClassificationStep()}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {t('bookBuilder.actions.cancel')}
        </Button>
        
        {activeStep === 1 && (
          <>
            <Button onClick={() => setActiveStep(0)}>
              {t('bookBuilder.actions.back')}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleImport}
              disabled={!validation?.isValid}
              startIcon={<CheckIcon />}
            >
              {t('bookBuilder.actions.import')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookBuilderModal;
