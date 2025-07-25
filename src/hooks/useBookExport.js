import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_EXPORT_API_URL || 'https://publishjockey-export.onrender.com';

/**
 * Hook for handling book exports with fair use protection
 */
const useBookExport = () => {
  // Explicitly disable automatic downloads
  const autoDownloadDisabled = true;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fairUseViolation, setFairUseViolation] = useState(null);
  
  /**
   * Export book to various formats
   * @param {String} format - Export format (pdf, epub, docx)
   * @param {Array} sections - Book sections to export
   * @param {Object} exportOptions - Export options including projectId and userId
   * @returns {Promise} - The export response or fair use violation
   */
  const exportBook = async (format, sections, exportOptions) => {
    if (!format || !sections || sections.length === 0) {
      setError('Invalid export parameters');
      return null;
    }
    
    setLoading(true);
    setError(null);
    setFairUseViolation(null);
    
    try {
      // Build endpoint URL
      const endpoint = `${API_URL}/export-${format.toLowerCase()}`;
      
      // Start timing the export process if ExportTimingManager is available
      if (window.exportTiming && window.exportTiming.startExport) {
        window.exportTiming.startExport(
          format === 'docx' ? 'word' : format.toLowerCase(),
          exportOptions?.projectTitle || 'book'
        );
      }
      
      // Post request to export
      const response = await axios.post(
        endpoint,
        { sections, exportOptions },
        { 
          responseType: 'blob',
          timeout: 120000, // 2 minutes timeout for larger exports
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      setLoading(false);
      
      // Check if response is a file (success) or JSON (potential error)
      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        // Parse JSON error response
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result);
              
              // Check for fair use violation
              if (errorData.fairUseViolation) {
                setFairUseViolation({
                  similarityScore: errorData.similarityScore || 0,
                  warningMessage: errorData.warningMessage || '',
                  warning: errorData.warning !== false
                });
                resolve({ fairUseViolation: true, errorData });
              } else {
                setError(errorData.error || 'Export failed');
                reject(errorData);
              }
            } catch (err) {
              setError('Failed to parse error response');
              reject(err);
            }
          };
          reader.onerror = () => {
            setError('Failed to read error response');
            reject(new Error('Failed to read error response'));
          };
          reader.readAsText(response.data);
        });
      }
      
      // Success case - use the ExportTimingManager instead of direct download
      const blob = new Blob([response.data]);
      const fileId = `${exportOptions?.projectId || 'export'}_${Date.now()}`;
      
      // Use the ExportTimingManager if available
      if (window.exportTiming && window.exportTiming.finishExportWithBlob) {
        console.log('Using ExportTimingManager to handle download via dialog');
        window.exportTiming.finishExportWithBlob({
          blob,
          format: format === 'docx' ? 'word' : format.toLowerCase(),
          fileName: `${exportOptions?.projectTitle || 'book'}.${format.toLowerCase() === 'word' ? 'docx' : format.toLowerCase()}`,
          fileId
        });
      } else {
        // Even if ExportTimingManager is not available, DO NOT create an automatic download
        console.warn('ExportTimingManager not available - storing blob in memory only');
        // Store the blob in memory but don't trigger download
        window._exportData = {
          blob,
          format: format === 'docx' ? 'word' : format.toLowerCase(),
          fileName: `${exportOptions?.projectTitle || 'book'}.${format.toLowerCase() === 'word' ? 'docx' : format.toLowerCase()}`
        };
      }
      
      return { success: true };
    } catch (err) {
      setLoading(false);
      
      // Handle Axios error with status 403 (Forbidden/Fair Use Violation)
      if (err.response && err.response.status === 403) {
        try {
          // Parse error response if it's JSON
          const errorData = await err.response.data.text();
          const parsedError = JSON.parse(errorData);
          
          if (parsedError.fairUseViolation) {
            setFairUseViolation({
              similarityScore: parsedError.similarityScore || 0,
              warningMessage: parsedError.warningMessage || '',
              warning: parsedError.warning !== false
            });
            return { fairUseViolation: true, errorData: parsedError };
          } else {
            setError(parsedError.error || 'Export failed');
          }
        } catch (parseErr) {
          setError('Access denied: ' + (err.response.data || err.message));
        }
      } else {
        setError(err.message || 'Export failed');
      }
      
      return null;
    }
  };
  
  // Clear the fair use violation state
  const clearFairUseViolation = () => {
    setFairUseViolation(null);
  };
  
  return {
    exportBook,
    loading,
    error,
    fairUseViolation,
    clearFairUseViolation
  };
};

export default useBookExport; 