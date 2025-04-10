import { theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = theme;

// Custom tokens
export const themeTokens = {
  light: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 6,
    wireframe: false,
    fontFamily: "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  dark: {
    colorPrimary: '#1668dc',
    colorSuccess: '#49aa19',
    colorWarning: '#d89614',
    colorError: '#d32029',
    colorInfo: '#1668dc',
    borderRadius: 6,
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
        colorBgHeader: '#fff',
        colorBgBody: '#f5f5f5',
        colorBgTrigger: '#fff',
      },
      Menu: {
        colorItemBg: 'transparent',
        colorActiveBarBorderSize: 0,
        colorItemBgSelected: 'rgba(22, 119, 255, 0.1)',
        colorItemTextSelected: '#1677ff',
      },
    },
  },
  dark: {
    algorithm: darkAlgorithm,
    token: themeTokens.dark,
    components: {
      Layout: {
        colorBgHeader: '#111',
        colorBgBody: '#1f1f1f',
        colorBgTrigger: '#111',
      },
      Menu: {
        colorItemBg: 'transparent',
        colorActiveBarBorderSize: 0,
        colorItemBgSelected: 'rgba(22, 119, 255, 0.2)',
        colorItemTextSelected: '#1668dc',
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
  },
  '*': {
    boxSizing: 'border-box',
  },
};

export default antTheme; 