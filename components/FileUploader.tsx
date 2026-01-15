import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesSelected, 
  accept = ".pdf", 
  multiple = true,
  label = "Select or Drop PDF Files"
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300
        glass backdrop-blur-md
        ${isDragging 
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02]' 
          : 'border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white/60 dark:hover:bg-slate-900/60'}
      `}
    >
      <input 
        ref={inputRef}
        type="file" 
        accept={accept} 
        multiple={multiple} 
        onChange={handleChange}
        className="hidden" 
      />
      <div className="bg-blue-600 dark:bg-blue-500 text-white p-6 rounded-3xl shadow-xl shadow-blue-500/20">
        <Upload className="w-10 h-10" />
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{label}</p>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Your files never leave your device</p>
      </div>
    </div>
  );
};

export default FileUploader;