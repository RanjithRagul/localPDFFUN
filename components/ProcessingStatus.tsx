import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ProcessingStatusProps {
  status: "idle" | "processing" | "success" | "error";
  message?: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status, message }) => {
  if (status === "idle") return null;

  const statusConfig = {
    processing: {
      color: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
    },
    success: {
      color: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
      color: "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
      icon: <AlertCircle className="w-5 h-5" />,
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border ${config.color}`}>
      {config.icon}
      <span className="text-sm font-medium">{message || status}</span>
    </div>
  );
};

export default ProcessingStatus;