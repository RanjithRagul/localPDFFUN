import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { ToolType } from '../types';

interface ToolSwitcherProps {
  currentTool: ToolType;
  onChange: (tool: ToolType) => void;
  disabled: boolean;
}

const ToolSwitcher: React.FC<ToolSwitcherProps> = ({ currentTool, onChange, disabled }) => {
  return (
    <div className="flex p-1 space-x-1 bg-gray-100/80 rounded-xl max-w-md mx-auto mb-8">
      <button
        onClick={() => onChange(ToolType.LOCK)}
        disabled={disabled}
        className={`
          flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200
          ${currentTool === ToolType.LOCK 
            ? 'bg-white text-accent shadow-sm ring-1 ring-black/5' 
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Lock className="w-4 h-4" />
        <span>Lock PDF</span>
      </button>
      
      <button
        onClick={() => onChange(ToolType.UNLOCK)}
        disabled={disabled}
        className={`
          flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200
          ${currentTool === ToolType.UNLOCK 
            ? 'bg-white text-orange-500 shadow-sm ring-1 ring-black/5' 
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Unlock className="w-4 h-4" />
        <span>Unlock PDF</span>
      </button>
    </div>
  );
};

export default ToolSwitcher;
