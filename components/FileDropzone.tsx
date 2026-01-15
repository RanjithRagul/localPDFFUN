import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ file, onFileSelect, onClear, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        onFileSelect(droppedFile);
      } else {
        alert('Please select a PDF file.');
      }
    }
  }, [onFileSelect, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  if (file) {
    return (
      <div className="relative group bg-white border border-gray-200 rounded-xl p-6 flex items-center shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-red-50 p-3 rounded-lg mr-4">
          <FileText className="w-8 h-8 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">{file.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        {!disabled && (
          <button 
            onClick={onClear}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200 ease-in-out cursor-pointer
        ${isDragging 
          ? 'border-accent bg-accent/5 scale-[1.01]' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`
          p-4 rounded-full transition-colors
          ${isDragging ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-400'}
        `}>
          <Upload className="w-8 h-8" />
        </div>
        <div>
          <p className="text-base font-medium text-gray-900">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-500 mt-1">
            PDF files only (max 50MB recommended)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileDropzone;
