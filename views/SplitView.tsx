import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { splitPDF, downloadBlob } from '../services/pdfUtils';
import { Download, Scissors, AlertCircle } from 'lucide-react';

const SplitView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const splitFiles = await splitPDF(file);
      for (const res of splitFiles) {
        downloadBlob(res.data, res.name);
        await new Promise(r => setTimeout(r, 150)); 
      }
    } catch (error) {
      console.error(error);
      alert("Failed to split PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Split PDF</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Extract every page of your PDF into separate, standalone documents.</p>
      </div>

      {!file ? (
        <FileUploader onFilesSelected={(files) => setFile(files[0])} multiple={false} />
      ) : (
        <div className="space-y-8 animate-in zoom-in-95 duration-300">
          <div className="p-8 glass bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 rounded-[2.5rem] flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-6">
              <div className="bg-red-500 text-white p-5 rounded-3xl shadow-lg shadow-red-500/20">
                <Scissors className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Ready to extract pages</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 font-bold transition-colors">Change</button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl flex items-start gap-4 border border-blue-100 dark:border-blue-800/40">
            <AlertCircle className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">How it works</p>
              <p className="text-blue-700 dark:text-blue-400/80 text-sm leading-relaxed">
                This tool will download each page as a new PDF file. Please ensure your browser pop-up blocker is disabled or allows multiple downloads.
              </p>
            </div>
          </div>

          <button
            disabled={isProcessing}
            onClick={handleSplit}
            className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 active:scale-[0.98] disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-3">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Extracting Pages...
              </span>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Split and Download All
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SplitView;