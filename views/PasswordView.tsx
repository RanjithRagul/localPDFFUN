import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { lockPDF, unlockPDF, downloadBlob } from '../services/pdfUtils';
import { Lock, Unlock, Download, ShieldCheck, AlertCircle, Edit3 } from 'lucide-react';

interface PasswordViewProps {
  mode: 'add' | 'remove';
  onBack: () => void;
}

const PasswordView: React.FC<PasswordViewProps> = ({ mode, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [filename, setFilename] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelected = (files: File[]) => {
    const f = files[0];
    setFile(f);
    setFilename(mode === 'add' ? `protected_${f.name.replace('.pdf', '')}` : `unlocked_${f.name.replace('.pdf', '')}`);
  };

  const handleSubmit = async () => {
    if (!file || !password) return;
    
    setIsProcessing(true);
    try {
      const bytes = mode === "add"
        ? await lockPDF(file, password)
        : await unlockPDF(file, password);

      downloadBlob(bytes, filename || (mode === 'add' ? 'protected' : 'unlocked'));
    } catch (error: any) {
      console.error("PASSWORD ERROR:", error);
      alert("Failed: " + (error?.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3 text-center">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {mode === 'add' ? 'Protect PDF' : 'Unlock PDF'}
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
          {mode === 'add' ? 'Secure your sensitive PDF documents with a strong password.' : 'Remove password restrictions from your PDF file.'}
        </p>
      </div>

      {!file ? (
        <FileUploader onFilesSelected={handleFileSelected} multiple={false} />
      ) : (
        <div className="space-y-8 glass bg-white/70 dark:bg-slate-900/70 p-10 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl animate-in fade-in duration-500">
          <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className={`p-5 rounded-3xl shadow-lg ${mode === 'add' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'}`}>
              {mode === 'add' ? <Lock className="w-8 h-8" /> : <Unlock className="w-8 h-8" />}
            </div>
            <div className="flex-1 overflow-hidden">
               <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
               <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">
                 {mode === 'add' ? 'Encryption Tool' : 'Decryption Tool'}
               </p>
            </div>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 font-bold transition-colors">Change</button>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Edit3 className="w-3 h-3" /> Save As
              </label>
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                <input 
                  type="text" 
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="flex-1 bg-transparent py-2 text-2xl font-black dark:text-white focus:outline-none"
                  placeholder="filename"
                />
                <span className="text-2xl font-black text-slate-400">.pdf</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                {mode === 'add' ? 'Set Protection Password' : 'Enter File Password'}
              </label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-xl font-mono tracking-widest transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-2xl flex items-start gap-3">
             <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
             <p className="text-xs text-emerald-700 dark:text-emerald-300">
               100% Secure. Your password and document are processed locally and never sent to any server.
             </p>
          </div>

          <button
            disabled={isProcessing || !password}
            onClick={handleSubmit}
            className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98] ${
              isProcessing || !password
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-3">
                <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : (
              <>
                <Download className="w-6 h-6" />
                {mode === 'add' ? 'Apply Protection' : 'Unlock & Download'}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordView;