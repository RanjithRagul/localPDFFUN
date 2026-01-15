import React from 'react';
import { ShieldCheck, Github } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-accent/10 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">LocalPDF <span className="text-accent">Secure</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              How it works
            </a>
            <a 
              href="https://github.com/RanjithRagul/localPDF" 
              target="_blank" 
              rel="noreferrer"
              className="text-gray-400 hover:text-gray-900 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            Process files securely in your browser. No files are uploaded to any server.
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} LocalPDF Secure.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
