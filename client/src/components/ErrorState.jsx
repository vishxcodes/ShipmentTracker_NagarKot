import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Failed to load data',
  message = 'An error occurred while communicating with the server.',
  onRetry,
}) {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center bg-[#0d1117] border border-[#f85149]/30 rounded-xl m-4">
      <div className="w-10 h-10 rounded-full bg-[#da3633]/15 border border-[#da3633]/30 flex items-center justify-center text-[#f85149] mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-[#f0f6fc]">{title}</h4>
      <p className="text-xs text-[#8b949e] mt-1 max-w-md">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] border border-[#30363d] hover:border-[#8b949e]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
