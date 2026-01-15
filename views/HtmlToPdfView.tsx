import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProcessingStatus from '../components/ProcessingStatus';
import { htmlToPDF, downloadBlob } from '../services/pdfUtils';
import { Code, Download, FileText, Globe, Upload } from 'lucide-react';

const HtmlToPdfView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [htmlContent, setHtmlContent] = useState('<h1>Hello Document</h1>\n<p>This PDF was generated 100% in-browser from raw HTML.</p>\n<div style="background: #3b82f6; color: white; padding: 20px; border-radius: 10px;">\n  Modern Styling Supported\n</div>');
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<"paste" | "file">("paste");
  const [options, setOptions] = useState({
    format: "a4" as "a4" | "letter",
    orientation: "portrait" as "portrait" | "landscape",
  });
  
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setHtmlFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setHtmlContent(e.target?.result as string);
      reader.readAsText(file);
      setStatus("idle");
    }
  };

  const handleConvert = async () => {
    if (inputMethod === "paste" && !htmlContent.trim()) return;
    if (inputMethod === "file" && !htmlFile) return;

    setStatus("processing");
    setMessage("Converting HTML to PDF...");

    try {
      const content = htmlContent || "";
      const pdfBytes = await htmlToPDF(content, {
        format: options.format,
        orientation: options.orientation
      });

      const filename = htmlFile?.name.replace(/\.html?$/i, ".pdf") || "converted.pdf";
      downloadBlob(pdfBytes, filename);
      
      setStatus("success");
      setMessage("Conversion successful!");
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setMessage(error.message || "Failed to convert.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">HTML to PDF</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Convert HTML files or code to PDF documents.</p>
      </div>

      <div className="glass bg-white/70 dark:bg-slate-900/70 p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-xl mb-6">
         {/* Toggle */}
         <div className="flex gap-4 mb-6">
            <button onClick={() => setInputMethod("paste")} className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${inputMethod === "paste" ? "bg-pink-500 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>Paste Code</button>
            <button onClick={() => setInputMethod("file")} className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${inputMethod === "file" ? "bg-pink-500 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>Upload File</button>
         </div>

         {inputMethod === "paste" ? (
            <textarea 
              className="w-full h-64 p-6 font-mono text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none dark:text-slate-200"
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="Paste HTML here..."
            />
         ) : (
            <div className="space-y-4">
               <FileUploader onFilesSelected={handleFileSelected} accept=".html,.htm" multiple={false} label="Select HTML File" />
               {htmlFile && <div className="text-sm font-medium text-slate-600 dark:text-slate-300 text-center">Selected: {htmlFile.name}</div>}
            </div>
         )}

         {/* Options */}
         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Format</label>
               <select 
                 value={options.format}
                 onChange={(e) => setOptions({...options, format: e.target.value as any})}
                 className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:text-white focus:outline-none"
               >
                 <option value="a4">A4</option>
                 <option value="letter">Letter</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Orientation</label>
               <select 
                 value={options.orientation}
                 onChange={(e) => setOptions({...options, orientation: e.target.value as any})}
                 className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:text-white focus:outline-none"
               >
                 <option value="portrait">Portrait</option>
                 <option value="landscape">Landscape</option>
               </select>
            </div>
         </div>

         <button
            disabled={status === "processing" || (inputMethod === "paste" && !htmlContent) || (inputMethod === "file" && !htmlFile)}
            onClick={handleConvert}
            className="w-full mt-8 py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl active:scale-[0.98] bg-pink-600 text-white hover:bg-pink-700 shadow-pink-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "processing" ? "Converting..." : <><Download className="w-6 h-6" /> Convert to PDF</>}
          </button>
          
          {status !== "idle" && (
            <div className="mt-6">
              <ProcessingStatus status={status} message={message} />
            </div>
          )}
      </div>
    </div>
  );
};

export default HtmlToPdfView;