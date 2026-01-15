import React, { useState } from 'react';
import { ToolMetadata, ToolID } from '../types';

interface ToolGridProps {
  tools: ToolMetadata[];
  onSelect: (id: ToolID) => void;
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools, onSelect }) => {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-6xl tracking-tight">
          LocalPDF <span className="text-blue-600">Secure</span>
        </h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Professional PDF tools that run entirely in your browser. 
          Your files never leave your device.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelect(tool.id)}
            className="group flex flex-col p-6 glass bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700/50 rounded-3xl shadow-sm hover:shadow-2xl hover:bg-white dark:hover:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-1 transition-all text-left"
          >
            <div className={`${tool.color} text-white p-3.5 rounded-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform w-fit`}>
              {tool.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 tracking-tight">{tool.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{tool.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-20 glass bg-blue-600/95 dark:bg-blue-700/80 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl border border-blue-400/30">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <h3 className="text-3xl font-bold">Safe & Private</h3>
          <p className="text-blue-50 dark:text-blue-100 opacity-90 text-lg leading-relaxed">
            Other PDF tools upload your sensitive documents to remote servers. 
            We process everything on your computer.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Badge text="🔒 100% Private" />
          <Badge text="🚀 Local Only" />
          <Badge text="🌍 Works Offline" />
          <Badge text="💸 Free" />
        </div>
      </div>
    </div>
  );
};

const Badge: React.FC<{ text: string }> = ({ text }) => (
  <span className="glass bg-white/20 border border-white/20 px-5 py-2.5 rounded-full font-bold text-sm">
    {text}
  </span>
);

export default ToolGrid;