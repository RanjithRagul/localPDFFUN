import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProcessingStatus from '../components/ProcessingStatus';
import { addWatermark, downloadBlob } from '../services/pdfUtils';
import { Type, Download } from 'lucide-react';

const WatermarkView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(-45);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    if (!file || !text) return;
    setStatus("processing");
    setMessage("Applying watermark...");
    
    try {
      const bytes = await addWatermark(file, text, {
        fontSize,
        opacity,
        rotation
      });
      downloadBlob(bytes, `watermarked_${file.name}`);
      setStatus("success");
      setMessage("Watermark added successfully!");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Failed to apply watermark.");
    }
  };

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    setStatus("idle");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Add Watermark</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Protect documents with custom overlays.</p>
      </div>

      {!file ? (
        <FileUploader onFilesSelected={handleFileSelected} multiple={false} />
      ) : (
        <div className="glass bg-white/70 dark:bg-slate-900/70 p-10 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 shadow-2xl space-y-8">
          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-sm text-slate-700 dark:text-slate-300">
             <span className="font-semibold">File:</span> {file.name}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Watermark Text</label>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xl font-bold dark:text-white focus:ring-2 ring-teal-500/20" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">
                Font Size: <span className="text-teal-600 dark:text-teal-400">{fontSize}px</span>
              </label>
              <input type="range" min="20" max="200" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-teal-500" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">
                Opacity: <span className="text-teal-600 dark:text-teal-400">{(opacity * 100).toFixed(0)}%</span>
              </label>
              <input type="range" min="0" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-teal-500" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">
                Rotation: <span className="text-teal-600 dark:text-teal-400">{rotation}°</span>
              </label>
              <input type="range" min="-90" max="90" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-teal-500" />
            </div>
          </div>

          <button disabled={status === "processing" || !text} onClick={handleApply} className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-[0.98] ${!text || status === "processing" ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-500/30'}`}>
            {status === "processing" ? 'Adding Watermark...' : <><Download className="w-6 h-6" /> Apply and Download</>}
          </button>

          {status !== "idle" && (
            <div className="mt-4">
              <ProcessingStatus status={status} message={message} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WatermarkView;