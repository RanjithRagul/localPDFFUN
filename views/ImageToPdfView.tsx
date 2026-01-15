import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { imagesToPdf, downloadBlob } from '../services/pdfUtils';
import { ImageIcon, Download, Trash2, Plus, Edit3 } from 'lucide-react';

const ImageToPdfView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [images, setImages] = useState<File[]>([]);
  const [filename, setFilename] = useState('images_converted');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    try {
      const bytes = await imagesToPdf(images);
      downloadBlob(bytes, filename || "images_converted");
    } catch (error) {
      console.error(error);
      alert("Failed to convert images.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Image to PDF</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Turn your photos into a single, professional PDF document in seconds.</p>
      </div>

      <FileUploader 
        onFilesSelected={(newFiles) => setImages(prev => [...prev, ...newFiles])} 
        accept="image/*"
        label="Select or Drop Images (JPG, PNG)"
      />

      {images.length > 0 && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="glass bg-white/70 dark:bg-slate-900/70 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4 max-w-xl mx-auto">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Edit3 className="w-3 h-3" /> Save As
            </label>
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
              <input 
                type="text" 
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 bg-transparent py-2 text-xl font-bold dark:text-white focus:outline-none"
                placeholder="filename"
              />
              <span className="text-xl font-bold text-slate-400">.pdf</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {images.map((img, i) => (
              <div key={i} className="group relative aspect-[3/4] glass bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform">
                 <img 
                   src={URL.createObjectURL(img)} 
                   alt="preview" 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 />
                 <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-black px-3 py-1.5 rounded-xl backdrop-blur-md uppercase tracking-wider">
                    Page {i + 1}
                 </div>
                 <button 
                   onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                   className="absolute bottom-3 right-3 p-3 bg-red-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 active:scale-95"
                 >
                   <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            ))}
            <button 
              onClick={() => document.querySelector('input')?.click()}
              className="aspect-[3/4] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-white/40 dark:hover:bg-slate-900/40 hover:text-blue-500 transition-all"
            >
              <Plus className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wider">Add More</span>
            </button>
          </div>

          <button
            disabled={images.length === 0 || isProcessing}
            onClick={handleConvert}
            className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl ${
              images.length === 0 || isProcessing
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                : 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-green-600/30'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-3">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating PDF...
              </span>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Convert to PDF
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageToPdfView;