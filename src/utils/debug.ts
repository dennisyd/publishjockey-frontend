/**
 * Debug Utilities for Browser Console Testing
 * 
 * These functions can be accessed from the browser console using:
 * - window.debugUtils.testSave('projectId')
 * - window.debugUtils.getCurrentToken()
 * - window.debugUtils.checkProject('projectId')
 * - window.debugUtils.forceSaveContent('projectId')
 */

import { ExportService } from '../services/ExportService';
import axios from 'axios';

interface DebugUtils {
  testSave: (projectId: string) => Promise<any>;
  getCurrentToken: () => string | null;
  checkProject: (projectId: string) => Promise<any>;
  forceSaveContent: (projectId: string) => Promise<any>;
  analyzeToken: () => void;
}

// Initialize the debug object on window
declare global {
  interface Window {
    debugUtils: DebugUtils;
  }
}

// Base URL for API calls
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Define the API response structure for debug endpoints
interface ProjectDebugResponse {
  project: {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    content: Record<string, string>;
  };
  debug: {
    contentSize: number;
    contentKeys: string[];
  };
}

// Function to test saving content to a project
const testSave = async (projectId: string) => {
  if (!projectId) {
    console.error('Please provide a project ID');
    return { error: 'No project ID provided' };
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found in localStorage');
    return { error: 'No auth token found' };
  }

  console.log(`Testing content save for project: ${projectId}`);
  try {
    const result = await ExportService.testContentSave(projectId, token);
    console.log('Save result:', result);
    return result;
  } catch (err) {
    console.error('Save failed:', err);
    return { error: err };
  }
};

// Function to check project content via debug API
const checkProject = async (projectId: string) => {
  if (!projectId) {
    console.error('Please provide a project ID');
    return { error: 'No project ID provided' };
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found in localStorage');
    return { error: 'No auth token found' };
  }

  console.log(`Checking project content for: ${projectId}`);
  try {
    const response = await axios.get<ProjectDebugResponse>(
      `${API_URL}/api/debug/projects/${projectId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const { project, debug } = response.data;
    
    // Format the output for better readability
    console.group(`✅ Project: ${project.title} (${project._id})`);
    console.log(`Created: ${new Date(project.createdAt).toLocaleString()}`);
    console.log(`Updated: ${new Date(project.updatedAt).toLocaleString()}`);
    console.log(`User ID: ${project.userId}`);
    console.log(`Content size: ${debug.contentSize}`);
    console.log(`Content sections: ${debug.contentKeys.length}`);
    
    if (debug.contentKeys.length > 0) {
      console.group('Content sections:');
      debug.contentKeys.forEach((key: string) => {
        const content = project.content[key];
        const length = content ? content.length : 0;
        console.log(`- ${key}: ${length} chars`);
      });
      console.groupEnd();
    } else {
      console.warn('⚠️ No content sections found');
    }
    
    console.groupEnd();
    
    return response.data;
  } catch (err) {
    console.error('❌ Error checking project:', err);
    return { error: err };
  }
};

// Function to force save content to a project
const forceSaveContent = async (projectId: string) => {
  if (!projectId) {
    console.error('Please provide a project ID');
    return { error: 'No project ID provided' };
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found in localStorage');
    return { error: 'No auth token found' };
  }

  // Create a sample content object
  const content = {
    'front:Title Page': '# Debug Test Title\n\nBy Debug Author',
    'front:Copyright': 'Copyright © 2023 Debug Author\n\nAll rights reserved.',
    'main:Chapter 1': '# Chapter 1: Testing\n\nThis is test content created by the debug utilities.',
    'main:Chapter 2': '# Chapter 2: More Testing\n\nThis is additional test content.'
  };

  console.log(`Force saving content to project: ${projectId}`);
  try {
    const response = await axios.post(
      `${API_URL}/api/debug/save-content/${projectId}`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ Force save successful:', response.data);
    return response.data;
  } catch (err) {
    console.error('❌ Force save failed:', err);
    return { error: err };
  }
};

// Function to get the current authentication token
const getCurrentToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found');
    return null;
  }
  
  // Only show first and last few characters for security
  const tokenPreview = `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
  console.log('Current token preview:', tokenPreview);
  
  // Check token expiration if it's a JWT
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = expDate < now;
      
      console.log('Token expiration:', expDate.toLocaleString());
      console.log('Token expires in:', Math.round((expDate.getTime() - now.getTime()) / 1000 / 60), 'minutes');
      console.log('Token is expired:', isExpired);
      
      if (isExpired) {
        console.error('WARNING: Token is expired - this will cause 401 errors!');
      }
    }
    
    console.log('Token payload:', payload);
  } catch (err) {
    console.log('Could not parse token as JWT');
  }
  
  return token;
};

// Function to analyze token and user information
const analyzeToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('⚠️ No authentication token found');
    return;
  }
  
  try {
    // Parse the JWT payload
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format');
      return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Display user info in a formatted table
    console.group('🔑 Authentication Information');
    console.log('Token type: JWT');
    console.log('Token length:', token.length);
    
    // User information
    console.group('👤 User Information');
    if (payload.id || payload.userId) {
      console.log('User ID:', payload.id || payload.userId);
    }
    if (payload.email) {
      console.log('Email:', payload.email);
    }
    if (payload.name) {
      console.log('Name:', payload.name);
    }
    if (payload.role) {
      console.log('Role:', payload.role);
    }
    console.groupEnd();
    
    // Token timing information
    console.group('⏱️ Token Timing');
    if (payload.iat) {
      const issuedAt = new Date(payload.iat * 1000);
      console.log('Issued at:', issuedAt.toLocaleString());
    }
    if (payload.exp) {
      const expiration = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = expiration < now;
      const timeRemaining = Math.round((expiration.getTime() - now.getTime()) / 1000 / 60);
      
      console.log('Expires at:', expiration.toLocaleString());
      console.log('Time remaining:', timeRemaining, 'minutes');
      console.log('Status:', isExpired ? '❌ EXPIRED' : '✅ VALID');
    }
    console.groupEnd();
    
    console.groupEnd();
  } catch (err) {
    console.error('❌ Error analyzing token:', err);
  }
};

// Initialize the debug utilities
const initDebugUtils = () => {
  window.debugUtils = {
    testSave,
    getCurrentToken,
    checkProject,
    forceSaveContent,
    analyzeToken
  };
  
  console.log('🛠️ Debug utilities initialized. Available commands:');
  console.log('- debugUtils.testSave("yourProjectId") - Test content saving');
  console.log('- debugUtils.getCurrentToken() - Get current auth token');
  console.log('- debugUtils.checkProject("yourProjectId") - Check project data');
  console.log('- debugUtils.forceSaveContent("yourProjectId") - Force save test content');
  console.log('- debugUtils.analyzeToken() - Analyze authentication token');
};

// Auto-initialize on module import
initDebugUtils();

export default {
  testSave,
  getCurrentToken,
  checkProject,
  forceSaveContent,
  analyzeToken
}; 