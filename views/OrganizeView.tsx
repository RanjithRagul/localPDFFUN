import React, { useState, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import { organizePDF, downloadBlob } from '../services/pdfUtils';
import { Trash2, ArrowUp, Download, Loader2 } from 'lucide-react';

declare const window: any;

const OrganizeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (file) {
      loadThumbnails(file);
    } else {
      setPageThumbnails([]);
      setPageOrder([]);
    }
  }, [file]);

  const loadThumbnails = async (pdfFile: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const thumbnails: string[] = [];
      const order: number[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context!, viewport }).promise;
        thumbnails.push(canvas.toDataURL());
        order.push(i - 1); // 0-indexed for pdf-lib
      }
      setPageThumbnails(thumbnails);
      setPageOrder(order);
    } catch (error) {
      console.error(error);
      alert("Error loading PDF preview. Make sure the file is not encrypted.");
    } finally {
      setIsLoading(false);
    }
  };

  const movePage = (index: number, direction: 'left' | 'right') => {
    const newOrder = [...pageOrder];
    if (direction === 'left' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'right' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setPageOrder(newOrder);
  };

  const removePage = (index: number) => {
    setPageOrder(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const bytes = await organizePDF(file, pageOrder);
      downloadBlob(bytes, `organized_${file.name}`);
    } catch (error) {
      console.error(error);
      alert("Error generating PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Organize PDF</h2>
        <p className="text-slate-500 dark:text-slate-400">Rearrange or remove pages with a visual interface.</p>
      </div>

      {!file ? (
        <FileUploader onFilesSelected={(files) => setFile(files[0])} multiple={false} />
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Rendering Previews...</p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {pageOrder.map((originalIdx, currentIdx) => (
              <div key={currentIdx} className="group relative glass bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg">
                <img src={pageThumbnails[originalIdx]} alt={`Page ${originalIdx + 1}`} className="w-full h-auto" />
                <div className="absolute top-2 left-2 bg-slate-800/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Page {originalIdx + 1}
                </div>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                   <button onClick={() => movePage(currentIdx, 'left')} className="p-2 bg-white rounded-full text-slate-800 hover:bg-blue-50" disabled={currentIdx === 0}>
                     <ArrowUp className="-rotate-90 w-4 h-4" />
                   </button>
                   <button onClick={() => movePage(currentIdx, 'right')} className="p-2 bg-white rounded-full text-slate-800 hover:bg-blue-50" disabled={currentIdx === pageOrder.length - 1}>
                     <ArrowUp className="rotate-90 w-4 h-4" />
                   </button>
                   <button onClick={() => removePage(currentIdx)} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setFile(null)} className="flex-1 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 transition-colors">Select New File</button>
            <button disabled={isProcessing} onClick={handleSave} className="flex-[2] py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-purple-700 shadow-xl transition-all">
              {isProcessing ? 'Processing...' : <><Download className="w-5 h-5" /> Download Organized PDF</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizeView;