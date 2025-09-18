import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'; // Yancy Dennis
// Narrow area keys to string to avoid symbol-to-string issues in template literals

import { sanitizeHtml } from '../utils/sanitizeHtml';
import WordCountDisplay from './WordCountDisplay';

import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tooltip,
  Alert, Snackbar, CircularProgress,
  Paper, ToggleButtonGroup, ToggleButton,
  ListSubheader, Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,

  ImportExport as ImportExportIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  ViewAgenda as ViewAgendaIcon,
  Visibility as VisibilityIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  InsertLink as InsertLinkIcon,
  Code as CodeIcon,
  FormatQuote as FormatQuoteIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import ImageSlotPurchaseModal from './ImageSlotPurchaseModal';
import { http } from '../services/http';
import { ENV } from '../config/env';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import tokenManager from '../utils/tokenManager';
import { getLocalizedBookStructure, getLocalizedMetadata, generateCopyrightNotice, getLocalizedSectionNamesObject, getLocalizedUI } from '../utils/bookStructureLocalization';
import Papa from 'papaparse';

import ExportModal, { ExportSettings } from './ExportModal';
import ImportModal, { ImportSettings } from './ImportModal';
import { ExportService } from '../services/ExportService';
import { realImageService } from '../services/realImageService';
import ReorderableSection from './ReorderableSection';
import { FormatAdapter } from '../services/FormatAdapter';
import { TEMPLATES } from '../constants/FormatConstants';
type Area = 'front' | 'main' | 'back';

// Simple project workspace component
interface ProjectWorkspaceProps {
  projectId: string;
}

// Type for API responses
interface ImportResponse {
  markdown: string;
  success: boolean;
  message: string;
  [key: string]: any;
}

interface ProjectApiResponse {
  project?: {
    title: string;
    content?: Record<string, string>;
    author?: string;
    subtitle?: string;
    isbn?: string;
    structure?: {
      front: string[];
      main: string[];
      back: string[];
    };
    createdVia?: string;
    // add other fields as needed
  };
  data?: {
    title: string;
    content?: Record<string, string>;
    author?: string;
    subtitle?: string;
    isbn?: string;
    structure?: {
      front: string[];
      main: string[];
      back: string[];
    };
    createdVia?: string;
    // add other fields as needed
  };
  title?: string;
  content?: Record<string, string>;
  author?: string;
  subtitle?: string;
  isbn?: string;
  structure?: {
    front: string[];
    main: string[];
    back: string[];
  };
  createdVia?: string;
  [key: string]: any;
}

// Define API URL
const API_URL = process.env.REACT_APP_EXPORT_API_URL || 'https://publishjockey-export.onrender.com';

// Define ProjectWorkspace component properly
const ProjectWorkspace = ({ projectId }: ProjectWorkspaceProps): React.ReactElement => {
  // ProjectWorkspace rendered
  
  // Track component lifecycle
  useEffect(() => {
    // ProjectWorkspace mounted
    return () => {
      // ProjectWorkspace unmounted
    };
  }, [projectId]);
  
  // Get localized book structure and section names
  const { i18n } = useTranslation();
  
  // Use UI language for sidebar translations - simplified approach to avoid conflicts
  // Yancy Dennis - Portuguese localization fix: Use UI language instead of separate documentLanguage
  const sidebarLanguage = i18n.language || 'en';
  
  // Using UI language for sidebar localization
  
  // Language-specific debugging removed for performance
  
  // Get section names for sidebar headers - use simple English labels for now
  // Yancy Dennis - Portuguese localization fix: Individual section names now display in Portuguese
  // Programs to push: frontend, export-backend
  // NOTE: Now using UI language (i18n.language) instead of separate documentLanguage setting
  // Get localized section names based on current language
  const sectionNames = getLocalizedSectionNamesObject(i18n.language);
  
  // Get localized UI text for editor interface
  const uiText = getLocalizedUI(i18n.language);
  
  // Approach 2: No system-generated content after book creation
  // This function is no longer needed as we don't modify structure after loading
  
  // Structure state - use localized structure as default
  const [structure, setStructure] = useState(() => {
    // Initialize with the current language's structure
    const initialStructure = getLocalizedBookStructure(sidebarLanguage);
    // Initial structure set
    // Ensure structure is valid
    if (!initialStructure || !initialStructure.front || !initialStructure.main || !initialStructure.back) {
      // Invalid structure, using fallback
      return getLocalizedBookStructure('en');
    }
    return initialStructure;
  });
  

  
  const [selected, setSelected] = useState<{ area: Area; idx: number } | null>(null);
  const [expanded, setExpanded] = useState({ front: true, main: true, back: true });
  const [editing, setEditing] = useState<{ area: Area; idx: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editingProjectName, setEditingProjectName] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState('');
  
  // Content state
  const [content, setContent] = useState<Record<string, string>>({});
  
  // Track if this is a BookBuilder project
  const [isBookBuilderProject, setIsBookBuilderProject] = useState(false);
  
  // Detect document language from project structure (for copyright generation)
  // Use useMemo to avoid recalculating on every render
  const documentLanguage = useMemo(() => {
    // Check if structure has localized section names
    const firstFrontSection = structure.front?.[0];
    const firstMainSection = structure.main?.[0];
    

    // Common patterns to detect language from structure - using EXACT matches from structure data
    // European Languages
    if (firstFrontSection?.includes('Pagina del titolo') || firstMainSection?.includes('Capitolo')) return 'it'; // Italian
    if (firstFrontSection?.includes('Naslovna Stranica') || firstMainSection?.includes('Poglavlje')) return 'hr'; // Croatian  
    if (firstFrontSection?.includes('Σελίδα Τίτλου') || firstMainSection?.includes('Κεφάλαιο')) return 'el'; // Greek
    if (firstFrontSection?.includes('Ihu Akwukwo') || firstMainSection?.includes('Isi')) return 'ig'; // Igbo
    if (firstFrontSection?.includes('Página de título') || firstMainSection?.includes('Capítulo')) return 'es'; // Spanish
    if (firstFrontSection?.includes('Page de titre') || firstMainSection?.includes('Chapitre')) return 'fr'; // French
    if (firstFrontSection?.includes('Titelseite') || firstMainSection?.includes('Kapitel')) return 'de'; // German
    if (firstFrontSection?.includes('Titulní Strana') || firstMainSection?.includes('Kapitola')) return 'cs'; // Czech
    if (firstFrontSection?.includes('Pagina de titlu') || firstMainSection?.includes('Capitol')) return 'ro'; // Romanian
    if (firstFrontSection?.includes('Titelpagina') || firstMainSection?.includes('Hoofdstuk')) return 'nl'; // Dutch
    if (firstFrontSection?.includes('Strona Tytułowa') || firstMainSection?.includes('Rozdział')) return 'pl'; // Polish
    if (firstFrontSection?.includes('Titelsida') || firstMainSection?.includes('Kapitel')) return 'sv'; // Swedish
    if (firstFrontSection?.includes('Titelside') || firstMainSection?.includes('Kapitel')) return 'da'; // Danish
    if (firstFrontSection?.includes('Tittelside') || firstMainSection?.includes('Kapittel')) return 'no'; // Norwegian
    if (firstFrontSection?.includes('Otsikkosivu') || firstMainSection?.includes('Luku')) return 'fi'; // Finnish
    if (firstFrontSection?.includes('Titilsíða') || firstMainSection?.includes('Kafli')) return 'is'; // Icelandic
    if (firstFrontSection?.includes('Página de Título') || firstMainSection?.includes('Capítulo')) return 'pt'; // Portuguese
    if (firstFrontSection?.includes('Титульная страница') || firstMainSection?.includes('Глава')) return 'ru'; // Russian
    if (firstFrontSection?.includes('Címlap') || firstMainSection?.includes('Fejezet')) return 'hu'; // Hungarian
    if (firstFrontSection?.includes('Pàgina de títol') || firstMainSection?.includes('Capítol')) return 'ca'; // Catalan
    if (firstFrontSection?.includes('Pagina de títol') || firstMainSection?.includes('Capítol')) return 'oc'; // Occitan
    
    // African Languages
    if (firstFrontSection?.includes('Shafin Taken') || firstMainSection?.includes('Babi na')) return 'ha'; // Hausa
    if (firstFrontSection?.includes('Ihu Akwukwo') || firstMainSection?.includes('Isi')) return 'ig'; // Igbo
    if (firstFrontSection?.includes('Ukurasa wa Kichwa') || firstMainSection?.includes('Sura ya')) return 'sw'; // Swahili
    if (firstFrontSection?.includes('Ojú-ìwé Àkọlé') || firstMainSection?.includes('Orí')) return 'yo'; // Yoruba
    if (firstFrontSection?.includes('Ikhasi Lesihloko') || firstMainSection?.includes('Isahluko')) return 'zu'; // Zulu
    if (firstFrontSection?.includes('Iphepha Lesihloko') || firstMainSection?.includes('Isahluko')) return 'xh'; // Xhosa
    if (firstFrontSection?.includes('Leqephe la Sehlooho') || firstMainSection?.includes('Khaolo')) return 'st'; // Southern Sotho
    if (firstFrontSection?.includes('Letlakala la Sehloko') || firstMainSection?.includes('Kgaolo')) return 'nso'; // Northern Sotho
    if (firstFrontSection?.includes('Tsebe ya Setlhogo') || firstMainSection?.includes('Kgaolo')) return 'tn'; // Tswana
    if (firstFrontSection?.includes('Mũrango wa Rĩĩtwa') || firstMainSection?.includes('Gĩthemba')) return 'ki'; // Kikuyu
    if (firstFrontSection?.includes('Urupapuro rw\'Umutwe') || firstMainSection?.includes('Igice cya')) return 'rw'; // Kinyarwanda
    if (firstFrontSection?.includes('Urupapuro rw\'Umutwe') || firstMainSection?.includes('Umutwe wa')) return 'rn'; // Kirundi
    if (firstFrontSection?.includes('Lupapula lw\'Omutwe') || firstMainSection?.includes('Essuula')) return 'lg'; // Luganda
    if (firstFrontSection?.includes('Pejin\'ny Lohateny') || firstMainSection?.includes('Toko')) return 'mg'; // Malagasy
    if (firstFrontSection?.includes('Peji reMusoro') || firstMainSection?.includes('Chitsauko')) return 'sn'; // Shona
    
    // Asian Languages
    if (firstFrontSection?.includes('صفحة العنوان') || firstMainSection?.includes('الفصل الأول')) return 'ar'; // Arabic
    if (firstFrontSection?.includes('தலைப்பு பக்கம்') || firstMainSection?.includes('அத்தியாயம்')) return 'ta'; // Tamil
    if (firstFrontSection?.includes('शीर्षक पृष्ठ') || firstMainSection?.includes('अध्याय')) return 'hi'; // Hindi
    if (firstFrontSection?.includes('শিরোনাম পৃষ্ঠা') || firstMainSection?.includes('অধ্যায়')) return 'bn'; // Bengali
    if (firstFrontSection?.includes('શીર્ષક પૃષ્ઠ') || firstMainSection?.includes('પ્રકરણ')) return 'gu'; // Gujarati
    if (firstFrontSection?.includes('శీర్షిక పేజీ') || firstMainSection?.includes('అధ్యాయం')) return 'te'; // Telugu
    if (firstFrontSection?.includes('ಶೀರ್ಷಿಕೆ ಪುಟ') || firstMainSection?.includes('ಅಧ್ಯಾಯ')) return 'kn'; // Kannada
    if (firstFrontSection?.includes('തലക്കെട്ട് പേജ്') || firstMainSection?.includes('അധ്യായം')) return 'ml'; // Malayalam
    if (firstFrontSection?.includes('ਸਿਰਲੇਖ ਸਫ਼ਾ') || firstMainSection?.includes('ਅਧਿਆਇ')) return 'pa'; // Punjabi
    if (firstFrontSection?.includes('ଶୀର୍ଷକ ପୃଷ୍ଠା') || firstMainSection?.includes('ଅଧ୍ୟାୟ')) return 'or'; // Odia
    if (firstFrontSection?.includes('Judul') || firstMainSection?.includes('Bab')) return 'id'; // Indonesian
    if (firstFrontSection?.includes('Tajuk') || firstMainSection?.includes('Bab')) return 'ms'; // Malaysian
    if (firstFrontSection?.includes('Tiêu đề') || firstMainSection?.includes('Chương')) return 'vi'; // Vietnamese
    if (firstFrontSection?.includes('Pamagat') || firstMainSection?.includes('Kabanata')) return 'tl'; // Filipino
    
    // Fallback to UI language if no pattern matches
    return sidebarLanguage;
  }, [structure, sidebarLanguage]);
  
  // Import state
  const [importOpen, setImportOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  
  // Basic UI state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState('Processing export...');
  
  // Global export loading state (separate from modal loading)
  const [globalExportLoading, setGlobalExportLoading] = useState(false);
  const [globalExportFormat, setGlobalExportFormat] = useState<string>('');
  
  // Editor state
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [recentlyImported, setRecentlyImported] = useState(false);
  // Estimate pages from current content (similar heuristic to backend: ~350 words/page)
  const estimatedPages = useMemo(() => {
    try {
      const totalWords = Object.values(content).reduce((sum, text) => {
        if (!text) return sum;
        // Split on whitespace and filter empty tokens
        const words = text.split(/\s+/).filter(Boolean);
        return sum + words.length;
      }, 0);
      return Math.ceil(totalWords / 350) || 0;
    } catch {
      return 0;
    }
  }, [content]);

  
  // Use navigation state for initial title if available
  const location = useLocation();
  const initialTitle = location.state?.title || '';
  const [projectTitle, setProjectTitle] = useState(initialTitle);
  const [projectCreatedAt, setProjectCreatedAt] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<string | null>(null);
  const [userWordLimit, setUserWordLimit] = useState<number | null>(null);
  const [isOverWordLimit, setIsOverWordLimit] = useState(false);
  const [wordCountRefreshTrigger, setWordCountRefreshTrigger] = useState(0);
  const [projectSubtitle, setProjectSubtitle] = useState('');
  const [projectAuthor, setProjectAuthor] = useState('');
  
  // Add state for metadata dialog and custom title page toggle
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  
  // Add state for instructions modal
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  
  // Add state for image purchase modal
  const [showImagePurchaseModal, setShowImagePurchaseModal] = useState(false);
  
  // Add state for ISBN
  const [projectIsbn, setProjectIsbn] = useState('');
  
  // State for project title
  const [loadingProject, setLoadingProject] = useState(true);
  const [structureLoaded, setStructureLoaded] = useState(true); // Start as true since we initialize with valid structure

  // Update structure when document language changes - BUT ONLY if no database structure was loaded
  useEffect(() => {
    // DON'T override structure if we've already loaded one from the database
    if (structureLoaded) {
      // Skipping structure update - database structure loaded
      return;
    }
    
    const newLocalizedStructure = getLocalizedBookStructure(sidebarLanguage);
    // Updating structure for new language
    setStructure(newLocalizedStructure);
  }, [sidebarLanguage, structureLoaded]); // Yancy Dennis - Portuguese localization fix: Removed i18n.language from fetchProject dependencies
  
  // Get auth token from context
  const { currentUser } = useAuth();
  const token = tokenManager.getAccessToken();
  
  // Add ref for debounce timer at the component top level
  const debouncedSave = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Add a reference to the editor textarea
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  
  // Add ref to track if we've already done initial cleanup
  const initialCleanupDone = useRef<boolean>(false);
  
  // Add state for notifications if not already present
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  
  useEffect(() => {
    async function fetchProject() {
      // Fetching project data
      setLoadingProject(true);

      try {
        // Use token from context instead of localStorage
        const res = await http.get<ProjectApiResponse>(`${ENV.API_URL}/projects/${projectId}`);
        
        // Project data received
        
        // Handle different API response structures (data vs project property)
        const projectData = res.data.project || res.data.data || res.data;
        
        // Set project title
        setProjectTitle(projectData.title || 'Untitled Book');
        setProjectCreatedAt((projectData as any).createdAt || (projectData as any).created_at || null);
        
        // Load metadata from backend if available
        if (projectData.author) {
          setProjectAuthor(projectData.author);
        }
        if (projectData.subtitle) {
          setProjectSubtitle(projectData.subtitle);
        }
        if (projectData.isbn) {
          setProjectIsbn(projectData.isbn);
        }
        
        // Load content from backend if available
        if (projectData.content) {
          // Loading content from backend
          // Approach 2: Use content exactly as stored in backend - no filtering
          setContent(projectData.content);
        } else {
          // No content found in project data
        }
        
        // Load structure from backend if available
        if (projectData.structure) {
          // Loading structure from backend
          
          // Check if this is a BookBuilder project (has createdVia field OR non-default section names)
          const isBookBuilderImport = projectData.createdVia === 'book-builder';
          setIsBookBuilderProject(isBookBuilderImport);
          
          // Fallback: Check if structure has non-default Spanish section names (BookBuilder indicator)
          const hasSpanishSections = projectData.structure.main?.some(section => 
            section.includes('campanario') || section.includes('Grande') || section.includes('puente')
          ) || projectData.structure.front?.some(section => 
            section === 'Introducción' // Spanish section with accent
          );
          
          const isBookBuilderFallback = isBookBuilderImport || hasSpanishSections;
          // Checking if BookBuilder project
          
          if (isBookBuilderFallback) {
            // BookBuilder project detected - preserving imported structure
            
            // Always use the backend structure for BookBuilder projects
            // This preserves the actual imported section names
            setStructure(projectData.structure);
          } else {
            // For regular projects, use the existing logic
            const currentLocalizedStructure = getLocalizedBookStructure(documentLanguage);
            
            // Check if the backend structure has more sections than the default template
            const backendSectionCount = (projectData.structure.front?.length || 0) + 
                                       (projectData.structure.main?.length || 0) + 
                                       (projectData.structure.back?.length || 0);
            const localizedSectionCount = (currentLocalizedStructure.front?.length || 0) + 
                                         (currentLocalizedStructure.main?.length || 0) + 
                                         (currentLocalizedStructure.back?.length || 0);
            
            // Only use backend structure if it has MORE sections than the localized template
            if (backendSectionCount > localizedSectionCount) {
              // Using backend structure (contains custom sections)
              setStructure(projectData.structure);
            } else {
              // Keep the localized structure that was set during initialization
            }
          }
          
          setStructureLoaded(true);
          
          // Debug: Check what structure is actually set after BookBuilder processing
          // Structure processing completed
        } else {
          // No structure in backend, keeping default
          setStructureLoaded(true);
        }
        
        // Approach 2: No system-generated content after book creation
        // The structure loaded from the backend is the final structure
        // Users must manually add any new sections they want
      } catch (err) {
        console.error('Project fetch error:', err);

        setProjectTitle('');
      } finally {
        setLoadingProject(false);
      }
    }
    // Fetch project effect
    if (projectId && token) fetchProject();
  }, [projectId, token, currentUser]);

  // Debug structure changes
  useEffect(() => {
    // Structure state changed
  }, [structure]);

  // Yancy Dennis - Fixed missing categories and duplicate entries with comprehensive solution:
  // 1. Adding i18n.language to fetchProject useEffect dependencies
  // 2. Adding structureLoaded state to prevent rendering empty structure
  // 3. Adding validation checks for structure integrity
  // 4. Adding loading state for structure rendering
  // 5. Implemented smart deduplication system that handles all English-to-localized mappings
  // 6. Comprehensive mapping of all possible English variations to localized equivalents
  // 7. Smart content synchronization that prevents English duplicates when localized versions exist
  // 8. Intelligent content filtering that maintains only the appropriate localized versions

  // Load user subscription and word limit
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        setUserSubscription(u.subscription || null);
      }
    } catch {}

    // Fetch word limit from API
    const fetchWordLimit = async () => {
      try {
        const response = await http.get(`${ENV.API_URL}/users/me/subscription`);
        if (response.data.success) {
          setUserWordLimit(response.data.wordLimit);
        }
      } catch (error) {
        console.error('Error fetching word limit:', error);
      }
    };

    if (token) {
      fetchWordLimit();
    }
  }, [token]);

  // Helper function to refresh word count
  const refreshWordCount = () => {
    setWordCountRefreshTrigger(prev => prev + 1);
  };
  
  // Autosave content to backend whenever it changes
  useEffect(() => {
    if (!projectId || !token || !currentUser) return;
    
    // Create a function to handle the actual save
    const saveContent = async () => {
      try {
        // Executing autosave for content sections
        
        // Track autosave start time for performance monitoring
        const startTime = Date.now();
        
        const response = await http.put<ProjectApiResponse>(`${ENV.API_URL}/projects/${projectId}`, {
          title: projectTitle,
          content,
          structure, // Include structure in the save
          author: projectAuthor,
          subtitle: projectSubtitle,
          isbn: projectIsbn
        });
        
        // Calculate save duration
        const duration = Date.now() - startTime;
        
        // Verify the save was truly successful by checking returned data
        if (response.data.project && response.data.project.content) {
          const savedContentKeys = Object.keys(response.data.project.content);
          const originalContentKeys = Object.keys(content);
          
          if (savedContentKeys.length !== originalContentKeys.length) {
            console.warn('⚠️ Autosave may be incomplete. Saved content has different number of sections:', {
              originalSections: originalContentKeys.length,
              savedSections: savedContentKeys.length 
            });
          }
        } else if (response.data.data && response.data.data.content) {
          // Alternative response structure
          const savedContentKeys = Object.keys(response.data.data.content);
          const originalContentKeys = Object.keys(content);
          
          if (savedContentKeys.length !== originalContentKeys.length) {
            console.warn('⚠️ Autosave may be incomplete. Saved content has different number of sections:', {
              originalSections: originalContentKeys.length,
              savedSections: savedContentKeys.length 
            });
          }
        } else {
          console.warn('⚠️ Autosave response does not include content verification');
        }
        
        // Refresh word count after successful autosave
        refreshWordCount();
      } catch (err: any) {
        console.error('Autosave failed:', err);
        
        // Show more detailed error information
        if (err.response) {
          console.error('Server error response:', {
            status: err.response.status,
            data: err.response.data
          });
          
          // Check for word limit error
          if (err.response.status === 400 && err.response?.data?.message?.includes('word limit')) {
            const data = err.response.data;
            let errorMessage;
            if (data.data?.wordsOver) {
              errorMessage = `⚠️ Content exceeds the 10,000-word limit by ${data.data.wordsOver.toLocaleString()} words. Autosave paused - please remove some content to continue.`;
            } else {
              errorMessage = `⚠️ Content exceeds the 10,000-word limit for ebook subscriptions. Autosave paused - please reduce your content.`;
            }
            
            setNotification({
              open: true,
              message: errorMessage,
              severity: 'error'
            });
          }
          // If token is expired (401) or invalid, show a notification
          else if (err.response.status === 401) {
            alert('Your session has expired. Please log in again to continue saving your work.');
          }
        } else if (err.request) {
          console.error('No response received', err.request);
        } else {
          console.error('Error setting up request:', err.message);
        }
      }
    };
    
    // Clear any existing timer
    if (debouncedSave.current) {
      clearTimeout(debouncedSave.current);
    }
    
    // Set a new timer to debounce the save (wait 2 seconds after changes stop)
    debouncedSave.current = setTimeout(() => {
      saveContent();
    }, 2000);
    
    // Cleanup on unmount
    return () => {
      if (debouncedSave.current) {
        clearTimeout(debouncedSave.current);
      }
    };
  }, [content, structure, projectId, token, projectAuthor, projectSubtitle, projectIsbn, projectTitle]);
  
  // Keep editedProjectName in sync with projectTitle
  useEffect(() => {
    setEditedProjectName(projectTitle && projectTitle.trim() ? projectTitle : 'Untitled');
  }, [projectTitle]);


  
  // Prefill Copyright page when project loads or when author/language changes
  useEffect(() => {
    // Find copyright section in the current structure (it should be localized already)
    const copyrightSectionName = structure.front.find(section => 
      section.toLowerCase().includes('copyright') || 
      // European Languages
      section.toLowerCase().includes('droits') || // French
      section.toLowerCase().includes('derechos') || // Spanish
      section.toLowerCase().includes('direitos') || // Portuguese
      section.toLowerCase().includes('diritti') || // Italian
      section.toLowerCase().includes('drets') || // Catalan
      section.toLowerCase().includes('dreches') || // Occitan
      section.toLowerCase().includes('urheberrecht') || // German
      section.toLowerCase().includes('auteursrechten') || // Dutch
      section.toLowerCase().includes('prawa autorskie') || // Polish
      section.toLowerCase().includes('autorská práva') || // Czech
      section.toLowerCase().includes('upphovsrätt') || // Swedish
      section.toLowerCase().includes('ophavsret') || // Danish
      section.toLowerCase().includes('opphavsrett') || // Norwegian
      section.toLowerCase().includes('tekijänoikeus') || // Finnish
      section.toLowerCase().includes('höfundarréttur') || // Icelandic
      section.toLowerCase().includes('авторские права') || // Russian
      section.toLowerCase().includes('πνευματικά δικαιώματα') || // Greek
      section.toLowerCase().includes('szerzői jog') || // Hungarian
      section.toLowerCase().includes('autortiesības') || // Latvian
      section.toLowerCase().includes('autorių teisės') || // Lithuanian
      section.toLowerCase().includes('авторски права') || // Macedonian/Serbian
      section.toLowerCase().includes('autorské práva') || // Slovak
      section.toLowerCase().includes('avtorske pravice') || // Slovenian
      section.toLowerCase().includes('telif hakkı') || // Turkish
      section.toLowerCase().includes('autorska prava') || // Croatian
      section.toLowerCase().includes('drepturi de autor') || // Romanian
      section.toLowerCase().includes('autoriõigus') || // Estonian
      section.toLowerCase().includes('dereitos de autor') || // Galician
      // African Languages
      section.toLowerCase().includes('hakimiliki') || // Swahili
      section.toLowerCase().includes('haƙƙin') || // Hausa
      section.toLowerCase().includes('ikike') || // Igbo
      section.toLowerCase().includes('ẹ̀tọ́') || // Yoruba
      section.toLowerCase().includes('amalungelo') || // Zulu/Xhosa
      section.toLowerCase().includes('litokelo') || // Southern Sotho
      section.toLowerCase().includes('ditokelo') || // Northern Sotho
      section.toLowerCase().includes('ditshwanelo') || // Tswana
      section.toLowerCase().includes('kĩhooto') || // Kikuyu
      section.toLowerCase().includes('uburenganzira') || // Kinyarwanda/Kirundi
      section.toLowerCase().includes('eddembe') || // Luganda
      section.toLowerCase().includes('zo ara-javatra') || // Malagasy
      section.toLowerCase().includes('kodzero') || // Shona
      // Asian Languages
      section.toLowerCase().includes('حقوق النشر') || // Arabic
      section.toLowerCase().includes('பதிப்புரிமை') || // Tamil
      section.toLowerCase().includes('कॉपीराइट') || // Hindi
      section.toLowerCase().includes('কপিরাইট') || // Bengali
      section.toLowerCase().includes('કોપીરાઇટ') || // Gujarati
      section.toLowerCase().includes('కాపీరైట్') || // Telugu
      section.toLowerCase().includes('ಕೃತಿಸ್ವಾಮ್ಯ') || // Kannada
      section.toLowerCase().includes('പകർപ്പവകാശം') || // Malayalam
      section.toLowerCase().includes('ਕਾਪੀਰਾਈਟ') || // Punjabi
      section.toLowerCase().includes('କପିରାଇଟ୍') || // Odia
      section.toLowerCase().includes('hak cipta') || // Indonesian/Malaysian
      section.toLowerCase().includes('bản quyền') || // Vietnamese
      section.toLowerCase().includes('著作権') || // Japanese
      section.toLowerCase().includes('版权') || // Chinese
      section.toLowerCase().includes('저작권') || // Korean
      section.toLowerCase().includes('ลิขสิทธิ์') || // Thai
      section === 'Copyright' // Default fallback
    ) || 'Copyright';
    
    const copyrightKey = `front:${copyrightSectionName}`;
    
    // Check if copyright section exists in structure
    const copyrightExists = structure.front.includes(copyrightSectionName);
    if (!copyrightExists) {
      // Copyright section not found
      return;
    }

    // For BookBuilder imports, always generate copyright in the detected language
    // This ensures proper localized copyright even for imported books
    if (isBookBuilderProject) {

    }
    
    const currentCopyright = content[copyrightKey] || '';
    const authorName = projectAuthor && projectAuthor.trim() ? projectAuthor : '';
    // Debug: author information
    
    // Use document language for copyright generation (not UI language)
    // This ensures copyright is generated in the language of the book being written
    const copyrightLanguage = documentLanguage || 'en';
    // Using document language for copyright generation
    
    // Initialize copyright conditions
    const hasPlaceholders = currentCopyright.includes('{year}') || currentCopyright.includes('{author}') || currentCopyright.includes('[Author Name]');
    const hasEnglishCopyright = currentCopyright.includes('Copyright ©') && copyrightLanguage !== 'en';
    
    // For BookBuilder projects, always generate copyright in the detected language
    // For regular projects, use the existing logic
    let shouldRegenerate;
    if (isBookBuilderProject) {
      shouldRegenerate = !currentCopyright.trim(); // Only if no copyright exists

    } else {
      // Only regenerate if:
      // 1. No copyright exists (new project)
      // 2. Has template placeholders 
      // 3. Has English copyright in non-English book
      shouldRegenerate = !currentCopyright.trim() || hasPlaceholders || hasEnglishCopyright;
    }
    

    
    if (!shouldRegenerate) {

      return;
    }
    
    let defaultCopyright = '';
    
    if (authorName) {
      // Generate localized copyright notice with author (includes full text)


      defaultCopyright = generateCopyrightNotice(copyrightLanguage, authorName);


    } else {
      // Generate placeholder copyright for new projects without author
      const metadata = getLocalizedMetadata(copyrightLanguage);

      const placeholderCopyrightLine = metadata.copyright
        .replace('{year}', new Date().getFullYear().toString())
        .replace('{author}', '[Author Name]');
      const copyrightFull = metadata.copyrightFull || 'No part of this book may be reproduced in any form or by any electronic or mechanical means, including information storage and retrieval systems, without written permission from the author, except for the use of brief quotations in a book review.';
      defaultCopyright = `${placeholderCopyrightLine}\n\n${copyrightFull}`;



    }
    
    setContent(prev => ({
      ...prev,
      [copyrightKey]: defaultCopyright
    }));
    
  }, [projectAuthor, documentLanguage, structure.front, content, isBookBuilderProject]); // Run when author, language, structure, or BookBuilder status changes
  
  // Function to force copyright regeneration (called when metadata dialog closes)
  const regenerateCopyright = useCallback(() => {
    // Find copyright section name in the current structure
    const copyrightSectionName = structure.front.find(section => 
      section.toLowerCase().includes('copyright') || 
      section.toLowerCase().includes('droits') || // French
      section.toLowerCase().includes('derechos') || // Spanish
      section.toLowerCase().includes('direitos') || // Portuguese
      section.toLowerCase().includes('diritti') || // Italian
      section.toLowerCase().includes('urheberrecht') || // German
      section.toLowerCase().includes('hakimiliki') || // Swahili
      section.toLowerCase().includes('haƙƙin') || // Hausa
      section.toLowerCase().includes('ikike') || // Igbo
      section.toLowerCase().includes('ẹ̀tọ́') || // Yoruba
      section.toLowerCase().includes('amalungelo') || // Zulu/Xhosa
      section.toLowerCase().includes('litokelo') || // Southern Sotho
      section.toLowerCase().includes('ditokelo') || // Northern Sotho
      section.toLowerCase().includes('ditshwanelo') || // Tswana
      section.toLowerCase().includes('kĩhooto') || // Kikuyu
      section.toLowerCase().includes('uburenganzira') || // Kinyarwanda/Kirundi
      section.toLowerCase().includes('eddembe') || // Luganda
      section.toLowerCase().includes('zo ara-javatra') || // Malagasy
      section.toLowerCase().includes('kodzero') || // Shona
      section.toLowerCase().includes('πνευματικά') || // Greek
      section.toLowerCase().includes('版权') || // Chinese
      section.toLowerCase().includes('कॉपीराइट') || // Hindi
      section.toLowerCase().includes('प्रतिलिपि') || // Nepali
      section.toLowerCase().includes('著作権') || // Japanese
      section.toLowerCase().includes('авторское') || // Russian
      section.toLowerCase().includes('авторські') || // Ukrainian
      section.toLowerCase().includes('karapatang') || // Filipino
      section.includes('པར་དབང') || // Tibetan (no lowercase needed for Tibetan script)
      section === 'Copyright' // Default fallback
    ) || 'Copyright';
    
    const copyrightKey = `front:${copyrightSectionName}`;
    
    // Check if copyright section exists in structure
    const copyrightExists = structure.front.includes(copyrightSectionName);
    if (!copyrightExists) {

      return;
    }
    
    // Use the same language as the user selected in dashboard (like export modal does)
    const copyrightLanguage = i18n.language || 'en';
    const authorName = projectAuthor && projectAuthor.trim() ? projectAuthor : '';
    


    
    let defaultCopyright = '';
    
    if (authorName) {
      // Generate localized copyright notice with author (includes full text)
      defaultCopyright = generateCopyrightNotice(copyrightLanguage, authorName);

    } else {
      // Generate placeholder copyright for new projects without author
      const metadata = getLocalizedMetadata(copyrightLanguage);
      const placeholderCopyrightLine = metadata.copyright
        .replace('{year}', new Date().getFullYear().toString())
        .replace('{author}', '[Author Name]');
      const copyrightFull = metadata.copyrightFull || 'No part of this book may be reproduced in any form or by any electronic or mechanical means, including information storage and retrieval systems, without written permission from the author, except for the use of brief quotations in a book review.';
      defaultCopyright = `${placeholderCopyrightLine}\n\n${copyrightFull}`;

    }
    
    setContent(prev => ({
      ...prev,
      [copyrightKey]: defaultCopyright
    }));
  }, [projectAuthor, documentLanguage, structure.front]);
  
  // Standardize handleAdd function to work equally for all matter sections
  const handleAdd = (area: Area) => {
    // Create a dialog to get the section name
    const newSectionName = prompt(`Add a new section to ${area} matter`, '');
    
    if (newSectionName && newSectionName.trim() !== '') {
      // Add the section to the structure
      const updatedStructure = { ...structure };
      updatedStructure[area] = [...updatedStructure[area], newSectionName.trim()];
      setStructure(updatedStructure);
      
      // Create empty content for the new section - no system-generated text
      const contentKey = `${area}:${newSectionName.trim()}`;
      const defaultContent = ''; // Empty content - user decides what to write
      
      // Update local content state
      const updatedContent = { 
        ...content, 
        [contentKey]: defaultContent 
      };
      setContent(updatedContent);
      
      // Select the new section
      const newIdx = updatedStructure[area].length - 1;
      setSelected({ area, idx: newIdx });
      
      // Immediately save both structure and content to the backend in a single request

      
      // Show saving notification
      setNotification({
        open: true,
        message: 'Saving new section...',
        severity: 'info'
      });
      
      // Save to backend with explicit request
      http.put(`${ENV.API_URL}/projects/${projectId}`, {
        title: projectTitle,
        structure: updatedStructure,
        content: updatedContent,
        author: projectAuthor,
        subtitle: projectSubtitle,
        isbn: projectIsbn
      })
      .then(response => {

        setNotification({
          open: true,
          message: `New section "${newSectionName.trim()}" added and saved.`,
          severity: 'success'
        });
      })
      .catch(err => {
        console.error('Error saving new section:', err);
        setNotification({
          open: true,
          message: `Error saving new section. Please try again.`,
          severity: 'error'
        });
      });
    }
  };

  // Delete section
  const handleDelete = (area: Area, idx: number) => {
    const sectionName = structure[area][idx];
    
    // Prevent deletion of Title Page and Copyright in front matter
    if (area === 'front' && (sectionName === 'Title Page' || sectionName === 'Copyright')) {
      setNotification({
        open: true,
        message: `The ${sectionName} section cannot be deleted.`,
        severity: 'warning'
      });
      return;
    }
    
    // Create a new structure object to avoid reference issues
    const newStructure = JSON.parse(JSON.stringify(structure));
    
    // Remove the section from the structure
    newStructure[area] = newStructure[area].filter((_, i) => i !== idx);
    
    // Remove the content associated with the section
    const newContent = { ...content };
    delete newContent[`${area}:${sectionName}`];
    
    // Update state
    setStructure(newStructure);
    setContent(newContent);
    
    // Clear selection if the deleted section was selected
    if (selected && selected.area === area && selected.idx === idx) {
      setSelected(null);
    }
    
    // Save changes to backend
    saveStructureToBackend(newStructure);
  };

  // Start renaming
  const handleEdit = (area: Area, idx: number) => {
    setEditing({ area, idx });
    setEditValue(structure[area][idx]);
  };

  // Handle section reordering within the same matter area
  const handleReorder = (area: Area, newSections: string[]) => {

    
    // Create updated structure
    const updatedStructure = { ...structure };
    updatedStructure[area] = newSections;
    
    // Content keys don't need to change for reordering since they're based on section names
    
    // Update structure state
    setStructure(updatedStructure);
    
    // Save to backend
    saveStructureToBackend(updatedStructure);
    
    // Show feedback
    setNotification({
      open: true,
      message: `${area === 'front' ? 'Front' : area === 'main' ? 'Main' : 'Back'} matter sections reordered`,
      severity: 'success'
    });
  };

  // Save rename
  const handleEditSave = (area: Area, idx: number) => {
    const oldName = structure[area][idx];
    const updated = [...structure[area]];
    updated[idx] = editValue.trim() || updated[idx];
    setStructure({ ...structure, [area]: updated });
    // Move content to new key
    setContent((prev) => {
      const newContent = { ...prev };
      newContent[`${area}:${updated[idx]}`] = newContent[`${area}:${oldName}`] || '';
      delete newContent[`${area}:${oldName}`];
      return newContent;
    });
    setEditing(null);
  };

  // Handle expanding/collapsing sections
  const handleExpand = (area: Area) => {
    // Toggle the expanded state of the specific area
    setExpanded(prev => ({
      ...prev,
      [area]: !prev[area]
    }));
  };

  // Markdown editor handlers
  const handleContentChange = (area: Area, section: string, value: string) => {
    // Log more detailed information for debugging
    // Content changed for section
    
    setContent(prev => {
      // Create a new content object with the updated value
      const newContent = { ...prev, [`${area}:${section}`]: value };
      
      // Trigger immediate save for this content by clearing and setting the timeout
      if (debouncedSave.current) {
        clearTimeout(debouncedSave.current);
      }
      
      // Double check that the content was actually updated
      if (prev[`${area}:${section}`] !== value) {

        
        debouncedSave.current = setTimeout(() => {
          // Show a brief "Saving..." notification
          setNotification({
            open: true,
            message: 'Saving changes...',
            severity: 'info'
          });
          
          // Create a backup of the content first
          const contentBackup = JSON.stringify(newContent);

          
          // Debug: Log what we're sending
          // Sending content to backend

          // Call the autosave function directly using the new content
          http.put(`${ENV.API_URL}/projects/${projectId}`, {
            title: projectTitle, // Add the title to fix validation error
            content: newContent,
            structure, // Include structure in the save
            author: projectAuthor,
            subtitle: projectSubtitle,
            isbn: projectIsbn,
            // Add a timestamp to ensure the request is unique
            _timestamp: Date.now()
          }).then(response => {
            // Content saved successfully
            
            setNotification({
              open: true,
              message: 'Content saved successfully',
              severity: 'success'
            });
          }).catch(err => {
            console.error('Error saving content:', err);
            
            // Log more detailed error information
            if (err.response) {
              console.error('Server error:', {
                status: err.response.status,
                data: err.response.data,
                headers: err.response.headers
              });
            }
            
            setNotification({
              open: true,
              message: 'Error saving content. Please try again.',
              severity: 'error'
            });
          });
        }, 1500); // Slightly shorter debounce (1.5 seconds)
      } else {

      }
      
      return newContent;
    });
  };
  



  // Handle export from modal
  const handleExportModalSubmit = (settings: ExportSettings) => {

    // Call the main export function with the format from settings
    handleExport(settings.format, settings);
  };

  // Enhanced export handler with special title page handling
  const handleExport = async (format: string, settings: ExportSettings) => {

    
    setExportLoading(true);
    setExportProgress('Preparing export...');
    
    try {
      // First, make sure all content is saved
      try {
        setExportProgress('Saving changes...');
        setNotification({
          open: true,
          message: 'Saving all changes before export...',
          severity: 'info'
        });
        
        // Cancel any pending autosaves
        if (debouncedSave.current) {
          clearTimeout(debouncedSave.current);
          debouncedSave.current = null;
        }
        
        // Do a full save
        await http.put(`${ENV.API_URL}/projects/${projectId}`, {
          title: projectTitle, // Add the title to fix validation error
          content,
          structure,
          author: projectAuthor,
          subtitle: projectSubtitle,
          isbn: projectIsbn,
          _forceSave: true,
          _timestamp: Date.now()
        });
        

      } catch (saveError: any) {
        console.error('Error saving content before export:', saveError);
        
        // Check if it's a word limit error
        let errorMessage = 'There was an error saving your content before export. Do you want to continue anyway?';
        let allowContinue = true;
        
        if (saveError.response?.status === 400 && saveError.response?.data?.message?.includes('word limit')) {
          const data = saveError.response.data;
          if (data.data?.wordsOver) {
            errorMessage = `Cannot export: Content exceeds the 10,000-word limit by ${data.data.wordsOver.toLocaleString()} words. Please reduce your content before exporting.`;
          } else {
            errorMessage = `Cannot export: Content exceeds the 10,000-word limit for ebook subscriptions. Please reduce your content before exporting.`;
          }
          allowContinue = false;
        }
        
        if (allowContinue) {
          if (!window.confirm(errorMessage)) {
            setExportLoading(false);
            return;
          }
        } else {
          // For word limit errors, just show alert and stop
          alert(errorMessage);
          setExportLoading(false);
          return;
        }
      }
      
      // Validate export server is running
      try {
        setExportProgress('Connecting to export server...');
        const response = await fetch(`/health`, { 
          method: 'GET', 
          headers: { 'Content-Type': 'application/json' } 
        });
        if (response.status !== 200) {
          throw new Error('Export backend is not available');
        }
      } catch (err) {
        console.error('Export backend check failed:', err);
        setNotification({
          open: true,
          message: 'Export backend is not available. Please start the export server.',
          severity: 'error'
        });
        setExportLoading(false);
        return;
      }
      
      // Close the modal and show global loading indicator after initial validation
      setExportLoading(false);
      setExportDialogOpen(false);
      setGlobalExportLoading(true);
      setGlobalExportFormat(format);
      
      // Set format-specific progress message
      if (format === 'pdf') {
        setExportProgress('Processing images and generating PDF...');
      } else if (format === 'epub') {
        setExportProgress('Creating EPUB structure...');
      } else if (format === 'docx') {
        setExportProgress('Generating Word document...');
      } else {
        setExportProgress('Processing export...');
      }
      
      // Ensure we have title
      if (!projectTitle) {
        setNotification({
          open: true,
          message: 'Project title is required for export. Please set it in the metadata dialog.',
          severity: 'error'
        });
        setExportLoading(false);
        return;
      }
      
      // Create export payload with sections in the correct order from structure state
      const project = {
        id: projectId,
        title: projectTitle,
        subtitle: projectSubtitle || '',
        author: projectAuthor || '',
        sections: []
      };

      // Build sections in order based on structure
      ['front', 'main', 'back'].forEach(area => {
        structure[area as Area].forEach(sectionName => {
          const key = `${area}:${sectionName}`;
          if (content[key] && content[key].trim() !== '') {
            project.sections.push({
              id: key,
              title: sectionName,
              content: content[key],
              level: 0,
              matter: area
            });
          }
        });
      });
      


      
      // Export the project using the ExportService
      try {
        const fileUrl = await ExportService.exportProject(project, {
          ...settings,
          format: format as 'pdf' | 'epub' | 'html' | 'docx',
          // Add subtitle and explicitly set setting to use frontend title page
          includeTitlePage: true,
          useAutomaticTitlePage: false, // Use the Title Page from content, not auto-generated
          subtitle: projectSubtitle || '',
          author: projectAuthor || '',
          isbn: projectIsbn || ''
        });
        

        
      } catch (error: any) {
        console.error('Export service error:', error);
        setNotification({
          open: true,
          message: `Export failed: ${error.message || 'Unknown error'}`,
          severity: 'error'
        });
      }
      
    } catch (err: any) {
      console.error('Export error:', err);
      setNotification({
        open: true,
        message: `Export error: ${err.message || 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setExportLoading(false);
      setExportProgress('Processing export...');
      setGlobalExportLoading(false);
      setGlobalExportFormat('');
    }
  };
  
  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Helper function to show drag-and-drop helper notification

  
  // Helper function to parse markdown into sections based on headings
  const parseMarkdownIntoSections = (markdown: string): Record<string, string> => {
    const result: Record<string, string> = {};
    
    // Handle YAML front matter if present
    let markdownWithoutFrontMatter = markdown;
    if (markdown.startsWith('---')) {
      const endOfFrontMatter = markdown.indexOf('---', 3);
      if (endOfFrontMatter !== -1) {
        const frontMatter = markdown.substring(0, endOfFrontMatter + 3);
        markdownWithoutFrontMatter = markdown.substring(endOfFrontMatter + 3).trim();
        
        // Extract metadata from front matter
        const titleMatch = frontMatter.match(/title:\s*"([^"]+)"/);
        const authorMatch = frontMatter.match(/author:\s*"([^"]+)"/);
        const subtitleMatch = frontMatter.match(/subtitle:\s*"([^"]+)"/);
        
        if (titleMatch) setProjectTitle(titleMatch[1]);
        if (authorMatch) setProjectAuthor(authorMatch[1]);
        if (subtitleMatch) setProjectSubtitle(subtitleMatch[1]);
      }
    }
    
    // Split by top-level headings (# heading)
    const sectionRegex = /^# (.+)$/gm;
    const sections: Array<{ title: string, content: string, index: number }> = [];
    let match;
    
    while ((match = sectionRegex.exec(markdownWithoutFrontMatter)) !== null) {
      sections.push({
        title: match[1].trim(),
        content: '',  // Will fill this later
        index: match.index
      });
    }
    
    // Get content for each section
    for (let i = 0; i < sections.length; i++) {
      const startIdx = sections[i].index;
      const endIdx = i < sections.length - 1 ? sections[i + 1].index : markdownWithoutFrontMatter.length;
      sections[i].content = markdownWithoutFrontMatter.substring(startIdx, endIdx).trim();
    }
    
    // Debug log


    
    // Create index-based map of all sections in the structure for ordered lookup
    // This preserves the correct order from the structure
    const orderedSectionMap: Record<string, { area: string, name: string, order: number }> = {};
    
    ['front', 'main', 'back'].forEach(area => {
      structure[area as Area].forEach((sectionName, idx) => {
        // Calculate a global order number to preserve sequence across all areas
        const orderBase = area === 'front' ? 0 : 
                         area === 'main' ? 1000 : 2000;
        const order = orderBase + idx;
        
        // Store both original and lowercase versions for matching
        const key = `${area}:${sectionName.toLowerCase()}`;
        orderedSectionMap[key] = { area, name: sectionName, order };
        
        // Add special aliases for common section names to improve matching
        if (sectionName.toLowerCase() === 'title page') {
          orderedSectionMap[`${area}:title`] = { area, name: sectionName, order };
        }
        if (sectionName.toLowerCase() === 'introduction') {
          orderedSectionMap[`${area}:intro`] = { area, name: sectionName, order };
        }
        if (sectionName.toLowerCase() === 'disclaimer') {
          orderedSectionMap[`${area}:disclaimer`] = { area, name: sectionName, order };
        }
        if (sectionName.toLowerCase() === 'acknowledgments') {
          orderedSectionMap[`${area}:acknowledgment`] = { area, name: sectionName, order };
          orderedSectionMap[`${area}:acknowledgements`] = { area, name: sectionName, order };
        }
        
        // For main matter chapters, also store versions with chapter prefixes
        if (area === 'main' && sectionName.match(/^Chapter \d+$/i)) {
          const chapterNum = sectionName.match(/\d+/)?.[0] || '';
          // Handle both "Chapter 1" and "Chapter 1: Title" format
          orderedSectionMap[`${area}:chapter ${chapterNum}`] = { area, name: sectionName, order };
          orderedSectionMap[`${area}:chapter ${chapterNum}:`] = { area, name: sectionName, order };
        }
      });
    });
    

    
    // Create an array to hold matched sections with their ordering info
    const matchedSections: Array<{
      key: string;
      content: string;
      order: number;
      matched: boolean;
    }> = [];
    
    // Match sections to structure using the ordered section map
    sections.forEach(section => {
      const sectionTitle = section.title.trim();
      const sectionLowercase = sectionTitle.toLowerCase();
      let matched = false;
      
      // Try each area for matching to find the best section
      ['front', 'main', 'back'].forEach(area => {
        // Skip if already matched
        if (matched) return;
        
        // Check for exact match in the current area
        const exactMatchKey = `${area}:${sectionLowercase}`;
        if (orderedSectionMap[exactMatchKey]) {
          const { name, order } = orderedSectionMap[exactMatchKey];
          matchedSections.push({
            key: `${area}:${name}`,
            content: section.content,
            order: order,
            matched: true
          });
          matched = true;

          return;
        }
        
        // Try common front matter section matches
        if (area === 'front' && !matched) {
          const frontMatterTitles = {
            'title': 'Title Page',
            'title page': 'Title Page',
            'disclaimer': 'Disclaimer',
            'copyright': 'Copyright',
            'acknowledgments': 'Acknowledgments',
            'acknowledgements': 'Acknowledgments',
            'foreword': 'Foreword',
            'introduction': 'Introduction',
            'preface': 'Preface',
            'dedication': 'Dedication'
          };
          
          // Check if section title matches any common front matter title
          for (const [key, value] of Object.entries(frontMatterTitles)) {
            if (sectionLowercase.includes(key)) {
              // Find this section in the structure
              const sectionIdx = structure.front.findIndex(s => 
                s.toLowerCase() === value.toLowerCase()
              );
              
              if (sectionIdx !== -1) {
                const name = structure.front[sectionIdx];
                const order = sectionIdx;
                matchedSections.push({
                  key: `front:${name}`,
                  content: section.content,
                  order: order,
                  matched: true
                });
                matched = true;

                break;
              }
            }
          }
        }
        
        // Try to match chapters in main matter
        if (area === 'main' && !matched) {
          // Check for "Chapter X" format
          const chapterMatch = sectionLowercase.match(/^chapter\s+(\d+)(?::|$)/);
          if (chapterMatch) {
            const chapterNum = chapterMatch[1];
            const matchingSection = structure.main.find(s => 
              s.match(new RegExp(`^Chapter ${chapterNum}(?::|$)`, 'i')) || 
              s === `Chapter ${chapterNum}`
            );
            
            if (matchingSection) {
              const sectionIdx = structure.main.indexOf(matchingSection);
              matchedSections.push({
                key: `main:${matchingSection}`,
                content: section.content,
                order: 1000 + sectionIdx,
                matched: true
              });
              matched = true;

            }
          }
        }
        
        // Try common back matter section matches
        if (area === 'back' && !matched) {
          const backMatterTitles = {
            'appendix': 'Appendix',
            'glossary': 'Glossary',
            'bibliography': 'Bibliography',
            'references': 'References',
            'index': 'Index',
            'about': 'About the Author'
          };
          
          for (const [key, value] of Object.entries(backMatterTitles)) {
            if (sectionLowercase.includes(key)) {
              const sectionIdx = structure.back.findIndex(s => 
                s.toLowerCase() === value.toLowerCase()
              );
              
              if (sectionIdx !== -1) {
                const name = structure.back[sectionIdx];
                const order = 2000 + sectionIdx;
                matchedSections.push({
                  key: `back:${name}`,
                  content: section.content,
                  order: order,
                  matched: true
                });
                matched = true;

                break;
              }
            }
          }
        }
      });
      
      // If no match was found, check if the selected section should receive this content
      if (!matched && selected) {
        const { area, idx } = selected;
        if (structure[area] && structure[area][idx]) {
          const sectionName = structure[area][idx];
          const orderBase = area === 'front' ? 0 : 
                           area === 'main' ? 1000 : 2000;
          
          matchedSections.push({
            key: `${area}:${sectionName}`,
            content: section.content,
            order: orderBase + idx,
            matched: false
          });

        }
      }
    });
    
    // Sort matched sections by their order to preserve structure sequence
    matchedSections.sort((a, b) => a.order - b.order);
    
    // Add each section to the result, preserving order
    matchedSections.forEach(({ key, content }) => {
      result[key] = content;
    });
    

    
    return result;
  };
  
  // Updated import handler to work with ImportModal
  const handleImport = async (settings: ImportSettings, file?: File) => {
    setImportLoading(true);
    
    try {
      let markdown = '';
      let source = '';
      
      if (settings.source === 'file' && file) {
        // Handle file upload with FormData
        const formData = new FormData();
        formData.append('file', file);
        source = settings.fileName || file.name;
        
        try {
          // Simplified error handling for all file types
          const response = await http.post<ImportResponse>(`${API_URL}/import`, formData);
          
          if (response.data && response.data.success && response.data.markdown) {
            markdown = response.data.markdown;
          } else {
            throw new Error(response.data.error || 'Invalid response from server');
          }
        } catch (error) {
          // Pass the axios error through directly for better error handling in the modal
          throw error;
        }
        
      } else if (settings.source === 'gdocs' && settings.googleDocsUrl) {
        source = 'Google Docs';
        try {
          // Call the backend to fetch Google Docs content
          const response = await http.post<ImportResponse>(`${API_URL}/import/google`, {
            url: settings.googleDocsUrl
          });
          
          if (response.data && response.data.success && response.data.markdown) {
            markdown = response.data.markdown;
          } else {
            throw new Error('Could not import from Google Docs');
          }
        } catch (error: any) {
          // Pass the axios error through directly for better error handling in the modal
          throw error;
        }
      } else {
        throw new Error('No valid import source selected');
      }
      
      if (!markdown) {
        throw new Error('No content found to import');
      }
      
      // New logic: Parse the markdown into sections based on top-level headings
      // and distribute to the corresponding sections in the book structure
      const parsedSections = parseMarkdownIntoSections(markdown);
      
      if (Object.keys(parsedSections).length === 0) {
        // If no sections were found, just use the original behavior
        const { area, idx } = selected || { area: 'front', idx: 0 };
        const sectionName = structure[area][idx];
        
        // Update the content with the imported markdown
        setContent(prev => ({
          ...prev,
          [`${area}:${sectionName}`]: markdown
        }));
      } else {
        // Update each section based on the parsed content
        setContent(prev => {
          const newContent = { ...prev };
          
          // Add each parsed section to the content
          Object.entries(parsedSections).forEach(([key, sectionContent]) => {
            newContent[key] = sectionContent;
          });
          
          return newContent;
        });
        
        // If we've imported multiple sections, select the first one that has content
        const sectionKeys = Object.keys(parsedSections);
        if (sectionKeys.length > 0) {
          const firstKey = sectionKeys[0];
          const parts = firstKey.split(':');
          
          if (parts.length === 2) {
            const area = parts[0] as Area;
            const sectionName = parts[1];
            
            // Make sure the area exists in the structure before accessing
            if (structure[area] && Array.isArray(structure[area])) {
              const idx = structure[area].findIndex(s => s === sectionName);
              
              if (idx !== -1) {
                // Update the selected section to match the first imported section
                setSelected({ area, idx });
              }
            }
          }
        }
      }
      
      // Set a flag to show the import was successful
      setRecentlyImported(true);
      
      // Generate a preview if a section is selected
      if (selected) {
        const { area, idx } = selected;
        const sectionName = structure[area][idx];
        generatePreview(content[`${area}:${sectionName}`] || '');
      }
      
      // Show success notification
      setNotification({
        open: true,
        message: `Successfully imported content from ${source}`,
        severity: 'success'
      });
      
      // Reset the import state and close the modal
      setImportOpen(false);
      
    } catch (error: any) {
      console.error('Import error:', error);
      
      // Show error notification with limited details
      setNotification({
        open: true,
        message: 'Import failed. See details in the import dialog.',
        severity: 'error'
      });
      
      // Let ImportModal handle and display the detailed error
      throw error;
    } finally {
      setImportLoading(false);
    }
  };
  
  // Helper to generate preview HTML
  const generatePreview = (markdown: string) => {
    // Use our adapter to prepare content for preview
    let preprocessed = FormatAdapter.adaptForPreview(markdown);
    
    // The rest of the preview generation logic...
    // Process LaTeX commands first to prevent them from interfering with markdown parsing
    preprocessed = preprocessed
      // Replace LaTeX commands with HTML comments to preserve them but not render them
      .replace(/\\begin\{titlepage\}[\s\S]*?\\end\{titlepage\}/g, '<div class="title-page">$&</div>')
      .replace(/\\(frontmatter|mainmatter|backmatter|newpage)/g, '<div class="latex-command">$&</div>')
      .replace(/\\vspace\*?\{.*?\}/g, '<div class="spacing-command">$&</div>')
      .replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, '<div class="centered">$1</div>');
    
    // First, convert headers before paragraph processing
    let html = preprocessed
      // Headers - process these first to avoid paragraph wrapping issues
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
      .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%;">');

    // Process paragraphs by treating each line as a potential paragraph
    // This approach handles single line breaks more effectively
    const lines = html.split('\n');
    let processedLines = [];
    let inCodeBlock = false;
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          processedLines.push('<pre><code>');
        } else {
          processedLines.push('</code></pre>');
        }
        continue;
      }
      
      // Skip processing content inside code blocks
      if (inCodeBlock) {
        processedLines.push(line);
        continue;
      }
      
      // Handle special cases
      if (line.includes('<h1>') || 
          line.includes('<h2>') || 
          line.includes('<h3>') ||
          line.includes('class="latex-command"') ||
          line.includes('class="spacing-command"') ||
          line.includes('class="title-page"') ||
          line.includes('class="centered"')) {
        processedLines.push(line);
        continue;
      }
      
      // Handle list items
      if (trimmedLine.startsWith('- ') || trimmedLine.match(/^\d+\. /)) {
        if (!inList) {
          inList = true;
          processedLines.push(trimmedLine.startsWith('- ') ? '<ul>' : '<ol>');
        }
        const itemContent = trimmedLine.startsWith('- ') 
          ? trimmedLine.substring(2) 
          : trimmedLine.replace(/^\d+\. /, '');
        processedLines.push(`<li>${itemContent}</li>`);
        continue;
      } else if (inList && trimmedLine === '') {
        inList = false;
        processedLines.push(lines[i-1].trim().startsWith('- ') ? '</ul>' : '</ol>');
      }
      
      // Handle blockquotes
      if (trimmedLine.startsWith('> ')) {
        processedLines.push(`<blockquote>${trimmedLine.substring(2)}</blockquote>`);
        continue;
      }
      
      // Handle regular paragraphs
      // Empty lines signify paragraph breaks
      if (trimmedLine === '') {
        if (i > 0 && !processedLines[processedLines.length-1].match(/<\/(h1|h2|h3|pre|ul|ol|blockquote)>/)) {
          // Don't add empty paragraphs after headers, lists, or other block elements
          if (!processedLines[processedLines.length-1].match(/<p><\/p>/)) {
            processedLines.push('<p></p>');
          }
        }
      } else if (!inList) {
        // Only wrap in paragraph if not in a list
        processedLines.push(`<p>${trimmedLine}</p>`);
      }
    }
    
    // Close any open lists
    if (inList) {
      processedLines.push(lines[lines.length-1].trim().startsWith('- ') ? '</ul>' : '</ol>');
    }
    
    html = processedLines.join('\n');
    
    // Process inline formatting
    html = html
      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    
    // Add visual styling to LaTeX commands in the preview
    html = html
      .replace(/<div class="latex-command">(.*?)<\/div>/g, 
        '<div style="color:#0066cc;font-family:monospace;background:#f0f8ff;padding:2px 4px;margin:4px 0;border-left:3px solid #0066cc;">$1</div>')
      .replace(/<div class="spacing-command">(.*?)<\/div>/g,
        '<div style="color:#666;font-style:italic;font-size:0.9em;">$1</div>')
      .replace(/<div class="title-page">(.*?)<\/div>/g,
        '<div style="border:1px dashed #ccc;padding:15px;background:#f9f9f9;margin:10px 0;text-align:center;">Title Page</div>')
      .replace(/<div class="centered">(.*?)<\/div>/g,
        '<div style="text-align:center;">$1</div>');
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '<br />');
    
    setPreviewHtml(html);
  };
  
  // Format insertion helpers
  const insertFormat = (format: string) => {
    if (!selected) return;
    
    const { area, idx } = selected;
    const sectionName = structure[area][idx];
    const currentContent = content[`${area}:${sectionName}`] || '';
    
    // Get the textarea element
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentContent.substring(start, end);
    
    let newText = '';
    
    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'bullet-list':
        newText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      case 'numbered-list':
        newText = selectedText.split('\n').map((line, i) => `${i+1}. ${line}`).join('\n');
        break;
      case 'header':
        // For main matter sections, support proper chapter format
        if (area === 'main' && sectionName.match(/^Chapter \d+$/)) {
          const chapterNum = sectionName.match(/\d+/)?.[0] || '1';
          // Use our template to ensure consistent chapter formatting
          newText = TEMPLATES.CHAPTER_HEADING(parseInt(chapterNum), selectedText);
        } else {
          newText = `# ${selectedText}`;
        }
        break;
      case 'subheader':
        newText = `## ${selectedText}`;
        break;
      case 'code':
        newText = `\`\`\`\n${selectedText}\n\`\`\``;
        break;
      case 'quote':
        newText = selectedText.split('\n').map(line => `> ${line}`).join('\n');
        break;
      case 'link':
        newText = `[${selectedText}](url)`;
        break;
      case 'header3':
        newText = `### ${selectedText}`;
        break;
      case 'header4':
        newText = `#### ${selectedText}`;
        break;
      case 'header5':
        newText = `##### ${selectedText}`;
        break;
      case 'header6':
        newText = `###### ${selectedText}`;
        break;
      case 'image':
        newText = `\\begin{figure}[h]\n` +
                  `\\centering\n` +
                  `\\includegraphics[width=0.6\\textwidth]{C:/Path/To/Your/Image.jpg} % Use "Copy as Path" and replace backslashes \\ with forward slashes /\n` +
                  `\\caption{Add your caption here, or delete this line to remove the caption}\n` +
                  `\\end{figure}`;
        break;
      default:
        newText = selectedText;
    }
    
    const updatedContent = 
      currentContent.substring(0, start) + 
      newText + 
      currentContent.substring(end);
    
    handleContentChange(area, sectionName, updatedContent);
    
    // Update preview if in split mode
    if (viewMode === 'split' || viewMode === 'preview') {
      generatePreview(updatedContent);
    }
  };
  
  // Alignment insertion helper
  const insertAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    if (!selected) return;
    const { area, idx } = selected;
    const sectionName = structure[area][idx];
    const currentContent = content[`${area}:${sectionName}`] || '';
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentContent.substring(start, end) || '';
    let wrapped = selectedText;
    // Remove any existing alignment wrappers from the selection
    const removeAlignmentWrappers = (text: string) =>
      text.replace(/(^|\n)::: ?(center|right|\{[^}]*\}|\.center|\.right)[\s\S]*?:::(\n|$)/g, (m, p1, p2, p3) => '');
    if (alignment === 'left') {
      wrapped = removeAlignmentWrappers(selectedText);
    } else if (alignment === 'center') {
      wrapped = `::: {.center}\n${selectedText}\n:::\n`;
    } else if (alignment === 'right') {
      wrapped = `::: {.right}\n${selectedText}\n:::\n`;
    } else if (alignment === 'justify') {
      wrapped = `::: {style="text-align: justify;"}\n${selectedText}\n:::\n`;
    }
    const updatedContent =
      currentContent.substring(0, start) +
      wrapped +
      currentContent.substring(end);
    handleContentChange(area, sectionName, updatedContent);
    if (viewMode === 'split' || viewMode === 'preview') {
      generatePreview(updatedContent);
    }
  };
  
  // Effect to update preview when content changes
  useEffect(() => {
    if (selected && (viewMode === 'split' || viewMode === 'preview')) {
      const { area, idx } = selected;
      const sectionName = structure[area][idx];
      const currentContent = content[`${area}:${sectionName}`] || '';
      generatePreview(currentContent);
    }
  }, [viewMode, selected, content]);
  
  // Reset recentlyImported when section changes
  useEffect(() => {
    setRecentlyImported(false);
    
    // Whenever selection changes, make sure preview reflects the right content
    if (selected && (viewMode === 'split' || viewMode === 'preview')) {
      const { area, idx } = selected;
      const sectionName = structure[area][idx];
      const currentContent = content[`${area}:${sectionName}`] || '';
      generatePreview(currentContent);
    }
  }, [selected]);
  
  // Ensure content keys exist for new sections
  useEffect(() => {
    Object.entries(structure).forEach(([area, sections]) => {
      (sections as string[]).forEach((section) => {
        const key = `${area}:${section}`;
        if (!(key in content)) {
          setContent((prev) => ({ ...prev, [key]: '' }));
        }
      });
    });
  }, [structure, content]);

  // Add useEffect to construct Title Page markdown after metadata is entered and dialog is closed
  useEffect(() => {
    if (!metadataDialogOpen && projectTitle && projectAuthor) {
      // Force regenerate copyright when dialog closes with author info
      regenerateCopyright();
      const area = 'front';
      
      // Find title page section in the current structure (it should be localized already)
      const titlePageName = structure.front.find(section => {
        const sectionLower = section.toLowerCase();
        return (
          // English patterns
          sectionLower.includes('title') ||
          // Romance languages  
          sectionLower.includes('titre') || // French
          sectionLower.includes('título') || // Spanish
          sectionLower.includes('pagina') || // Italian/Romanian
          sectionLower.includes('página') || // Spanish/Portuguese
          // Germanic languages
          sectionLower.includes('titel') || // German/Dutch
          sectionLower.includes('titelseite') || // German
          sectionLower.includes('tittel') || // Norwegian
          sectionLower.includes('titelpagina') || // Dutch
          sectionLower.includes('titul') || // Czech
          sectionLower.includes('titulní') || // Czech
          sectionLower.includes('titullapas') || // Latvian
          sectionLower.includes('titulinis') || // Lithuanian
          sectionLower.includes('puslapis') || // Lithuanian
          sectionLower.includes('strona') || // Polish
          sectionLower.includes('titelsida') || // Swedish
          sectionLower.includes('titelside') || // Danish
          sectionLower.includes('tiitelleht') || // Estonian
          sectionLower.includes('otsikkosivu') || // Finnish
          // Slavic languages
          sectionLower.includes('титульная') || // Russian
          sectionLower.includes('титульна') || // Ukrainian
          sectionLower.includes('naslovna') || // Croatian/Serbian
          sectionLower.includes('tytul') || // Polish
          // Nordic languages
          sectionLower.includes('titilsíða') || // Icelandic
          sectionLower.includes('otsikko') || // Finnish
          // African languages
          sectionLower.includes('kichwa') || // Swahili
          sectionLower.includes('ihu') || // Igbo
          sectionLower.includes('taken') || // Hausa
          sectionLower.includes('leqephe') || // Southern Sotho
          sectionLower.includes('sehlooho') || // Southern Sotho
          sectionLower.includes('letlakala') || // Northern Sotho
          sectionLower.includes('sehloko') || // Northern Sotho
          sectionLower.includes('tsebe') || // Tswana
          sectionLower.includes('setlhogo') || // Tswana
          sectionLower.includes('iphepha') || // Xhosa
          sectionLower.includes('lesihloko') || // Xhosa/Zulu
          sectionLower.includes('ikhasi') || // Zulu
          sectionLower.includes('ojú-ìwé') || // Yoruba
          sectionLower.includes('àkọlé') || // Yoruba
          sectionLower.includes('peji') || // Shona
          sectionLower.includes('musoro') || // Shona
          sectionLower.includes('pejin') || // Malagasy
          sectionLower.includes('lohateny') || // Malagasy
          // Asian languages
          sectionLower.includes('தலைப்பு') || // Tamil
          sectionLower.includes('शीर्षक') || // Hindi/Nepali
          sectionLower.includes('पृष्ठ') || // Nepali (पृष्ठ)
          sectionLower.includes('শিরোনাম') || // Bengali
          sectionLower.includes('शीर्षिके') || // Gujarati
          sectionLower.includes('శీర్షిక') || // Telugu
          sectionLower.includes('ಶೀರ್ಷಿಕೆ') || // Kannada
          sectionLower.includes('തലക്കെട്ട്') || // Malayalam
          sectionLower.includes('ਸਿਰਲੇਖ') || // Punjabi
          sectionLower.includes('ଶୀର୍ଷକ') || // Odia
          section.includes('མཚན་བྱང') || // Tibetan (no lowercase needed)
          sectionLower.includes('タイトル') || // Japanese
          sectionLower.includes('halaman') || // Indonesian/Malaysian
          sectionLower.includes('judul') || // Indonesian
          sectionLower.includes('tajuk') || // Malaysian
          sectionLower.includes('trang') || // Vietnamese
          sectionLower.includes('tiêu') || // Vietnamese
          // Other languages
          sectionLower.includes('σελίδα') || // Greek
          sectionLower.includes('τίτλου') || // Greek
          sectionLower.includes('címlap') || // Hungarian
          sectionLower.includes('başlık') || // Turkish
          sectionLower.includes('sayfası') || // Turkish
          sectionLower.includes('pahinang') || // Filipino
          sectionLower.includes('pamagat') || // Filipino
          // Arabic
          sectionLower.includes('صفحة') || // Arabic
          // Exact match fallback
          section === 'Title Page'
        );
      }) || 'Title Page';
      const idx = structure.front.findIndex(s => s === titlePageName);
      
      if (idx !== -1) {
        const key = `${area}:${titlePageName}`;
        // Only set if empty or matches the previous auto-generated template
        const current = content[key] || '';
        
                  // Get localized metadata labels
        
        // More flexible pattern to match auto-generated content
        const autoGenPattern = /^# .+/;
        if (!current.trim() || autoGenPattern.test(current.trim())) {
          let constructed = `# ${projectTitle}`;
          if (projectSubtitle) constructed += `\n\n## ${projectSubtitle}`;
          
          // Use localized "By" equivalent
          const metadata = getLocalizedMetadata(documentLanguage);
          const byText = metadata.by || 'By'; // Fallback to English "By"
          constructed += `\n\n${byText} ${projectAuthor}`;
          
          if (projectIsbn) {
            constructed += `\n\nISBN: ${projectIsbn}`;
          }
          

          setContent(prev => ({ ...prev, [key]: constructed }));
        }
      }
    }
    // Only run when dialog closes or metadata changes
  }, [metadataDialogOpen, projectTitle, projectSubtitle, projectAuthor, projectIsbn, structure.front, documentLanguage, regenerateCopyright]);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  function handleImportCsv() {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  }

  function handleCsvFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];
        const markdown = generateMarkdownTable(data);
        insertAtCursor(markdown);
      },
      skipEmptyLines: true
    });
  }

  function generateMarkdownTable(data: string[][]) {
    if (!data.length) return "";
    const headers = data[0];
    const rows = data.slice(1);
    const headerLine = `| ${headers.join(" | ")} |`;
    const separator = `| ${headers.map(() => "---").join(" | ")} |`;
    const rowLines = rows
      .filter(row => row.length && row.some(cell => (cell || '').trim() !== ""))
      .map(row => `| ${row.map(cell => cell || "").join(" | ")} |`);
    return [headerLine, separator, ...rowLines].join("\n");
  }

  function insertAtCursor(text: string) {
    if (!selected) return;
    const { area, idx } = selected;
    const sectionName = structure[area][idx];
    const currentContent = content[`${area}:${sectionName}`] || '';
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updatedContent =
      currentContent.substring(0, start) +
      text +
      currentContent.substring(end);
    handleContentChange(area, sectionName, updatedContent);
    if (viewMode === 'split' || viewMode === 'preview') {
      generatePreview(updatedContent);
    }
  }

  // Replace with a proper modal dialog approach for image uploads
  // Add state for image dialog
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageScale, setImageScale] = useState('0.5');
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Reset image dialog state when opened
  useEffect(() => {
    if (imageDialogOpen) {
      setUploadedImagePath('');
      setImageCaption('');
      setImageScale('0.5');
      setUploading(false);
      // Clear the file input
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  }, [imageDialogOpen]);

  // Add a function to clean up the structure
  const cleanupStructure = (structureToClean: typeof structure): typeof structure => {
    // Create a deep clone of the structure
    const cleanedStructure = JSON.parse(JSON.stringify(structureToClean));
    
    // Filter out null, undefined, and empty section names in all areas
    Object.keys(cleanedStructure).forEach(area => {
      if (Array.isArray(cleanedStructure[area])) {
        cleanedStructure[area] = cleanedStructure[area].filter(
          section => section && 
                    section !== 'null' && 
                    section !== 'undefined' && 
                    section.trim() !== ''
        );
      }
    });
    

    return cleanedStructure;
  };



  // Function to validate and repair book structure
  const validateAndRepairStructure = (structureToValidate: typeof structure): typeof structure => {
    // Create a deep clone to avoid reference issues
    const validatedStructure = JSON.parse(JSON.stringify(structureToValidate));
    let modified = false;
    
    // Ensure all areas exist and are arrays
    ['front', 'main', 'back'].forEach(area => {
      if (!validatedStructure[area] || !Array.isArray(validatedStructure[area])) {
        validatedStructure[area] = [];
        modified = true;
      }
    });
    
    // Remove any null/undefined/empty entries from all areas
    ['front', 'main', 'back'].forEach(area => {
      const cleanArray = validatedStructure[area].filter(item => 
        item && item !== 'null' && item !== 'undefined' && item.trim() !== ''
      );
      if (cleanArray.length !== validatedStructure[area].length) {
        validatedStructure[area] = cleanArray;
        modified = true;
      }
    });
    
    if (modified) {

    }
    
    return validatedStructure;
  };

  // Function to save structure to backend
  const saveStructureToBackend = async (updatedStructure: typeof structure) => {
    if (!projectId || !token) return;
    
    try {
      const response = await http.put<ProjectApiResponse>(
        `${ENV.API_URL}/projects/${projectId}`,
        {
          title: projectTitle,
          content,
          structure: updatedStructure,
          author: projectAuthor,
          subtitle: projectSubtitle,
          isbn: projectIsbn
        }
      );
      

    } catch (err) {
      console.error('Error saving structure:', err);
    }
  };



  // Function to repair and save the structure


  // Add an effect to clean up the structure when the component loads
  useEffect(() => {
    // Only run this after the structure is loaded from the backend
    if (!loadingProject && Object.keys(structure).length > 0) {
      // Check if there are any null/undefined values in the structure
      let hasInvalidEntries = false;
      
      Object.keys(structure).forEach(area => {
        const areaArray = structure[area];
        if (Array.isArray(areaArray)) {
          areaArray.forEach(section => {
            if (!section || section === 'null' || section === 'undefined' || section.trim() === '') {
              hasInvalidEntries = true;
            }
          });
        }
      });
      
      // Only run cleanup if invalid entries are detected
      if (hasInvalidEntries) {

        const cleanedStructure = cleanupStructure(structure);
        
        // Use a ref to track if we've already done this cleanup to prevent infinite loops
        if (!initialCleanupDone.current) {
          initialCleanupDone.current = true;
          setStructure(cleanedStructure);
          saveStructureToBackend(cleanedStructure);
          
          // Show notification
          setNotification({
            open: true,
            message: 'Fixed invalid sections in book structure',
            severity: 'info'
          });
        }
      }
    }
  }, [loadingProject]);  // Only run when loading state changes, not when structure changes

  // Add an effect to validate structure on initial load and after content changes
  useEffect(() => {
    // Only run this after the structure is loaded from the backend and we're not loading
    if (!loadingProject && Object.keys(structure).length > 0) {

      const validatedStructure = validateAndRepairStructure(structure);
      
      // Only update if changes were made to avoid infinite loops
      if (JSON.stringify(validatedStructure) !== JSON.stringify(structure)) {

        setStructure(validatedStructure);
        
        // Save the validated structure to backend
        saveStructureToBackend(validatedStructure);
      }
    }
  }, [loadingProject, projectId]); // Only run when loading state or project ID changes


  
  // Add an effect to save Copyright content to localStorage whenever it changes
  useEffect(() => {
    const copyrightKey = 'front:Copyright';
    const copyrightContent = content[copyrightKey];
    
    if (copyrightContent && copyrightContent.trim() !== '') {
      localStorage.setItem('saved_copyright', copyrightContent);
    }
  }, [content]);
  

  
  // Add an effect to verify content is properly loaded
  useEffect(() => {
    if (!loadingProject && Object.keys(content).length > 0) {




      
      // Log all sections with their content size

      Object.entries(content).forEach(([key, value]) => {

      });
      
      // Check if there are any sections in structure not in content

      ['front', 'main', 'back'].forEach(area => {
        structure[area as Area].forEach(sectionName => {
          const key = `${area}:${sectionName}`;
          if (!(key in content)) {
            console.warn(`⚠️ MISSING CONTENT: ${key}`);
          } else if (!content[key] || content[key].trim() === '') {
            console.warn(`⚠️ EMPTY CONTENT: ${key}`);
          }
        });
      });
      

    }
  }, [loadingProject, content, structure, projectId]);
  
  // Wrap the main JSX in DndProvider
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }} className="project-workspace-container">
      {/* Document Structure Sidebar */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          borderRight: '1px solid rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper'
        }}
        className="project-workspace-sidebar"
      >
        {/* Project title with edit option */}
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid rgba(0,0,0,0.12)', 
          display: 'flex',
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          {editingProjectName ? (
            <TextField
              fullWidth
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
              onBlur={() => {
                setEditingProjectName(false);
                // Save the title to the database
                if (editedProjectName.trim() !== '') {
                  setProjectTitle(editedProjectName);
                  // Save to database using http (reuse the existing authorization)
                  http.put(`${ENV.API_URL}/projects/${projectId}`, {
                    title: editedProjectName,
                    author: projectAuthor,
                    subtitle: projectSubtitle,
                    isbn: projectIsbn
                  }).then(response => {

                  }).catch(err => {
                    console.error('Failed to save project title:', err);
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditingProjectName(false);
                  // Save the title to the database
                  if (editedProjectName.trim() !== '') {
                    setProjectTitle(editedProjectName);
                    // Save to database using http
                    http.put(`${ENV.API_URL}/projects/${projectId}`, {
                      title: editedProjectName,
                      author: projectAuthor,
                      subtitle: projectSubtitle,
                      isbn: projectIsbn
                    }).then(response => {

                    }).catch(err => {
                      console.error('Failed to save project title:', err);
                    });
                  }
                }
              }}
              autoFocus
              variant="standard"
              sx={{ fontWeight: 'bold' }}
            />
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {editedProjectName}
            </Typography>
          )}
          <IconButton size="small" onClick={() => setEditingProjectName(true)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>



        {/* Section list */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {Object.keys(structure).map((area) => (
            <React.Fragment key={area}>
              {/* Area Header */}
              <ListSubheader
                sx={{
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {area === 'front' ? sectionNames.frontMatter : 
                   area === 'main' ? sectionNames.mainMatter : 
                   sectionNames.backMatter}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleAdd(area as Area)}
                    aria-label={`Add section to ${area} matter`}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleExpand(area as Area)}
                    aria-label={`Expand ${area} matter`}
                  >
                    {expanded[area as keyof typeof expanded] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </ListSubheader>
              
              {/* Area Content */}
              <Collapse in={expanded[area as keyof typeof expanded]}>
                {area === 'front' && structure[area] && structure[area].length >= 2 ? (
                  // Front matter with fixed Title Page and Copyright
                  <List disablePadding>
                    {/* Fixed Title Page */}
                    <ListItem
                      button
                      selected={selected ? selected.area === area && selected.idx === 0 : false}
                      onClick={() => setSelected({ area: area as Area, idx: 0 })}
                      sx={{ 
                        pl: 4, 
                        borderLeft: selected && selected.area === area && selected.idx === 0 ? '3px solid #4fd1c5' : 'none',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)', // Light gold background for locked sections
                        '&:hover': {
                          backgroundColor: 'rgba(255, 215, 0, 0.2)',
                          '& .section-actions': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <ListItemText primary={`🔒 ${structure[area][0]}`} />
                      <Box className="section-actions" sx={{ opacity: 0, transition: 'opacity 0.2s', display: 'flex' }}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(area as Area, 0); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setMetadataDialogOpen(true); 
                          }}
                          sx={{ ml: 1, fontSize: '0.7rem', py: 0.25 }}
                        >
                          {getLocalizedMetadata(documentLanguage).required}
                        </Button>
                      </Box>
                    </ListItem>
                    
                    {/* Fixed Copyright */}
                    <ListItem
                      button
                      selected={selected ? selected.area === area && selected.idx === 1 : false}
                      onClick={() => setSelected({ area: area as Area, idx: 1 })}
                      sx={{ 
                        pl: 4, 
                        borderLeft: selected && selected.area === area && selected.idx === 1 ? '3px solid #4fd1c5' : 'none',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)', // Light gold background for locked sections
                        '&:hover': {
                          backgroundColor: 'rgba(255, 215, 0, 0.2)',
                          '& .section-actions': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <ListItemText primary={`🔒 ${structure[area][1]}`} />
                      <Box className="section-actions" sx={{ opacity: 0, transition: 'opacity 0.2s', display: 'flex' }}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(area as Area, 1); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                    
                    {/* Reorderable front matter sections (skip first two) */}
                    {structure[area].length > 2 && (
                      <ReorderableSection
                        key={`front-reorderable`}
                        sections={structure[area].slice(2)}
                        onReorder={(newSections) => handleReorder(area as Area, [structure[area][0], structure[area][1], ...newSections])}
                        selectedIndex={selected?.area === area && selected.idx >= 2 ? selected.idx - 2 : null}
                        onSelectSection={(index) => setSelected({ area: area as Area, idx: index + 2 })}
                        onEditSection={(index) => handleEdit(area as Area, index + 2)}
                        onDeleteSection={(index) => handleDelete(area as Area, index + 2)}
                        loading={!structureLoaded}
                        matterType="front"
                      />
                    )}
                  </List>
                ) : area === 'main' ? (
                  // Main matter - fully reorderable
                  <ReorderableSection
                    key={`main-reorderable`}
                    sections={structure[area as Area] || []}
                    onReorder={(newSections) => handleReorder(area as Area, newSections)}
                    selectedIndex={selected?.area === area ? selected.idx : null}
                    onSelectSection={(index) => setSelected({ area: area as Area, idx: index })}
                    onEditSection={(index) => handleEdit(area as Area, index)}
                    onDeleteSection={(index) => handleDelete(area as Area, index)}
                    loading={!structureLoaded}
                    matterType="main"
                  />
                ) : area === 'back' ? (
                  // Back matter - fully reorderable
                  <ReorderableSection
                    key={`back-reorderable`}
                    sections={structure[area as Area] || []}
                    onReorder={(newSections) => handleReorder(area as Area, newSections)}
                    selectedIndex={selected?.area === area ? selected.idx : null}
                    onSelectSection={(index) => setSelected({ area: area as Area, idx: index })}
                    onEditSection={(index) => handleEdit(area as Area, index)}
                    onDeleteSection={(index) => handleDelete(area as Area, index)}
                    loading={!structureLoaded}
                    matterType="back"
                  />
                ) : null}
              </Collapse>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Editor Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="project-workspace-editor">
        {/* Add Toolbar */}
        <Box sx={{ 
          display: 'flex', 
          borderBottom: '1px solid rgba(0,0,0,0.12)', 
          p: 1,
          bgcolor: 'background.paper',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Left side - Section title */}
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            {selected && structureLoaded && structure[selected.area]?.[selected.idx] ? structure[selected.area][selected.idx] : uiText.noSectionSelected}
          </Typography>

          {/* Right side - View mode and action buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {selected && (
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
                sx={{ mr: 2 }}
              >
                <ToggleButton value="edit">
                  <EditIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="split">
                  <ViewAgendaIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="preview">
                  <VisibilityIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
            
            {/* Word Count Display for all users (informational), with limits for ebook users */}
            <Box sx={{ mr: 2, minWidth: 150 }}>
              <WordCountDisplay
                projectId={projectId}
                wordLimit={userWordLimit}
                compact={true}
                showForAllUsers={true}
                onUpgradeClick={() => window.open('/pricing', '_blank')}
                onWordLimitStatusChange={(isOverLimit) => setIsOverWordLimit(isOverLimit)}
                refreshTrigger={wordCountRefreshTrigger}
              />
            </Box>
            
            <Tooltip title={uiText.import}>
              <Button 
                variant="text" 
                startIcon={<ImportExportIcon />}
                onClick={() => setImportOpen(true)}
                sx={{ mr: 1 }}
              >
                {uiText.import}
              </Button>
            </Tooltip>
            <Tooltip title={uiText.manualSave}>
              <Button 
                variant="text" 
                startIcon={<CloudUploadIcon />}
                onClick={() => {
                  // Show saving notification
                  setNotification({
                    open: true,
                    message: 'Saving all content...',
                    severity: 'info'
                  });
                  
                  // Cancel any pending autosaves
                  if (debouncedSave.current) {
                    clearTimeout(debouncedSave.current);
                    debouncedSave.current = null;
                  }
                  
                  // Perform the save
                  http.put(`${ENV.API_URL}/projects/${projectId}`, {
                    title: projectTitle,
                    content,
                    structure, // Include structure in the save
                    author: projectAuthor,
                    subtitle: projectSubtitle,
                    isbn: projectIsbn
                  }).then(response => {

                    setNotification({
                      open: true,
                      message: 'All changes saved successfully!',
                      severity: 'success'
                    });
                    // Refresh word count after manual save
                    refreshWordCount();
                  }).catch(err => {
                    console.error('Manual save failed:', err);
                    
                    // Check if it's a word limit error
                    let errorMessage = 'Failed to save changes. Please try again.';
                    if (err.response?.status === 400 && err.response?.data?.message?.includes('word limit')) {
                      const data = err.response.data;
                      if (data.data?.wordsOver) {
                        errorMessage = `Content exceeds the 10,000-word limit by ${data.data.wordsOver.toLocaleString()} words. Please remove some content to continue saving.`;
                      } else {
                        errorMessage = `Content exceeds the 10,000-word limit for ebook subscriptions. Please reduce your content to under 10,000 words.`;
                      }
                    }
                    
                    setNotification({
                      open: true,
                      message: errorMessage,
                      severity: 'error'
                    });
                  });
                }}
                sx={{ mr: 1 }}
              >
                {uiText.save}
              </Button>
            </Tooltip>
            <Tooltip title={
              userSubscription?.startsWith('e') && isOverWordLimit 
                ? "Export disabled: Ebook subscriptions limited to 10,000 words" 
                : uiText.exportTooltip
            }>
              <span>
                <Button 
                  variant="text" 
                  startIcon={<CloudDownloadIcon />}
                  onClick={() => {
                    // Only refresh word count for ebook subscriptions (they have limits)
                    if (userSubscription?.startsWith('e')) {
                      refreshWordCount();
                    }
                    setExportDialogOpen(true);
                  }}
                  disabled={userSubscription?.startsWith('e') && isOverWordLimit}
                  sx={{
                    ...(userSubscription?.startsWith('e') && isOverWordLimit && {
                      color: 'text.disabled'
                    })
                  }}
                >
                  {uiText.export}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {/* Deterrent banner (Single plan, after 3 days) */}
        {(() => {
          if (!userSubscription || (userSubscription !== 'single' && userSubscription !== 'single_promo')) return null;
          if (!projectCreatedAt) return null;
          const created = new Date(projectCreatedAt).getTime();
          const threeDays = 3 * 24 * 60 * 60 * 1000;
          const show = Date.now() - created > threeDays;
          if (!show) return null;
          return (
            <Paper sx={{ p: 2, m: 2, mt: 0, border: '1px solid', borderColor: 'warning.light', bgcolor: 'rgba(255,193,7,0.08)' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Heads up:</strong> We use AI to monitor title changes and prevent misuse. If suspicious activity is detected, your account may be suspended or deleted.
              </Typography>
            </Paper>
          );
        })()}
        
        {selected && recentlyImported && (
          <Alert 
            severity="success" 
            sx={{ mx: 2, mt: 2 }}
            onClose={() => setRecentlyImported(false)}
          >
            Content imported successfully! You can now edit it below.
          </Alert>
        )}
        
        {/* Formatting toolbar */}
        {selected && (viewMode === 'edit' || viewMode === 'split') && (
          <Box sx={{ 
            px: 2, 
            py: 1, 
            display: 'flex', 
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            bgcolor: 'background.paper',
            overflowX: 'auto'
          }}>
            <Tooltip title="Bold">
              <IconButton size="small" onClick={() => insertFormat('bold')} sx={{ mx: 0.5 }}>
                <FormatBoldIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton size="small" onClick={() => insertFormat('italic')} sx={{ mx: 0.5 }}>
                <FormatItalicIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Tooltip title="Heading">
              <IconButton size="small" onClick={() => insertFormat('header')} sx={{ mx: 0.5 }}>
                <Typography variant="button" sx={{ fontWeight: 'bold' }}>H1</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Subheading">
              <IconButton size="small" onClick={() => insertFormat('subheader')} sx={{ mx: 0.5 }}>
                <Typography variant="button" sx={{ fontWeight: 'bold' }}>H2</Typography>
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Tooltip title="Heading 3">
              <IconButton size="small" onClick={() => insertFormat('header3')} sx={{ mx: 0.5 }}>
                <Typography variant="button" sx={{ fontWeight: 'bold' }}>H3</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Heading 4">
              <IconButton size="small" onClick={() => insertFormat('header4')} sx={{ mx: 0.5 }}>
                <Typography variant="button" sx={{ fontWeight: 'bold' }}>H4</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Heading 5">
              <IconButton size="small" onClick={() => insertFormat('header5')} sx={{ mx: 0.5 }}>
                <Typography variant="button" sx={{ fontWeight: 'bold' }}>H5</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Heading 6">
              <IconButton size="small" onClick={() => insertFormat('header6')} sx={{ mx: 0.5 }}>
                <Typography variant="button" sx={{ fontWeight: 'bold' }}>H6</Typography>
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Tooltip title="Bullet List">
              <IconButton size="small" onClick={() => insertFormat('bullet-list')} sx={{ mx: 0.5 }}>
                <FormatListBulletedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Numbered List">
              <IconButton size="small" onClick={() => insertFormat('numbered-list')} sx={{ mx: 0.5 }}>
                <FormatListNumberedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Tooltip title="Code Block">
              <IconButton size="small" onClick={() => insertFormat('code')} sx={{ mx: 0.5 }}>
                <CodeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Quote">
              <IconButton size="small" onClick={() => insertFormat('quote')} sx={{ mx: 0.5 }}>
                <FormatQuoteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Link">
              <IconButton size="small" onClick={() => insertFormat('link')} sx={{ mx: 0.5 }}>
                <InsertLinkIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Image">
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImageDialogOpen(true);
                  return false;
                }} 
                sx={{ mx: 0.5 }}
              >
                <img src="https://img.icons8.com/ios-filled/20/000000/image.png" alt="img" style={{ verticalAlign: 'middle' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Import CSV">
              <IconButton size="small" onClick={handleImportCsv} sx={{ mx: 0.5 }}>
                <span role="img" aria-label="Import CSV">📁</span>
              </IconButton>
            </Tooltip>
            {/* Alignment buttons: Only Center and Right */}
            <Tooltip title="Align Center">
              <IconButton size="small" onClick={() => insertAlignment('center')} sx={{ mx: 0.5 }}>
                <FormatAlignCenterIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Align Right">
              <IconButton size="small" onClick={() => insertAlignment('right')} sx={{ mx: 0.5 }}>
                <FormatAlignRightIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        
        {/* Content area */}
        {selected ? (
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            display: 'flex',
            flexDirection: viewMode === 'split' ? 'row' : 'column'
          }}>
            {/* Editor */}
            {(viewMode === 'edit' || viewMode === 'split') && (
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                ...(viewMode === 'split' && { 
                  borderRight: '1px solid rgba(0,0,0,0.12)',
                  maxWidth: '50%'
                })
              }}>
                <TextField
                  label={selected ? `${uiText.editing}: ${structure[selected.area][selected.idx]}` : uiText.noSectionSelected}
                  multiline
                  fullWidth
                  minRows={20}
                  value={selected ? (() => {
                    const contentKey = `${selected.area}:${structure[selected.area][selected.idx]}`;
                    const contentValue = content[contentKey] || '';
                    // Editor display debug
                    return contentValue;
                  })() : ''}
                  onChange={(e) => {
                    if (selected) {
                      const { area, idx } = selected;
                      const sectionName = structure[area][idx];
                      handleContentChange(area, sectionName, e.target.value);
                      
                      // Update preview if in split mode
                      if (viewMode === 'split') {
                        generatePreview(e.target.value);
                      }
                    }
                  }}
                  inputRef={editorRef}
                  variant="outlined"
                  sx={{ '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
                />
              </Box>
            )}
            
            {/* Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <Box sx={{ 
                flex: 1, 
                p: 3, 
                overflow: 'auto',
                bgcolor: viewMode === 'preview' ? 'background.paper' : 'background.default',
              }}>
                <Paper 
                  variant={viewMode === 'preview' ? 'outlined' : 'elevation'} 
                  elevation={viewMode === 'preview' ? 0 : 1}
                  sx={{ 
                    p: 3, 
                    minHeight: '100%',
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Preview
                  </Typography>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box 
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(previewHtml) }} 
                    sx={{ 
                      '& h1, & h2, & h3': { 
                        mb: 2,
                        mt: 3,
                        fontWeight: 'bold'
                      },
                      '& h1': { fontSize: '2rem' },
                      '& h2': { fontSize: '1.5rem' },
                      '& h3': { fontSize: '1.25rem' },
                      '& p': { 
                        mb: 2,
                        lineHeight: 1.6
                      },
                      '& ul, & ol': {
                        pl: 3,
                        mb: 2
                      },
                      '& li': {
                        mb: 0.5
                      },
                      '& blockquote': {
                        borderLeft: '4px solid #ccc',
                        pl: 2,
                        py: 0.5,
                        my: 2,
                        bgcolor: 'rgba(0,0,0,0.03)'
                      },
                      '& pre': {
                        bgcolor: 'rgba(0,0,0,0.05)',
                        p: 2,
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        fontFamily: 'monospace'
                      }
                    }}
                  />
                </Paper>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              {uiText.selectSectionToEdit}
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Export Modal */}
      <ExportModal 
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExportModalSubmit}
        isLoading={exportLoading}
        loadingMessage={exportProgress}
        projectName={editedProjectName}
        estimatedPages={estimatedPages}
        projectId={projectId}
        t={i18n.t}
      />
      {/* Import Modal */}
      <ImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
        isLoading={importLoading}
        sectionName={selected ? structure[selected.area][selected.idx] : undefined}
      />
      
      {/* Global Export Loading Overlay */}
      {globalExportLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            color: 'white'
          }}
        >
          <CircularProgress
            size={80}
            sx={{
              mb: 3,
              color: 'white'
            }}
          />
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            Processing Your {globalExportFormat.toUpperCase()}...
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              maxWidth: '400px',
              opacity: 0.9
            }}
          >
            {globalExportFormat === 'pdf'
              ? 'This may take around 30 seconds depending on the size of your book and number of images.'
              : 'This may take around 5 seconds depending on the size of your book and number of images.'}
          </Typography>
        </Box>
      )}

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Metadata Dialog */}
      <Dialog 
        open={metadataDialogOpen} 
        onClose={() => {
          setMetadataDialogOpen(false);
          // After closing, select the Title Page section for editing
          const area = 'front';
          const idx = structure.front.findIndex(s => s === 'Title Page');
          if (idx !== -1) {
            setSelected({ area, idx });
          }
          // --- AUTOSAVE METADATA ON DIALOG CLOSE ---
          if (projectId && token) {
            http.put(`${ENV.API_URL}/projects/${projectId}`, {
              title: projectTitle,
              author: projectAuthor,
              subtitle: projectSubtitle,
              isbn: projectIsbn
            }).then(response => {

            }).catch(err => {
              console.error('Failed to save metadata on dialog close:', err);
            });
          }
        }}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>{getLocalizedMetadata(documentLanguage).metadata}</DialogTitle>
        <DialogContent>
          <TextField
            id="project-title"
            name="projectTitle"
            label={getLocalizedMetadata(documentLanguage).title}
            value={projectTitle}
            onChange={e => setProjectTitle(e.target.value)}
            required
            fullWidth
            margin="dense"
            error={!projectTitle}
            helperText={!projectTitle ? `${getLocalizedMetadata(documentLanguage).title} is required` : ''}
          />
          <TextField
            id="project-subtitle"
            name="projectSubtitle"
            label={getLocalizedMetadata(documentLanguage).subtitle}
            value={projectSubtitle}
            onChange={e => setProjectSubtitle(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            id="project-author"
            name="projectAuthor"
            label={getLocalizedMetadata(documentLanguage).author}
            value={projectAuthor}
            onChange={e => {

              setProjectAuthor(e.target.value);
            }}
            required
            fullWidth
            margin="dense"
            error={!projectAuthor}
            helperText={!projectAuthor ? `${getLocalizedMetadata(documentLanguage).author} is required` : ''}
          />
          <TextField
            id="project-isbn"
            name="projectIsbn"
            label={getLocalizedMetadata(documentLanguage).isbn}
            value={projectIsbn}
            onChange={e => setProjectIsbn(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMetadataDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Instructions Modal */}
      <Dialog open={instructionsOpen} onClose={() => setInstructionsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Instructions</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Title Page</Typography>
          <Typography variant="body2" paragraph>
            • Click the <b>Title Page</b> in the section list to enter your book's title, subtitle, and author.<br />
            • By default, the title page is auto-generated from your metadata.<br />
            • Enable <b>User Custom Title Page</b> if you want to design your own title page (advanced users only).<br />
            • <b>Title</b> and <b>Author</b> are required for export.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Importing Content</Typography>
          <Typography variant="body2" paragraph>
            • Use the <b>Import Content</b> button to upload .docx, .md, or .txt files, or import from Google Docs.<br />
            • Imported content will be placed in the selected section.<br />
            • Only supported file types are accepted. File size limit: 10 MB.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Exporting</Typography>
          <Typography variant="body2" paragraph>
            • Use the <b>Export Book</b> button to export your project as PDF, EPUB, DOCX, or HTML.<br />
            • Ensure your title and author are set before exporting.<br />
            • Customize export settings as needed for your publishing requirements.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInstructionsOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleCsvFileChange}
      />
      
      {/* Image Upload Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload an image. The path will be set automatically after upload.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              15 MB Max • Supported formats: JPEG, PNG, GIF, WebP
            </Typography>
            
            {uploading && (
              <Alert severity="info" sx={{ my: 2 }}>
                Uploading image... Please wait.
              </Alert>
            )}
            
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                // Validate file type
                if (!file.type.startsWith('image/')) {
                  setNotification({
                    open: true,
                    message: 'Please upload a valid image file (JPEG, PNG, GIF, WebP)',
                    severity: 'error'
                  });
                  return;
                }
                
                // Validate file size (15MB = 15 * 1024 * 1024 bytes)
                const maxSize = 15 * 1024 * 1024; // 15MB in bytes
                if (file.size > maxSize) {
                  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
                  setNotification({
                    open: true,
                    message: `Image file is too large (${fileSizeMB} MB). Maximum file size is 15 MB. Please choose a smaller image.`,
                    severity: 'error'
                  });
                  return;
                }
                
                if (/\s/.test(file.name)) {
                  setNotification({
                    open: true,
                    message: 'No spaces allowed in image name.',
                    severity: 'error'
                  });
                  return;
                }
                
                setUploading(true);
                
                // Use realImageService for proper image upload tracking
                realImageService.uploadImage(file)
                .then(data => {

                  setUploading(false);
                  if (data.success) {
                    // Use the URL from the upload response
                    const imageUrl = data.url || data.path || '';

                    setUploadedImagePath(imageUrl);
                    setImageCaption(file.name.replace(/\.[^/.]+$/, ""));
                    
                    setNotification({
                      open: true,
                      message: 'Image uploaded successfully! Your usage count has been updated.',
                      severity: 'success'
                    });
                  } else {
                    throw new Error(data.error || 'Upload failed');
                  }
                })
                .catch(error => {
                  console.error('Upload error:', error);
                  setUploading(false);
                  
                  // Handle specific error messages
                  let errorMessage = 'Upload failed. Please try again.';
                  if (error.message.includes('limit')) {
                    errorMessage = error.message;
                    setShowImagePurchaseModal(true);
                  }
                  
                  setNotification({
                    open: true,
                    message: errorMessage,
                    severity: 'error'
                  });
                });
              }}
            />
            
            <Button
              variant="contained"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              sx={{ mb: 2 }}
            >
              Select Image to Upload
            </Button>
            
            <TextField
              label="Image Path"
              fullWidth
              margin="normal"
              value={uploadedImagePath}
              placeholder="uploads/admin/test/your-image.png"
              helperText="Path is set automatically after upload. Manual entry is not supported."
              InputProps={{ readOnly: true }}
            />
            
            <TextField
              label="Caption"
              fullWidth
              margin="normal"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
            />
            
            <TextField
              label="Scale (0.1-2.0)"
              fullWidth
              margin="normal" 
              value={imageScale}
              onChange={(e) => setImageScale(e.target.value)}
              type="number"
              inputProps={{ step: 0.1, min: 0.1, max: 2 }}
            />
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                Preview of image tag:
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={`{{IMAGE:${uploadedImagePath || 'path/to/image.jpg'}|${imageCaption || 'Image caption'}|${imageScale}}}`}
                InputProps={{ readOnly: true }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (!uploadedImagePath) {
                setNotification({
                  open: true,
                  message: 'Please provide an image path',
                  severity: 'warning'
                });
                return;
              }
              
              // Create image tag
              const imageTag = `![${imageCaption || ''}](${uploadedImagePath})<!-- scale:${imageScale} -->`;

              
              // Insert at cursor position
              if (selected) {
                const { area, idx } = selected;
                const sectionName = structure[area][idx];
                const currentContent = content[`${area}:${sectionName}`] || '';
                const textarea = editorRef.current;
                

                
                if (textarea) {
                  const start = textarea.selectionStart || 0;
                  const end = textarea.selectionEnd || 0;
                  
                  // Insert at cursor
                  const updatedContent = 
                    currentContent.substring(0, start) + 
                    imageTag + 
                    currentContent.substring(end);
                  

                  
                  // Update content
                  handleContentChange(area, sectionName, updatedContent);
                  
                  // Update preview
                  if (viewMode === 'split' || viewMode === 'preview' as 'preview') {
                    generatePreview(updatedContent);
                  }
                  
                  // Set cursor position
                  setTimeout(() => {
                    if (textarea) {
                      textarea.focus();
                      const newPosition = start + imageTag.length;
                      textarea.setSelectionRange(newPosition, newPosition);
                    }
                  }, 100);
                }
                
                // Show success
                setNotification({
                  open: true,
                  message: 'Image tag inserted successfully',
                  severity: 'success'
                });
                
                // Close dialog
                setImageDialogOpen(false);
              }
            }}
            variant="contained" 
            color="primary"
            disabled={!uploadedImagePath}
          >
            Insert Image
          </Button>
        </DialogActions>
      </Dialog>
      
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleCsvFileChange}
      />

      {/* Section Name Edit Dialog */}
      <Dialog 
        open={editing !== null} 
        onClose={() => setEditing(null)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Edit Section Name</DialogTitle>
        <DialogContent>
          <TextField
            id="section-name-edit"
            name="sectionName"
            label="Section Name"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            required
            fullWidth
            margin="dense"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && editing) {
                handleEditSave(editing.area, editing.idx);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button 
            onClick={() => editing && handleEditSave(editing.area, editing.idx)} 
            variant="contained" 
            color="primary"
            disabled={!editValue.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Slot Purchase Modal */}
      <ImageSlotPurchaseModal
        open={showImagePurchaseModal}
        onClose={() => setShowImagePurchaseModal(false)}
        onSuccess={() => {
          setShowImagePurchaseModal(false);
          // Refresh the page to update image usage stats
          window.location.reload();
        }}
      />
    </Box>
  );
};

export default ProjectWorkspace; 
