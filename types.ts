export type ToolID = 
  | 'merge' 
  | 'split' 
  | 'compress' 
  | 'rotate' 
  | 'image-to-pdf' 
  | 'organize' 
  | 'watermark' 
  | 'html-to-pdf' 
  | 'add-password' 
  | 'remove-password'
  | 'home';

export enum ToolType {
  LOCK = 'add-password',
  UNLOCK = 'remove-password'
}

export interface ToolMetadata {
  id: ToolID;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export interface PDFFile {
  id: string;
  file: File;
  previewUrl?: string;
  pageCount?: number;
}