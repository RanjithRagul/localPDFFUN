import React, { useState, useEffect } from 'react';
import { 
  FileStack, 
  Scissors, 
  Zap, 
  RotateCw, 
  Image as ImageIcon, 
  LayoutDashboard, 
  Type, 
  Code, 
  Lock, 
  Unlock, 
  ShieldCheck,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { ToolID, ToolMetadata } from './types';
import ToolGrid from './components/ToolGrid';
import MergeView from './views/MergeView';
import SplitView from './views/SplitView';
import RotateView from './views/RotateView';
import PasswordView from './views/PasswordView';
import ImageToPdfView from './views/ImageToPdfView';
import WatermarkView from './views/WatermarkView';
import OrganizeView from './views/OrganizeView';
import HtmlToPdfView from './views/HtmlToPdfView';
import CompressView from './views/CompressView';

const TOOLS: ToolMetadata[] = [
  { id: 'add-password', title: 'Protect PDF', description: 'Encrypt your PDF with a password', icon: <Lock className="w-6 h-6" />, color: 'bg-slate-700' },
  { id: 'remove-password', title: 'Unlock PDF', description: 'Remove password from a PDF file', icon: <Unlock className="w-6 h-6" />, color: 'bg-slate-400' },
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDFs into one document', icon: <FileStack className="w-6 h-6" />, color: 'bg-blue-500' },
  { id: 'split', title: 'Split PDF', description: 'Separate one page or whole set into files', icon: <Scissors className="w-6 h-6" />, color: 'bg-red-500' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce the file size of your PDF document', icon: <Zap className="w-6 h-6" />, color: 'bg-yellow-500' },
  { id: 'rotate', title: 'Rotate PDF', description: 'Rotate pages to landscape or portrait', icon: <RotateCw className="w-6 h-6" />, color: 'bg-indigo-500' },
  { id: 'organize', title: 'Organize PDF', description: 'Sort, add, or delete PDF pages', icon: <LayoutDashboard className="w-6 h-6" />, color: 'bg-purple-500' },
  { id: 'image-to-pdf', title: 'Image to PDF', description: 'Convert JPG, PNG to PDF easily', icon: <ImageIcon className="w-6 h-6" />, color: 'bg-green-500' },
  { id: 'watermark', title: 'Watermark', description: 'Add text or image watermark to pages', icon: <Type className="w-6 h-6" />, color: 'bg-orange-500' },
  { id: 'html-to-pdf', title: 'HTML to PDF', description: 'Convert HTML code to PDF document', icon: <Code className="w-6 h-6" />, color: 'bg-pink-500' },
];

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolID>('home');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderTool = () => {
    const handleBack = () => setCurrentTool('home');
    switch (currentTool) {
      case 'merge': return <MergeView onBack={handleBack} />;
      case 'split': return <SplitView onBack={handleBack} />;
      case 'compress': return <CompressView onBack={handleBack} />;
      case 'rotate': return <RotateView onBack={handleBack} />;
      case 'add-password': return <PasswordView mode="add" onBack={handleBack} />;
      case 'remove-password': return <PasswordView mode="remove" onBack={handleBack} />;
      case 'image-to-pdf': return <ImageToPdfView onBack={handleBack} />;
      case 'watermark': return <WatermarkView onBack={handleBack} />;
      case 'organize': return <OrganizeView onBack={handleBack} />;
      case 'html-to-pdf': return <HtmlToPdfView onBack={handleBack} />;
      default: return <ToolGrid tools={TOOLS} onSelect={setCurrentTool} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 glass bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentTool('home')}>
            <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              LocalPDF <span className="text-blue-600">Secure</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                 <ShieldCheck className="w-3.5 h-3.5" />
                 100% Local Processing
               </div>
            </nav>

            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10">
        {currentTool !== 'home' && (
          <button 
            onClick={() => setCurrentTool('home')}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </button>
        )}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderTool()}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass bg-white/70 dark:bg-slate-900/70 border-t border-slate-200/50 dark:border-slate-800/50 py-8 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
            Files never leave your computer. No cloud, no tracking, no servers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;