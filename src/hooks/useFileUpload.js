import { useState } from 'react';
import { fileToBase64, isValidFileType } from '../utils/fileUtils';

/**
 * Custom hook for managing file uploads
 * @returns {Object} File upload state and handlers
 */
export const useFileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!isValidFileType(file)) {
      setError('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Please upload a file smaller than 10MB.');
      return;
    }

    try {
      setError(null);
      const base64Data = await fileToBase64(file);
      setUploadedFile(file);
      setFileContent(base64Data);
    } catch (err) {
      setError('Failed to read file. Please try again.');
      console.error('File upload error:', err);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileContent('');
    setError(null);
  };

  return {
    uploadedFile,
    fileContent,
    error,
    handleFileUpload,
    removeFile
  };
};
