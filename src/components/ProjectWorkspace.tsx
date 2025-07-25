import React, { useState, useEffect, useRef } from 'react';
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
  Alert, Snackbar,
  Paper, ToggleButtonGroup, ToggleButton,
  ListSubheader, Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
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
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Papa from 'papaparse';

import ExportModal, { ExportSettings } from './ExportModal';
import ImportModal, { ImportSettings } from './ImportModal';
import { ExportService } from '../services/ExportService';
import { FormatAdapter } from '../services/FormatAdapter';
import { TEMPLATES } from '../constants/FormatConstants';

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
  [key: string]: any;
}

// Define API URL
const API_URL = process.env.REACT_APP_EXPORT_API_URL || 'https://publishjockey-export.onrender.com';

// Define ProjectWorkspace component properly
const ProjectWorkspace = ({ projectId }: ProjectWorkspaceProps): React.ReactElement => {
  // Structure state
  const [structure, setStructure] = useState({
    front: [
      "Title Page",
      "Copyright",
      "Disclaimer",
      "Acknowledgments",
      "Foreword",
      "Introduction"
    ],
    main: ["Chapter 1", "Chapter 2", "Chapter 3"],
    back: ["Appendix", "References"]
  });
  
  const [selected, setSelected] = useState<{ area: keyof typeof structure; idx: number } | null>(null);
  const [expanded, setExpanded] = useState({ front: true, main: true, back: true });
  const [editing, setEditing] = useState<{ area: keyof typeof structure; idx: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editingProjectName, setEditingProjectName] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState('');
  
  // Content state
  const [content, setContent] = useState<Record<string, string>>({});
  
  // Import state
  const [importOpen, setImportOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  
  // Basic UI state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Editor state
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [recentlyImported, setRecentlyImported] = useState(false);
  
  // Use navigation state for initial title if available
  const location = useLocation();
  const initialTitle = location.state?.title || '';
  const [projectTitle, setProjectTitle] = useState(initialTitle);
  const [projectSubtitle, setProjectSubtitle] = useState('');
  const [projectAuthor, setProjectAuthor] = useState('');
  
  // Add state for metadata dialog and custom title page toggle
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  
  // Add state for instructions modal
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  
  // Add state for ISBN
  const [projectIsbn, setProjectIsbn] = useState('');
  
  // State for project title
  const [loadingProject, setLoadingProject] = useState(true);

  
  // Get auth token from localStorage
  const token = localStorage.getItem('token');
  
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
      setLoadingProject(true);

      try {
        // Use token from context instead of localStorage
        const res = await axios.get<ProjectApiResponse>(`http://localhost:3001/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Project data from API:', res.data);
        
        // Handle different API response structures (data vs project property)
        const projectData = res.data.project || res.data.data || res.data;
        
        // Set project title
        setProjectTitle(projectData.title || 'Untitled Book');
        
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
          console.log('Loading content from backend:', Object.keys(projectData.content).length, 'sections');
          setContent(projectData.content);
        } else {
          console.log('No content found in project data');
        }
        
        // Load structure from backend if available
        if (projectData.structure) {
          console.log('Loading structure from backend:', JSON.stringify(projectData.structure, null, 2));
          
          // Ensure front matter has Title Page and Copyright in the correct positions
          let structureToUse = JSON.parse(JSON.stringify(projectData.structure));
          
          // Validate front matter structure - ensure Title Page and Copyright are first two entries
          if (structureToUse.front) {
            // Remove Title Page and Copyright if they exist elsewhere in the array
            const titlePageIndex = structureToUse.front.findIndex(s => s === 'Title Page');
            const copyrightIndex = structureToUse.front.findIndex(s => s === 'Copyright');
            
            // Create a clean front matter array without Title Page and Copyright
            const cleanFront = structureToUse.front.filter(
              s => s !== 'Title Page' && s !== 'Copyright'
            );
            
            // Reconstruct the front matter with Title Page and Copyright at the beginning
            structureToUse.front = ['Title Page', 'Copyright', ...cleanFront];
            
            // Log the correction if we made changes
            if (titlePageIndex > 0 || (copyrightIndex > 0 && copyrightIndex !== 1)) {
              console.log('Fixed front matter order to ensure Title Page and Copyright are at the beginning');
              setNotification({
                open: true,
                message: 'Book structure was adjusted to ensure proper front matter arrangement',
                severity: 'info'
              });
            }
          }
          
          setStructure(structureToUse);
        } else {
          console.log('No structure found in project data, using default');
        }
        
        // Synchronize structure with content - add any chapters in content that don't exist in structure
        if (projectData.content) {
          // Create a temporary structure to work with
          let updatedStructure = projectData.structure ? { ...projectData.structure } : { ...structure };
          let structureUpdated = false;
          
          // Get all content keys in the format "area:sectionName"
          const contentKeys = Object.keys(projectData.content);
          
          // Check each content key to see if it exists in structure
          contentKeys.forEach(key => {
            const parts = key.split(':');
            if (parts.length === 2) {
              const area = parts[0] as keyof typeof structure;
              const sectionName = parts[1];
              
              // Check if this section exists in the structure for its area
              if (updatedStructure[area] && !updatedStructure[area].includes(sectionName)) {
                console.log(`Adding missing section to structure: ${area}:${sectionName}`);
                updatedStructure[area] = [...updatedStructure[area], sectionName];
                structureUpdated = true;
              }
            }
          });
          
          // Update structure state if changes were made
          if (structureUpdated) {
            console.log('Updated structure to include all content sections:', updatedStructure);
            setStructure(updatedStructure);
          }
        }
      } catch (err) {
        console.error('Project fetch error:', err);

        setProjectTitle('');
      } finally {
        setLoadingProject(false);
      }
    }
    if (projectId && token) fetchProject();
  }, [projectId, token]);
  
  // Autosave content to backend whenever it changes
  useEffect(() => {
    if (!projectId || !token) return;
    
    // Create a function to handle the actual save
    const saveContent = async () => {
      try {
        console.log('Executing autosave for content with', Object.keys(content).length, 'sections');
        
        // Track autosave start time for performance monitoring
        const startTime = Date.now();
        
        interface ProjectSaveResponse {
          project: {
            content?: Record<string, string>;
            structure?: {
              front: string[];
              main: string[];
              back: string[];
            };
            author?: string;
            subtitle?: string;
            isbn?: string;
            [key: string]: any;
          };
          [key: string]: any;
        }
        
        const response = await axios.put<ProjectSaveResponse>(`http://localhost:3001/api/projects/${projectId}`, {
          title: projectTitle,
          content,
          structure, // Include structure in the save
          author: projectAuthor,
          subtitle: projectSubtitle,
          isbn: projectIsbn
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Calculate save duration
        const duration = Date.now() - startTime;
        
        console.log(`Autosave successful (${duration}ms):`, {
          projectId,
          sections: Object.keys(content).length,
          responseData: response.data
        });
        
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
      } catch (err: any) {
        console.error('Autosave failed:', err);
        
        // Show more detailed error information
        if (err.response) {
          console.error('Server error response:', {
            status: err.response.status,
            data: err.response.data
          });
          
          // If token is expired (401) or invalid, show a notification
          if (err.response.status === 401) {
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
  
  // Prefill Copyright page if not set or if author changes
  useEffect(() => {
    const copyrightKey = 'front:Copyright';
    const currentYear = new Date().getFullYear();
    const authorName = projectAuthor && projectAuthor.trim() ? projectAuthor : 'Author Name';
    const defaultCopyright = `Copyright © ${currentYear} ${authorName}\n\nAll rights reserved. No part of this book may be reproduced in any form or by any electronic or mechanical means, including information storage and retrieval systems, without written permission from the author, except for the use of brief quotations in a book review.`;
    
    // Always update the copyright text when author changes
    console.log('Updating copyright text with current author:', authorName);
    setContent(prev => ({
      ...prev,
      [copyrightKey]: defaultCopyright
    }));
    
  }, [projectAuthor]); // Only run when author changes
  
  // Standardize handleAdd function to work equally for all matter sections
  const handleAdd = (area: keyof typeof structure) => {
    // Create a dialog to get the section name
    const newSectionName = prompt(`Add a new section to ${area} matter`, area === 'main' ? 'Chapter' : 'Section');
    
    if (newSectionName && newSectionName.trim() !== '') {
      // Add the section to the structure
      const updatedStructure = { ...structure };
      updatedStructure[area] = [...updatedStructure[area], newSectionName.trim()];
      setStructure(updatedStructure);
      
      // Create default content for the new section
      const contentKey = `${area}:${newSectionName.trim()}`;
      const defaultContent = area === 'main' 
        ? `# ${newSectionName.trim()}\n\n*Insert your content here...*`
        : `# ${newSectionName.trim()}\n\n*Insert your content here...*`;
      
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
      console.log('Saving new section and content to backend:', contentKey);
      
      // Show saving notification
      setNotification({
        open: true,
        message: 'Saving new section...',
        severity: 'info'
      });
      
      // Save to backend with explicit request
      axios.put(`http://localhost:3001/api/projects/${projectId}`, {
        title: projectTitle,
        structure: updatedStructure,
        content: updatedContent,
        author: projectAuthor,
        subtitle: projectSubtitle,
        isbn: projectIsbn
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log('New section saved successfully:', response.data);
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
  const handleDelete = (area: keyof typeof structure, idx: number) => {
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
  const handleEdit = (area: keyof typeof structure, idx: number) => {
    setEditing({ area, idx });
    setEditValue(structure[area][idx]);
  };

  // Save rename
  const handleEditSave = (area: keyof typeof structure, idx: number) => {
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
  const handleExpand = (area: keyof typeof structure) => {
    // Toggle the expanded state of the specific area
    setExpanded(prev => ({
      ...prev,
      [area]: !prev[area]
    }));
  };

  // Markdown editor handlers
  const handleContentChange = (area: keyof typeof structure, section: string, value: string) => {
    // Log more detailed information for debugging
    console.log(`Content changed for ${area}:${section}`, {
      contentLength: value.length,
      preview: value.substring(0, 50) + '...',
      key: `${area}:${section}`
    });
    
    setContent(prev => {
      // Create a new content object with the updated value
      const newContent = { ...prev, [`${area}:${section}`]: value };
      
      // Trigger immediate save for this content by clearing and setting the timeout
      if (debouncedSave.current) {
        clearTimeout(debouncedSave.current);
      }
      
      // Double check that the content was actually updated
      if (prev[`${area}:${section}`] !== value) {
        console.log(`Content differs - saving changes for ${area}:${section}`);
        
        debouncedSave.current = setTimeout(() => {
          // Show a brief "Saving..." notification
          setNotification({
            open: true,
            message: 'Saving changes...',
            severity: 'info'
          });
          
          // Create a backup of the content first
          const contentBackup = JSON.stringify(newContent);
          console.log(`Content backup size: ${contentBackup.length} bytes`);
          
          // Call the autosave function directly using the new content
          axios.put(`http://localhost:3001/api/projects/${projectId}`, {
            content: newContent,
            structure, // Include structure in the save
            author: projectAuthor,
            subtitle: projectSubtitle,
            isbn: projectIsbn,
            // Add a timestamp to ensure the request is unique
            _timestamp: Date.now()
          }, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(response => {
            console.log('Content saved successfully:', {
              responseStatus: response.status,
              responseData: response.data ? 'Data received' : 'No data',
              contentCount: Object.keys(newContent).length
            });
            
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
        console.log('Content unchanged - no save needed');
      }
      
      return newContent;
    });
  };
  



  // Handle export from modal
  const handleExportModalSubmit = (settings: ExportSettings) => {
    console.log('Export modal submitted with settings:', settings);
    // Call the main export function with the format from settings
    handleExport(settings.format, settings);
  };

  // Enhanced export handler with special title page handling
  const handleExport = async (format: string, settings: ExportSettings) => {
    console.log('Starting export process for format:', format);
    try {
      // First, make sure all content is saved
      try {
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
        await axios.put(`http://localhost:3001/api/projects/${projectId}`, {
          content,
          structure,
          author: projectAuthor,
          subtitle: projectSubtitle,
          isbn: projectIsbn,
          _forceSave: true,
          _timestamp: Date.now()
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Successfully saved all content before export');
      } catch (saveError) {
        console.error('Error saving content before export:', saveError);
        if (!window.confirm('There was an error saving your content before export. Do you want to continue anyway?')) {
          return;
        }
      }
      
      // Validate export server is running
      try {
        const response = await axios.get(`${API_URL}/health`);
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
        return;
      }
      
      // Start loading state
      setExportLoading(true);
      
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
      
      // Create metadata object for export with title, subtitle, and author
      const metadata = {
        title: projectTitle,
        subtitle: projectSubtitle || '',
        author: projectAuthor || '',
        isbn: projectIsbn || ''
      };
      
      console.log('Using project metadata:', JSON.stringify(metadata, null, 2));
      
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
        structure[area as keyof typeof structure].forEach(sectionName => {
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
      
      console.log(`Exporting project to ${format} with ${project.sections.length} sections`);
      console.log('Export sections in order:', project.sections.map(s => s.title));
      
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
        
        // Remove automatic download: do NOT create or click an anchor here
        // Only show the export completion dialog (handled by ExportTimingManager)
        // If needed, you can use fileUrl for logging or debugging, but do not use it to trigger a download
        console.log('Export successful, file URL:', fileUrl);
        
        setNotification({
          open: true,
          message: 'Export completed successfully!',
          severity: 'success'
        });
      } catch (error: any) {
        console.error('Export service error:', error);
        setNotification({
          open: true,
          message: `Export failed: ${error.message || 'Unknown error'}`,
          severity: 'error'
        });
      }
      
      setExportLoading(false);
    } catch (err: any) {
      console.error('Export error:', err);
      setNotification({
        open: true,
        message: `Export error: ${err.message || 'Unknown error'}`,
        severity: 'error'
      });
      setExportLoading(false);
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
    console.log(`Parsed ${sections.length} sections from imported markdown`);
    sections.forEach((s, i) => console.log(`Section ${i+1}: "${s.title}" (${s.content.length} bytes)`));
    
    // Create index-based map of all sections in the structure for ordered lookup
    // This preserves the correct order from the structure
    const orderedSectionMap: Record<string, { area: string, name: string, order: number }> = {};
    
    ['front', 'main', 'back'].forEach(area => {
      structure[area as keyof typeof structure].forEach((sectionName, idx) => {
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
    
    console.log('Section structure for matching:', Object.keys(orderedSectionMap).length, 'mappings created');
    
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
          console.log(`Matched "${sectionTitle}" to "${area}:${name}" (exact match)`);
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
                console.log(`Matched "${sectionTitle}" to "front:${name}" (front matter match)`);
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
              console.log(`Matched "${sectionTitle}" to "main:${matchingSection}" (chapter match)`);
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
                console.log(`Matched "${sectionTitle}" to "back:${name}" (back matter match)`);
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
          console.log(`Assigned unmatched section "${sectionTitle}" to selected section "${area}:${sectionName}"`);
        }
      }
    });
    
    // Sort matched sections by their order to preserve structure sequence
    matchedSections.sort((a, b) => a.order - b.order);
    
    // Add each section to the result, preserving order
    matchedSections.forEach(({ key, content }) => {
      result[key] = content;
    });
    
    console.log(`Processed ${Object.keys(result).length} sections for import in correct order`);
    
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
          const response = await axios.post<ImportResponse>(`${API_URL}/import`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
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
          const response = await axios.post<ImportResponse>(`${API_URL}/import/google`, {
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
            const area = parts[0] as keyof typeof structure;
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
      const area = 'front';
      const idx = structure.front.findIndex(s => s === 'Title Page');
      if (idx !== -1) {
        const key = `${area}:Title Page`;
        // Only set if empty or matches the previous auto-generated template
        const current = content[key] || '';
        const autoGenPattern = /^# .+\n*(## .+\n*)?\n*By .+\n*(ISBN: .+)?/;
        if (!current.trim() || autoGenPattern.test(current.trim())) {
          let constructed = `# ${projectTitle}`;
          if (projectSubtitle) constructed += `\n\n## ${projectSubtitle}`;
          constructed += `\n\nBy ${projectAuthor}`;
          if (projectIsbn) constructed += `\n\nISBN: ${projectIsbn}`;
          setContent(prev => ({ ...prev, [key]: constructed }));
        }
      }
    }
    // Only run when dialog closes or metadata changes
  }, [metadataDialogOpen, projectTitle, projectSubtitle, projectAuthor, projectIsbn, structure.front]);

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
  const [imageScale, setImageScale] = useState('1.0');
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
    
    console.log('Cleaned structure:', cleanedStructure);
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
      console.log('Structure was repaired during validation');
    }
    
    return validatedStructure;
  };

  // Function to save structure to backend
  const saveStructureToBackend = async (structureToSave: typeof structure): Promise<void> => {
    try {
      console.log('Saving structure to backend after reordering');
      
      // Always use the provided structure parameter if available, only fall back to current state if not
      const structureToUse = structureToSave || structure;
      
      // Validate and repair structure before saving
      const validatedStructure = validateAndRepairStructure(structureToUse);
      
      // Deep clone to avoid any reference issues
      const structureClone = JSON.parse(JSON.stringify(validatedStructure));
      
      // Log what we're actually saving
      console.log('Structure being saved:', JSON.stringify(structureClone, null, 2));
      
      interface ProjectSaveResponse {
        project?: {
          structure?: typeof structure;
          [key: string]: any;
        };
        data?: {
          structure?: typeof structure;
          [key: string]: any;
        };
        structure?: typeof structure;
        success?: boolean;
        message?: string;
        [key: string]: any;
      }
      
      const response = await axios.put<ProjectSaveResponse>(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/projects/${projectId}`,
        {
          title: projectTitle,
          structure: structureClone,
          author: projectAuthor,
          subtitle: projectSubtitle,
          isbn: projectIsbn
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data && response.data.success !== false) {
        console.log('Structure saved successfully after reordering');
        
        // Update the structure state with what was returned from the server (if available)
        const serverStructure = response.data.project?.structure || 
                               response.data.data?.structure || 
                               response.data.structure;
        
        if (serverStructure) {
          console.log('Updated structure from server:', serverStructure);
          // Deep clone any structure received from server to avoid reference issues
          const clonedServerStructure = JSON.parse(JSON.stringify(serverStructure));
          
          // Validate the structure received from server
          const validatedServerStructure = validateAndRepairStructure(clonedServerStructure);
          
          setStructure(validatedServerStructure);
        }
      } else {
        console.error('Error saving structure:', response.data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error saving structure to backend:', error);
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
        console.log('Found invalid entries in structure, cleaning up...');
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
      console.log('Validating book structure after load');
      const validatedStructure = validateAndRepairStructure(structure);
      
      // Only update if changes were made to avoid infinite loops
      if (JSON.stringify(validatedStructure) !== JSON.stringify(structure)) {
        console.log('Structure was modified during validation, updating state');
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
      console.log('==== CONTENT VERIFICATION LOG ====');
      console.log(`Project ID: ${projectId}`);
      console.log(`Total sections in content: ${Object.keys(content).length}`);
      console.log(`Structure sections: ${Object.values(structure).flat().length}`);
      
      // Log all sections with their content size
      console.log('Content map:');
      Object.entries(content).forEach(([key, value]) => {
        console.log(`${key}: ${(value || '').length} chars ${value ? '✓' : '⚠️ EMPTY'}`);
      });
      
      // Check if there are any sections in structure not in content
      console.log('Structure check:');
      ['front', 'main', 'back'].forEach(area => {
        structure[area as keyof typeof structure].forEach(sectionName => {
          const key = `${area}:${sectionName}`;
          if (!(key in content)) {
            console.warn(`⚠️ MISSING CONTENT: ${key}`);
          } else if (!content[key] || content[key].trim() === '') {
            console.warn(`⚠️ EMPTY CONTENT: ${key}`);
          }
        });
      });
      
      console.log('================================');
    }
  }, [loadingProject, content, structure, projectId]);
  
  // Wrap the main JSX in DndProvider
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
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
                  // Save to database using axios (reuse the existing authorization)
                  axios.put(`http://localhost:3001/api/projects/${projectId}`, {
                    title: editedProjectName,
                    author: projectAuthor,
                    subtitle: projectSubtitle,
                    isbn: projectIsbn
                  }, {
                    headers: { Authorization: `Bearer ${token}` }
                  }).then(response => {
                    console.log('Project title saved successfully:', response.data);
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
                    // Save to database using axios
                    axios.put(`http://localhost:3001/api/projects/${projectId}`, {
                      title: editedProjectName,
                      author: projectAuthor,
                      subtitle: projectSubtitle,
                      isbn: projectIsbn
                    }, {
                      headers: { Authorization: `Bearer ${token}` }
                    }).then(response => {
                      console.log('Project title saved successfully:', response.data);
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
                  {area.charAt(0).toUpperCase() + area.slice(1)} Matter
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleAdd(area as keyof typeof structure)}
                    aria-label={`Add section to ${area} matter`}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleExpand(area as keyof typeof structure)}
                    aria-label={`Expand ${area} matter`}
                  >
                    {expanded[area as keyof typeof expanded] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </ListSubheader>
              
              {/* Area Content */}
              <Collapse in={expanded[area as keyof typeof expanded]}>
                <List disablePadding>
                  {structure[area as keyof typeof structure].map((section, sectionIdx) => (
                    <ListItem
                      key={`${area}-${sectionIdx}`}
                      button
                      selected={selected ? selected.area === area && selected.idx === sectionIdx : false}
                      onClick={() => setSelected({ area: area as keyof typeof structure, idx: sectionIdx })}
                      sx={{ 
                        pl: 4, 
                        borderLeft: selected && selected.area === area && selected.idx === sectionIdx ? '3px solid #4fd1c5' : 'none',
                        position: 'relative',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          '& .section-actions': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <ListItemText primary={section} />
                      <Box 
                        className="section-actions" 
                        sx={{ 
                          opacity: 0, 
                          transition: 'opacity 0.2s',
                          display: 'flex'
                        }}
                      >
                        {/* Show Edit and Delete buttons for all sections now */}
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(area as keyof typeof structure, sectionIdx); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        {/* Hide delete button for Title Page and Copyright */}
                        {!(area === 'front' && (section === 'Title Page' || section === 'Copyright')) && (
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(area as keyof typeof structure, sectionIdx); }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                        
                        {/* Add Metadata Required button for Title Page */}
                        {area === 'front' && section === 'Title Page' && (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setMetadataDialogOpen(true); 
                            }}
                            sx={{ ml: 1, fontSize: '0.7rem', py: 0.25 }}
                          >
                            Metadata Required
                          </Button>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Editor Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
            {selected ? structure[selected.area][selected.idx] : "No section selected"}
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
            <Tooltip title="Import">
              <Button 
                variant="text" 
                startIcon={<ImportExportIcon />}
                onClick={() => setImportOpen(true)}
                sx={{ mr: 1 }}
              >
                Import
              </Button>
            </Tooltip>
            <Tooltip title="Manual Save">
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
                  axios.put(`http://localhost:3001/api/projects/${projectId}`, {
                    title: projectTitle,
                    content,
                    structure, // Include structure in the save
                    author: projectAuthor,
                    subtitle: projectSubtitle,
                    isbn: projectIsbn,
                    _forceSave: true,
                    _timestamp: Date.now()
                  }, {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  .then(response => {
                    console.log('Manual save successful:', {
                      contentCount: Object.keys(content).length,
                      structureSections: Object.values(structure).reduce((total, arr) => total + arr.length, 0)
                    });
                    
                    setNotification({
                      open: true,
                      message: 'All content saved successfully',
                      severity: 'success'
                    });
                  })
                  .catch(err => {
                    console.error('Manual save failed:', err);
                    
                    setNotification({
                      open: true,
                      message: 'Error saving content. Please try again.',
                      severity: 'error'
                    });
                  });
                }}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
            </Tooltip>
            <Tooltip title="Export">
              <Button 
                variant="text" 
                startIcon={<CloudDownloadIcon />}
                onClick={() => setExportDialogOpen(true)}
              >
                Export
              </Button>
            </Tooltip>
          </Box>
        </Box>
        
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
                  label={selected ? `Editing: ${structure[selected.area][selected.idx]}` : "No section selected"}
                  multiline
                  fullWidth
                  minRows={20}
                  value={selected ? content[`${selected.area}:${structure[selected.area][selected.idx]}`] || '' : ''}
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
                    dangerouslySetInnerHTML={{ __html: previewHtml }} 
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
              Select a section to edit
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
        projectName={editedProjectName}
      />
      {/* Import Modal */}
      <ImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
        isLoading={importLoading}
        sectionName={selected ? structure[selected.area][selected.idx] : undefined}
      />
      
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
            axios.put(`http://localhost:3001/api/projects/${projectId}`, {
              title: projectTitle,
              author: projectAuthor,
              subtitle: projectSubtitle,
              isbn: projectIsbn,
            }, {
              headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
              console.log('Metadata autosaved on dialog close');
            })
            .catch(err => {
              console.error('Failed to autosave metadata on dialog close:', err);
            });
          }
        }}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Title Page Metadata</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={projectTitle}
            onChange={e => setProjectTitle(e.target.value)}
            required
            fullWidth
            margin="dense"
            error={!projectTitle}
            helperText={!projectTitle ? 'Title is required' : ''}
          />
          <TextField
            label="Subtitle (optional)"
            value={projectSubtitle}
            onChange={e => setProjectSubtitle(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Author"
            value={projectAuthor}
            onChange={e => setProjectAuthor(e.target.value)}
            required
            fullWidth
            margin="dense"
            error={!projectAuthor}
            helperText={!projectAuthor ? 'Author is required' : ''}
          />
          <TextField
            label="ISBN (optional)"
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
                
                if (/\s/.test(file.name)) {
                  alert('No spaces allowed in image name.');
                  return;
                }
                
                setUploading(true);
                
                // Create form data
                const formData = new FormData();
                formData.append('file', file); // Use 'file' as the field name
                formData.append('projectId', projectId); // Add projectId for backend validation
                
                // Use export backend for image uploads (has Cloudinary support and /api/uploads endpoint)
                const EXPORT_API_URL = process.env.REACT_APP_EXPORT_API_URL || 'https://publishjockey-export.onrender.com';
                fetch(`${EXPORT_API_URL}/api/uploads`, {
                  method: 'POST',
                  body: formData,
                  headers: { 
                    'Authorization': `Bearer ${token}` 
                  }
                })
                .then(res => res.json())
                .then(data => {
                  setUploading(false);
                  if (data.success && data.path) {
                    // Format image path
                    const path = data.path.replace(/\\/g, '/');
                    setUploadedImagePath(path);
                    setImageCaption(file.name.replace(/\.[^/.]+$/, ""));
                  } else {
                    throw new Error(data.error || 'Upload failed');
                  }
                })
                .catch(error => {
                  console.error('Upload error:', error);
                  setUploading(false);
                  setNotification({
                    open: true,
                    message: 'Upload failed. Please try again.',
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
              const imageTag = `{{IMAGE:${uploadedImagePath}|${imageCaption || 'Image caption'}|${imageScale}}}`;
              
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
    </Box>
  );
};

export default ProjectWorkspace; 