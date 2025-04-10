import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { antTheme, globalStyles } from './index';
import { Global, css } from '@emotion/react';

// Create theme context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get theme from local storage or default to light
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode || 'light';
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', mode);
    // Update body class for global styles
    document.body.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  // Toggle theme function
  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // Theme context value
  const themeContextValue = {
    mode,
    toggleTheme,
    isDark: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ConfigProvider theme={antTheme[mode]}>
        <Global
          styles={css`
            ${Object.entries(globalStyles).map(
              ([selector, styles]) => `
                ${selector} {
                  ${Object.entries(styles).map(
                    ([property, value]) => `${property}: ${value};`
                  ).join('\n')}
                }
              `
            ).join('\n')}
            
            body.dark {
              background-color: ${antTheme.dark.components.Layout.colorBgBody};
              color: rgba(255, 255, 255, 0.85);
            }
          `}
        />
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider; 