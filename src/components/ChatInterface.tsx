import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ImageUpload from './ImageUpload';
import { ChatResponse, ImageChatResponse } from '../types/chat';

interface Message {
  text: string;
  isUser: boolean;
  image?: string;
}

const ChatContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.chatBg};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: all 0.3s ease;
  height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 16px;
    height: calc(100vh - 140px);
    margin: 0 10px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 20px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.chatBg};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary}40;
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.primary}80;
    }
  }
`;

const MessageGroup = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin: 8px 0;
  max-width: 85%;
  ${props => props.isUser ? 'margin-left: auto;' : 'margin-right: auto;'}
`;

const MarkdownContent = styled.div`
  font-size: 1rem;
  line-height: 1.5;

  p {
    margin: 0.5em 0;
  }

  code {
    background-color: ${({ theme }) => theme.messageBg}80;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Consolas', monospace;
    font-size: 0.9em;
  }

  pre {
    margin: 0.5em 0;
    
    code {
      background-color: transparent;
      padding: 0;
    }
  }

  ul, ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  li {
    margin: 0.3em 0;
  }

  blockquote {
    margin: 0.5em 0;
    padding-left: 1em;
    border-left: 3px solid ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text}CC;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0.5em 0;
    color: ${({ theme }) => theme.primary};
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 0.5em 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.5em 0;
    
    th, td {
      border: 1px solid ${({ theme }) => theme.messageBg};
      padding: 0.5em;
    }

    th {
      background-color: ${({ theme }) => theme.messageBg};
    }
  }
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  padding: 12px 16px;
  border-radius: 18px;
  ${props => props.isUser ? `
    background-color: ${props.theme.primary};
    color: white;
    border-bottom-right-radius: 4px;

    ${MarkdownContent} {
      color: white;
      
      code {
        background-color: rgba(255, 255, 255, 0.1);
      }

      blockquote {
        border-left-color: white;
        color: rgba(255, 255, 255, 0.8);
      }

      h1, h2, h3, h4, h5, h6 {
        color: white;
      }

      a {
        color: white;
      }
    }
  ` : `
    background-color: ${props.theme.messageBg};
    color: ${props.theme.messageText};
    border-bottom-left-radius: 4px;
  `}
  max-width: 100%;
  word-wrap: break-word;
  margin: 2px 0;
  animation: fadeIn 0.3s ease-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  img {
    max-width: 200px;
    border-radius: 8px;
    margin-top: 8px;
  }
`;

const Avatar = styled.div<{ isUser: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin: ${props => props.isUser ? '0 8px 0 0' : '0 0 0 8px'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: ${props => props.isUser ? props.theme.secondary : props.theme.primary}20;
  color: ${props => props.isUser ? props.theme.secondary : props.theme.primary};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.chatBg};
  border-top: 1px solid ${({ theme }) => theme.messageBg};
  border-radius: 0 0 20px 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 14px 20px;
  border: 2px solid ${({ theme }) => theme.messageBg};
  border-radius: 25px;
  font-size: 1rem;
  font-family: inherit;
  background: ${({ theme }) => theme.chatBg};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.text}80;
  }
`;

const SendButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 25px;
  padding: 14px 28px;
  cursor: pointer;
  font-size: 1rem;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 14px;
    
    span {
      display: none;
    }
  }
`;

const ThinkingIndicator = styled(MessageBubble)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  background: ${({ theme }) => theme.text}80;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
  margin: 0 1px;

  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }
`;

// Custom renderer for code blocks
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  if (!inline && language) {
    return (
      <SyntaxHighlighter
        style={tomorrow}
        language={language}
        PreTag="div"
        customStyle={{
          margin: '0.5em 0',
          borderRadius: '6px',
          fontSize: '0.9em',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImageFile(null);
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim() && !imageFile) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { 
      text: userMessage, 
      isUser: true,
      image: selectedImage || undefined 
    }]);
    setIsLoading(true);

    try {
      let response: { data: ChatResponse | ImageChatResponse };
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        if (userMessage) {
          formData.append('message', userMessage);
        }

        response = await axios.post<ImageChatResponse>('http://localhost:11434/api/chat', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post<ChatResponse>('http://localhost:11434/api/chat', {
          model: "llama3.2",
          messages: [{
            role: "user",
            content: userMessage
          }],
          stream: false,
        });
      }

      setMessages(prev => [...prev, { 
        text: response.data.message.content, 
        isUser: false 
      }]);
      
      // Clear image after sending
      setSelectedImage(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        text: "Oops! I'm having trouble thinking right now. Please try again!",
        isUser: false
      }]);
    }

    setIsLoading(false);
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageGroup key={index} isUser={message.isUser}>
            <MessageBubble isUser={message.isUser}>
              {message.text && (
                message.isUser ? (
                  message.text
                ) : (
                  <MarkdownContent>
                    <ReactMarkdown components={{ code: CodeBlock }}>
                      {message.text}
                    </ReactMarkdown>
                  </MarkdownContent>
                )
              )}
              {message.image && (
                <img src={message.image} alt="Uploaded content" />
              )}
            </MessageBubble>
            <Avatar isUser={message.isUser}>
              {message.isUser ? '👤' : '🤖'}
            </Avatar>
          </MessageGroup>
        ))}
        {isLoading && (
          <MessageGroup isUser={false}>
            <ThinkingIndicator isUser={false}>
              <Dot />
              <Dot />
              <Dot />
            </ThinkingIndicator>
            <Avatar isUser={false}>🤖</Avatar>
          </MessageGroup>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <ImageUpload
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          selectedImage={selectedImage}
        />
        <Input
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message here..."
        />
        <SendButton onClick={sendMessage}>
          <FaPaperPlane />
          <span>Send</span>
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface; 