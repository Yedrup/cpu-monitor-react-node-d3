import React, { useState, useEffect, createContext, useRef } from 'react';

import {
  MuiThemeProvider,
  CssBaseline,
  createMuiTheme,
} from '@material-ui/core';
import themes from '../../theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const setTheme = (themeNameToStore) => {
    window.localStorage.setItem('themeCPUMonitorIsDark', themeNameToStore);
    return themeNameToStore;
  };
  const initializedThemeName =
    localStorage.getItem('themeCPUMonitorIsDark') || 'darkTheme';
  const isInitialMount = useRef(true);
  const [currentThemeName, setCurrentThemeName] = useState(
    setTheme(initializedThemeName)
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setTheme(currentThemeName);
    }
    return () => null;
  }, [currentThemeName]);

  const muiTheme = createMuiTheme(themes[currentThemeName]);

  return (
    <ThemeContext.Provider value={{ currentThemeName, setCurrentThemeName }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
