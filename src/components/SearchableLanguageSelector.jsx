import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Divider,
  InputAdornment,
  IconButton,
  Fade,
  ClickAwayListener
} from '@mui/material';
import {
  Search as SearchIcon,
  Language as LanguageIcon,
  Clear as ClearIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { 
  languages, 
  searchLanguages, 
  getRecentLanguages, 
  addRecentLanguage,
  getLanguageByCode 
} from '../config/languages';

const SearchableLanguageSelector = ({ 
  onLanguageChange, 
  currentLanguage = 'en',
  variant = 'default',
  sx = {},
  placeholder = "Search languages..."
}) => {
  const { i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [recentLanguages, setRecentLanguages] = useState([]);
  const anchorRef = useRef(null);
  const inputRef = useRef(null);

  const currentLang = getLanguageByCode(currentLanguage);

  // Load recent languages on mount
  useEffect(() => {
    const recent = getRecentLanguages();
    setRecentLanguages(recent.map(code => getLanguageByCode(code)).filter(Boolean));
  }, []);

  // Filter languages based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLanguages([]);
    } else {
      const results = searchLanguages(searchQuery);
      setFilteredLanguages(results);
    }
  }, [searchQuery]);

  const handleLanguageSelect = (languageCode) => {
    addRecentLanguage(languageCode);
    onLanguageChange(languageCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredLanguages([]);
    inputRef.current?.focus();
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const renderLanguageItem = (language, isRecent = false) => (
    <ListItem key={language.code} disablePadding>
      <ListItemButton
        onClick={() => handleLanguageSelect(language.code)}
        sx={{
          py: 1,
          px: 2,
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)'
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
            {language.flag}
          </Typography>
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {language.name}
              </Typography>
              {isRecent && (
                <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              )}
            </Box>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {language.nativeName}
            </Typography>
          }
        />
        {currentLanguage === language.code && (
          <Chip 
            label="Current" 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );

  const renderLanguageSection = (title, languages, showDivider = true) => (
    <>
      {languages.length > 0 && (
        <>
          <ListItem sx={{ py: 1, px: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </ListItem>
          {languages.map(lang => renderLanguageItem(lang, title === 'Recent Languages'))}
          {showDivider && <Divider />}
        </>
      )}
    </>
  );

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TextField
        ref={anchorRef}
        inputRef={inputRef}
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LanguageIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClearSearch}
                edge="end"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'background.paper'
            }
          }
        }}
      />

      <Popper
        open={isOpen}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              elevation={8}
              sx={{
                mt: 1,
                maxHeight: 400,
                overflow: 'auto',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ClickAwayListener onClickAway={handleClickAway}>
                <List dense sx={{ py: 0 }}>
                  {/* Search Results - Show first when searching */}
                  {searchQuery && filteredLanguages.length > 0 && (
                    renderLanguageSection('Search Results', filteredLanguages, recentLanguages.length > 0)
                  )}

                  {/* No Results */}
                  {searchQuery && filteredLanguages.length === 0 && (
                    <ListItem sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        No languages found for "{searchQuery}"
                      </Typography>
                    </ListItem>
                  )}

                  {/* Recent Languages - Show after search results or when no search */}
                  {(!searchQuery || (searchQuery && filteredLanguages.length > 0)) && 
                    renderLanguageSection('Recent Languages', recentLanguages, !searchQuery)
                  }

                  {/* Popular Languages (when no search) */}
                  {!searchQuery && (
                    renderLanguageSection('Popular Languages', 
                      languages.filter(lang => ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'hi', 'bn'].includes(lang.code)),
                      false
                    )
                  )}
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default SearchableLanguageSelector;
