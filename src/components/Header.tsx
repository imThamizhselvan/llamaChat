import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 30px;
  position: relative;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.primary};
  font-size: 2.8rem;
  margin-bottom: 12px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  span {
    background: linear-gradient(45deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ThemeToggle = styled.button`
  position: fixed;
  right: 20px;
  top: 20px;
  background: ${({ theme }) => theme.chatBg};
  border: 2px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.chatBg};
  }

  @media (max-width: 768px) {
    right: 10px;
    top: 10px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <HeaderContainer>
      <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </ThemeToggle>
      <Title>
        <span>Easy Chat</span> AI
      </Title>
      <Subtitle>Your intelligent companion for learning and discovery</Subtitle>
    </HeaderContainer>
  );
};

export default Header; 