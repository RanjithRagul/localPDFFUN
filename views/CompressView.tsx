import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { compressPDF, compressPDFLossless, downloadBlob } from '../services/pdfUtils';
import { Zap, Download, CheckCircle2, Edit3, SlidersHorizontal, Info, FileText } from 'lucide-react';

const CompressView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState('');
  const [quality, setQuality] = useState(50); // 1-100
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null);
  const [mode, setMode] = useState<'lossless' | 'strong'>('lossless');

  const handleFileSelected = (files: File[]) => {
    const f = files[0];
    setFile(f);
    setFilename(`compressed_${f.name.replace('.pdf', '')}`);
  };

  const handleCompress = async () => {
  if (!file) return;

  setIsProcessing(true);
  setResult(null);

  try {
    let blob: Blob;

    if (mode === 'lossless') {
      blob = await compressPDFLossless(file);
    } else {
      const qualityFactor = Math.max(0.05, quality / 100);
      const uint8Array = await compressPDF(file, qualityFactor);
      blob = new Blob([uint8Array], { type: 'application/pdf' });
    }

    setResult({
      original: file.size,
      compressed: blob.size,
    });

    downloadBlob(blob, filename || "compressed_document");
  } catch (error) {
    console.error(error);
    alert(
      "Compression failed. Some PDFs with strict security or complex formats may not allow re-encoding."
    );
  } finally {
    setIsProcessing(false);
  }
};


  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i];
  };

  const getEstimatedSize = () => {
    if (!file) return 0;
    const scale = quality / 100;
    let reduction = 0;
    if (scale < 0.1) reduction = 0.85;
    else if (scale < 0.3) reduction = 0.7; 
    else if (scale < 0.6) reduction = 0.45;
    else reduction = 0.15;
    
    return Math.max(1024, Math.round(file.size * (1 - reduction)));
  };

  const getQualityLabel = () => {
    if (quality < 15) return { text: "Ultra Low", color: "text-red-600", desc: "Aggressive reduction. Expect blurry images." };
    if (quality < 40) return { text: "High Compression", color: "text-orange-500", desc: "Significant size savings." };
    if (quality < 75) return { text: "Optimal", color: "text-blue-500", desc: "Balanced quality and size." };
    return { text: "High Clarity", color: "text-emerald-500", desc: "Minimal loss, structural clean only." };
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500 fill-current" /> Compress PDF
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Reduce file size locally by re-encoding images and stripping bloat.</p>
      </div>

      {!file ? (
        <FileUploader onFilesSelected={handleFileSelected} multiple={false} />
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="p-8 glass bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/50 rounded-[2.5rem] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
              <div className="bg-yellow-500 text-white p-5 rounded-3xl shadow-lg shadow-yellow-500/20">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{file.name}</p>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Size: {formatSize(file.size)}</p>
              </div>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-slate-400 hover:text-red-500 font-black text-xs uppercase tracking-widest border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-full transition-all">Change</button>
          </div>

          <div className="glass bg-white/70 dark:bg-slate-900/70 p-8 rounded-[2.5rem] border border-slate-300 dark:border-slate-700 shadow-xl space-y-8">
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Edit3 className="w-3 h-3" /> Save As
              </label>
              <div className="flex items-center gap-2 border-b border-slate-300 dark:border-slate-700">
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
            {/* Compression Mode */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400">
                Compression Mode
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setMode('lossless')}
                  className={`px-5 py-3 rounded-2xl font-black transition-all ${
                    mode === 'lossless'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  Lossless (Safe)
                </button>

                <button
                  onClick={() => setMode('strong')}
                  className={`px-5 py-3 rounded-2xl font-black transition-all ${
                    mode === 'strong'
                      ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  Strong (Smaller)
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <SlidersHorizontal className="w-3 h-3" /> Compression Level
                </label>
                <span className={`text-sm font-black ${getQualityLabel().color}`}>
                  {quality}% - {getQualityLabel().text}
                </span>
              </div>
              
              {mode === 'strong' && (
                <input 
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              )}
              
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Ultra Low</span>
                <span>Original</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated Final Size:</span>
                </div>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">~{formatSize(getEstimatedSize())}</span>
              </div>
            </div>

            <button 
              disabled={isProcessing} 
              onClick={handleCompress} 
              className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98] ${
                isProcessing 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-wait' 
                : 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-yellow-500/30'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Shrinking Locally...
                </span>
              ) : (
                <><Zap className="w-6 h-6 fill-current" /> Compress and Download</>
              )}
            </button>
          </div>
          
          {result && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-8 rounded-[2.5rem] flex items-center gap-6 animate-in zoom-in-95">
               <div className="bg-emerald-500 p-4 rounded-3xl text-white shadow-lg shadow-emerald-500/20">
                 <CheckCircle2 className="w-8 h-8" />
               </div>
               <div>
                 <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">Success!</p>
                 <p className="text-emerald-700 dark:text-emerald-400 font-bold">
                   Saved {Math.round((1 - result.compressed / result.original) * 100)}% of your file size. Final size: {formatSize(result.compressed)}.
                 </p>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompressView;