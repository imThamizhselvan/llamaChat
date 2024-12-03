export interface Message {
  text: string;
  isUser: boolean;
  image?: string;
}

export interface ImageUploadResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ChatResponse {
  message: {
    content: string;
  };
}

export interface ImageChatResponse {
  message: {
    content: string;
    image_analysis?: string;
  };
} 