
import React, { useState, useCallback } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setError(null);
      fileToBase64(file)
        .then(onImageUpload)
        .catch(() => setError('Could not read the image file.'));
    } else {
      setError('Please upload a valid image file (PNG, JPG, etc.).');
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Create Stunning Carousels with AI</h2>
      <p className="mt-4 text-lg text-gray-400">
        Start by uploading a base image. Our AI will analyze its style to create a visually consistent and beautiful carousel for you.
      </p>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-10 mx-auto max-w-xl flex justify-center rounded-lg border-2 border-dashed ${dragging ? 'border-emerald-400 bg-gray-800' : 'border-gray-600'} px-6 py-10 transition-colors`}
      >
        <div className="text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
          <div className="mt-4 flex text-sm leading-6 text-gray-400">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-semibold text-emerald-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-emerald-300"
            >
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
          {error && <p className="text-xs mt-2 text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
