import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface EditorSettings {
  fontSize: string;
  fontFamily: string;
  theme: string;
  autoSave: boolean;
  autosaveInterval: string;
  defaultExportFormat: string;
  darkMode: boolean;
  // New settings for language and export fonts
  documentLanguage: string;
  exportFontFamily: string;
}

interface SettingsContextType {
  settings: EditorSettings;
  updateSettings: (newSettings: Partial<EditorSettings>) => void;
  saveSettings: () => void;
}

const defaultSettings: EditorSettings = {
  fontSize: '16',
  fontFamily: 'Georgia',
  theme: 'light',
  autoSave: true,
  autosaveInterval: '5',
  defaultExportFormat: 'pdf',
  darkMode: false,
  // Default language and font settings
  documentLanguage: 'en',
  exportFontFamily: 'Liberation Serif'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // Load settings from localStorage on init
  const [settings, setSettings] = useState<EditorSettings>(() => {
    const savedSettings = localStorage.getItem('editorSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Update specific settings
  const updateSettings = (newSettings: Partial<EditorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('editorSettings', JSON.stringify(settings));
  };

  // Persist settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('editorSettings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext; 