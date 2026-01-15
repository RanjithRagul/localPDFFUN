import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { rotatePDF, downloadBlob } from '../services/pdfUtils';
import { RotateCw, Download } from 'lucide-react';

const RotateView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRotate = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const bytes = await rotatePDF(file, rotation);
      downloadBlob(bytes, `rotated_${file.name}`);
    } catch (error) {
      console.error(error);
      alert("Error rotating PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Rotate PDF</h2>
        <p className="text-slate-500 dark:text-slate-400">Permanently rotate your document pages clockwise.</p>
      </div>

      {!file ? (
        <FileUploader onFilesSelected={(files) => setFile(files[0])} multiple={false} />
      ) : (
        <div className="space-y-6">
          <div className="p-6 glass bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-3.5 rounded-2xl font-bold">PDF</div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{file.name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Ready to rotate</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 text-sm font-bold transition-colors">Change File</button>
          </div>

          <div className="flex flex-col items-center gap-10 py-16 glass bg-white/40 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30 rounded-[2.5rem] shadow-inner">
             <div className="relative border-[6px] border-white dark:border-slate-700 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-2xl transition-transform duration-500 ease-out" style={{ transform: `rotate(${rotation}deg)` }}>
                <div className="w-40 h-56 bg-white dark:bg-slate-700 flex flex-col gap-3 p-4">
                   <div className="w-full h-5 bg-slate-200 dark:bg-slate-600 rounded"></div>
                   <div className="w-3/4 h-3 bg-slate-100 dark:bg-slate-600 rounded"></div>
                   <div className="w-1/2 h-3 bg-slate-100 dark:bg-slate-600 rounded"></div>
                   <div className="mt-auto w-full h-8 bg-blue-100 dark:bg-blue-900/20 rounded"></div>
                </div>
             </div>
             
             <button 
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="group flex items-center gap-3 bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl font-bold"
             >
               <RotateCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
               Rotate 90° Clockwise
             </button>
          </div>

          <button
            disabled={isProcessing}
            onClick={handleRotate}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Rotating...
              </span>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Apply and Download
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default RotateView;