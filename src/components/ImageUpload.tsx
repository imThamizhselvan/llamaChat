import React from 'react';
import styled from 'styled-components';
import { FaImage, FaTimes } from 'react-icons/fa';

const ImageUploadContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary}20;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primary}40;
  }
`;

const PreviewContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.chatBg};
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Preview = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${({ theme }) => theme.secondary};
  }
`;

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  selectedImage: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onImageRemove,
  selectedImage,
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <ImageUploadContainer>
      <HiddenInput
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleImageChange}
      />
      <UploadButton htmlFor="image-upload">
        <FaImage />
      </UploadButton>

      {selectedImage && (
        <PreviewContainer>
          <Preview>
            <PreviewImage src={selectedImage} alt="Preview" />
            <RemoveButton onClick={onImageRemove}>
              <FaTimes />
            </RemoveButton>
          </Preview>
        </PreviewContainer>
      )}
    </ImageUploadContainer>
  );
};

export default ImageUpload; 