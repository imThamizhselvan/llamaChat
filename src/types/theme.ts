import 'styled-components';

// First, let's declare the module to extend the DefaultTheme
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}

export interface ThemeType {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  chatBg: string;
  messageBg: string;
  messageText: string;
}

export const lightTheme: ThemeType = {
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
  text: '#2d3748',
  primary: '#4a67e3',
  secondary: '#2d9cdb',
  chatBg: 'rgba(255, 255, 255, 0.95)',
  messageBg: '#f0f4f8',
  messageText: '#2d3748'
};

export const darkTheme: ThemeType = {
  background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
  text: '#e2e8f0',
  primary: '#6b8aff',
  secondary: '#4fc3f7',
  chatBg: 'rgba(26, 32, 44, 0.95)',
  messageBg: '#2d3748',
  messageText: '#e2e8f0'
}; 