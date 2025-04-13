import { theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = theme;

// Custom tokens with seafoam pastel theme
export const themeTokens = {
  light: {
    colorPrimary: '#6BBEA9', // Main seafoam color
    colorSuccess: '#A8E6CF', // Pastel mint green
    colorWarning: '#FFD3B6', // Pastel peach
    colorError: '#FFAAA5', // Pastel coral
    colorInfo: '#6BBEA9', // Seafoam
    colorTextBase: '#505050', // Dark gray for text
    colorBgBase: '#F8FAFA', // Very light seafoam tint for backgrounds
    borderRadius: 8,
    wireframe: false,
    fontFamily: "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  dark: {
    colorPrimary: '#6BBEA9', // Seafoam
    colorSuccess: '#7DCEB8', // Slightly darker seafoam
    colorWarning: '#E8C0A8', // Muted peach
    colorError: '#E2918C', // Muted coral
    colorInfo: '#6BBEA9', // Seafoam
    colorTextBase: '#E8E8E8', // Light gray for text
    colorBgBase: '#2A3B39', // Dark seafoam-tinted background
    borderRadius: 8,
    wireframe: false,
    fontFamily: "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
};

// Ant Design theme
export const antTheme = {
  light: {
    algorithm: defaultAlgorithm,
    token: themeTokens.light,
    components: {
      Layout: {
        headerBg: '#FFFFFF',
        bodyBg: '#F8FAFA',
        triggerBg: '#6BBEA9',
        siderBg: '#FFFFFF',
      },
      Menu: {
        colorItemBg: 'transparent',
        colorActiveBarBorderSize: 0,
        colorItemBgSelected: 'rgba(107, 190, 169, 0.1)', // Transparent seafoam
        colorItemTextSelected: '#6BBEA9', // Seafoam
      },
      Card: {
        colorBorderSecondary: '#E9F5F2', // Very light seafoam border
      },
      Button: {
        colorPrimaryHover: '#5AA897', // Darker seafoam for hover
      },
      Statistic: {
        colorTextDescription: '#93B2AD', // Muted seafoam for descriptions
      },
    },
  },
  dark: {
    algorithm: darkAlgorithm,
    token: themeTokens.dark,
    components: {
      Layout: {
        headerBg: '#1F2E2B',
        bodyBg: '#2A3B39',
        triggerBg: '#6BBEA9',
        siderBg: '#1F2E2B',
      },
      Menu: {
        colorItemBg: 'transparent',
        colorActiveBarBorderSize: 0,
        colorItemBgSelected: 'rgba(107, 190, 169, 0.2)', // Transparent seafoam
        colorItemTextSelected: '#6BBEA9', // Seafoam
      },
      Card: {
        colorBorderSecondary: '#374945', // Dark seafoam border
      },
      Button: {
        colorPrimaryHover: '#5AA897', // Darker seafoam for hover
      },
      Statistic: {
        colorTextDescription: '#7B9E99', // Muted seafoam for descriptions
      },
    },
  },
};

// Global styles as CSS-in-JS
export const globalStyles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: themeTokens.light.fontFamily,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    background: themeTokens.light.colorBgBase,
    color: themeTokens.light.colorTextBase,
  },
  '*': {
    boxSizing: 'border-box',
  },
};

export default antTheme; 