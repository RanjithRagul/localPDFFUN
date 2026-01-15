import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { mergePDFs, downloadBlob } from '../services/pdfUtils';
import { X, Download, FileText, ArrowUp, ArrowDown, Edit3 } from 'lucide-react';

const MergeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [filename, setFilename] = useState('merged_document');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedBytes = await mergePDFs(files);
      downloadBlob(mergedBytes, filename || "merged_document");
    } catch (error) {
      console.error(error);
      alert("Failed to merge PDFs.");
    } finally {
      setIsProcessing(false);
    }
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    if (direction === 'up' && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    } else if (direction === 'down' && index < files.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    }
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Merge PDF</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Combine multiple PDF files into one. Drag or use buttons to reorder.</p>
      </div>

      <FileUploader onFilesSelected={(newFiles) => setFiles(prev => [...prev, ...newFiles])} multiple={true} />

      {files.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="glass bg-white/70 dark:bg-slate-900/70 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Edit3 className="w-3 h-3" /> Output Filename
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 py-2 text-xl font-bold dark:text-white focus:outline-none focus:border-blue-500"
                placeholder="filename"
              />
              <span className="text-xl font-bold text-slate-400">.pdf</span>
            </div>
          </div>

          <div className="glass bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {files.map((file, i) => (
                <li key={i} className="flex items-center justify-between p-5 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-8 h-8 flex items-center justify-center rounded-xl font-bold text-sm">{i + 1}</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px] md:max-w-xs">{file.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveFile(i, 'up')} className="p-2 text-slate-400 hover:text-blue-500 disabled:opacity-30" disabled={i === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveFile(i, 'down')} className="p-2 text-slate-400 hover:text-blue-500 disabled:opacity-30" disabled={i === files.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeFile(i)} className="p-2 text-slate-300 hover:text-red-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button disabled={files.length < 2 || isProcessing} onClick={handleMerge} className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all ${files.length < 2 || isProcessing ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-[0.98]'}`}>
            {isProcessing ? 'Merging...' : <><Download className="w-6 h-6" /> Merge and Download</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default MergeView;