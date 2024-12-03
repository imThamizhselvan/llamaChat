import React from 'react';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { GlobalStyles } from './styles/GlobalStyles';

const AppContainer = styled.div`
  background: ${({ theme }) => theme.background};
  min-height: 100vh;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => `radial-gradient(circle at 50% 0%, ${theme.primary}15 0%, transparent 50%)`};
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>
  );
};

const ThemeConsumer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        <Header />
        <ChatInterface />
      </AppContainer>
    </StyledThemeProvider>
  );
};

export default App; 