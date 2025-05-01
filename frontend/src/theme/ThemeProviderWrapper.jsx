// ThemeContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getDesignTokens from "./Theme";

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => useContext(ThemeContext);

// eslint-disable-next-line react/prop-types
export const ThemeProviderWrapper = ({ children }) => {
  const [darkMode, setDarkMode] = useState(null);

  const theme = createTheme(getDesignTokens(darkMode ? 'dark' : 'light'));  

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
    window.localStorage.setItem('darkmode', JSON.stringify(!darkMode));
  };
  useEffect(() => {
    if (darkMode === null) {
        const localTheme = window.localStorage.getItem('darkmode');
        if (localTheme) {
          setDarkMode(JSON.parse(localTheme));
        } else {
          setDarkMode(false);
        }
    }
  },[darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
