import React, { useState, useEffect, useCallback } from 'react';
import ExportCompletionDialog from './ExportCompletionDialog';
import axios from 'axios';

interface TimingInfo {
  pdf?: number;
  epub?: number;
  word?: number;
}

interface ExportData {
  blob?: Blob | null;
  format: 'pdf' | 'epub' | 'word';
  fileName: string;
  fileId?: string;
}

// New interface to track fileIds by format
interface FileIdMap {
  pdf?: string;
  epub?: string;
  word?: string;
  [key: string]: string | undefined;
}

interface ExportTimingManagerProps {
  children: React.ReactNode;
}

/**
 * Component that manages export timing and displays the export completion dialog
 * This component should wrap around your export buttons or export functionality
 */
const ExportTimingManager: React.FC<ExportTimingManagerProps> = ({ children }) => {
  console.log('ExportTimingManager component mounted');

  const [exportFormat, setExportFormat] = useState<'pdf' | 'epub' | 'word' | null>(null);
  const [exportStartTime, setExportStartTime] = useState<number | null>(null);
  const [completionDialogOpen, setCompletionDialogOpen] = useState<boolean>(false);
  const [timings, setTimings] = useState<TimingInfo>({});
  const [projectTitle, setProjectTitle] = useState<string>('export');
  
  // Replace simple array with structured object to track fileIds by format
  const [fileIdMap, setFileIdMap] = useState<FileIdMap>({});
  
  const [exportBlobs, setExportBlobs] = useState<Record<string, Blob>>({});

  // Method to start timing an export
  const startExport = useCallback((format: 'pdf' | 'epub' | 'word', title?: string) => {
    setExportFormat(format);
    setExportStartTime(Date.now());
    if (title) {
      setProjectTitle(title);
    }
  }, []);

  // New method to handle exports with blobs directly
  const finishExportWithBlob = useCallback((exportData: ExportData) => {
    console.log('finishExportWithBlob called with data:', {
      format: exportData.format,
      fileId: exportData.fileId || 'none',
      blobSize: exportData.blob ? exportData.blob.size : 'no blob (using fileId)',
      fileName: exportData.fileName
    });
    
    if (exportStartTime) {
      const endTime = Date.now();
      const durationSeconds = ((endTime - exportStartTime) / 1000).toFixed(1);
      
      console.log(`Export timing: ${durationSeconds} seconds for ${exportData.format}`);
      
      setTimings(prev => ({
        ...prev,
        [exportData.format]: parseFloat(durationSeconds)
      }));
      
      // Only store the blob if it exists
      if (exportData.blob) {
        setExportBlobs(prev => ({
          ...prev,
          [exportData.format]: exportData.blob
        }));
      }
      
      // Store fileId in the structured map if provided
      if (exportData.fileId) {
        console.log(`Storing fileId for format ${exportData.format}:`, exportData.fileId);
        setFileIdMap(prev => ({
          ...prev,
          [exportData.format]: exportData.fileId
        }));
      }
      
      setCompletionDialogOpen(true);
    } else {
      console.warn('finishExportWithBlob called but exportStartTime is null');
    }
  }, [exportStartTime]);

  // Legacy method for backward compatibility
  const finishExport = useCallback((format: 'pdf' | 'epub' | 'word', downloadUrl: string | null, fileId?: string) => {
    console.warn('Legacy finishExport called - dialog-only export will be used');
    if (exportStartTime && exportFormat === format) {
      const endTime = Date.now();
      const durationSeconds = ((endTime - exportStartTime) / 1000).toFixed(1);
      
      setTimings(prev => ({
        ...prev,
        [format]: parseFloat(durationSeconds)
      }));
      
      // Store fileId in the structured map if provided
      if (fileId) {
        console.log(`Storing fileId for format ${format} (legacy method):`, fileId);
        setFileIdMap(prev => ({
          ...prev,
          [format]: fileId
        }));
      }
      
      // Force dialog-only export - ignore any downloadUrl provided
      // This prevents automatic downloads completely
      
      // DO NOT create or use any download URLs
      // downloadUrl parameter is intentionally ignored
      
      setCompletionDialogOpen(true);
    }
  }, [exportStartTime, exportFormat]);

  // Method to handle download button clicks
  const handleDownload = useCallback((format: string, title: string = projectTitle) => {
    // Format filename using project title with underscores for spaces
    const formattedTitle = title.replace(/\s+/g, '_').replace(/[^\w-]/g, '');
    const fileName = `${formattedTitle}.${format === 'word' ? 'docx' : format}`;
    
    console.log(`USER-INITIATED DOWNLOAD: ${fileName} (format: ${format})`);
    console.log('Available fileIds by format:', fileIdMap);
    
    // Get the fileId directly from the map for this format
    const fileId = fileIdMap[format];
    
    if (fileId) {
      console.log('Using fileId for explicit download:', fileId);
      
      // Create a direct download link to the server's explicit file endpoint
      // Include the desired filename as a query parameter
      const downloadUrl = `http://localhost:3002/api/files/${fileId}?filename=${encodeURIComponent(fileName)}`;
      
      console.log(`Creating download with URL: ${downloadUrl}`);
      
      try {
        // Create a temporary anchor element for download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName; // Suggest filename to browser
        a.target = '_blank'; // Open in new tab/window to avoid interference
        a.rel = 'noopener noreferrer';
        a.style.display = 'none';
        
        // Add to DOM, click, then remove
        document.body.appendChild(a);
        console.log('Download anchor created and appended to body');
        
        // Trigger click with a slight delay to ensure proper attachment
        setTimeout(() => {
          console.log('Clicking download anchor...');
          a.click();
          
          // Remove after a reasonable delay
          setTimeout(() => {
            document.body.removeChild(a);
            console.log('Download anchor removed from body');
          }, 1000);
        }, 100);
      } catch (error) {
        console.error('Error creating download:', error);
        
        // Fallback: direct navigation as last resort
        console.log('Trying fallback: direct navigation to', downloadUrl);
        window.location.href = downloadUrl;
      }
    } 
    // Fallback to blob approach if no fileId is available (legacy support)
    else if (exportBlobs[format]) {
      console.log('Falling back to blob for download (no fileId available)');
      
      // Create a temporary URL from the blob
      const url = window.URL.createObjectURL(exportBlobs[format]);
      
      // Create a temporary anchor to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      
      // Add to DOM, click, then remove and revoke URL
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } else {
      console.error(`No file found for format: ${format}. Available formats in fileIdMap:`, 
        Object.keys(fileIdMap).filter(k => fileIdMap[k]),
        'Available formats in exportBlobs:', Object.keys(exportBlobs));
      alert(`Download failed: No file available for ${format} format. Please try exporting again.`);
    }
  }, [exportBlobs, projectTitle, fileIdMap]);

  // Schedule cleanup of temporary files after 15 minutes
  useEffect(() => {
    // Get all fileIds from the map
    const fileIds = Object.values(fileIdMap).filter(id => id) as string[];
    
    if (fileIds.length > 0) {
      const cleanupTimer = setTimeout(() => {
        // Call server to delete temporary files
        try {
          fileIds.forEach(async (fileId) => {
            await axios.delete(`http://localhost:3002/cleanup/${fileId}`);
          });
          console.log('Cleaned up temporary export files');
          setFileIdMap({});
        } catch (error) {
          console.error('Failed to clean up temporary files:', error);
        }
      }, 15 * 60 * 1000); // 15 minutes

      return () => {
        clearTimeout(cleanupTimer);
      };
    }
  }, [fileIdMap]);

  // Expose the timing methods via window for external components to access
  useEffect(() => {
    // Add to window object for external access
    (window as any).exportTiming = {
      startExport,
      finishExport,
      finishExportWithBlob,
      autoDownloadDisabled: true, // Explicitly flag that auto-downloads are disabled
      handleDownloadOnly: (blob: Blob, format: string, fileName: string) => {
        // Store the blob and show the dialog, but don't trigger an automatic download
        if (blob) {
          setExportBlobs(prev => ({
            ...prev,
            [format]: blob
          }));
          
          setProjectTitle(fileName.split('.')[0]);
          setCompletionDialogOpen(true);
          console.log('Export data received, showing dialog only - no automatic download');
        }
      }
    };

    return () => {
      // Clean up when component unmounts
      delete (window as any).exportTiming;
    };
  }, [startExport, finishExport, finishExportWithBlob]);

  return (
    <>
      {/* Render children as-is */}
      {children}
      
      {/* Render the completion dialog */}
      <ExportCompletionDialog
        open={completionDialogOpen}
        onClose={() => setCompletionDialogOpen(false)}
        timings={timings}
        onDownload={handleDownload}
        projectTitle={projectTitle}
      />
    </>
  );
};

export default ExportTimingManager; 