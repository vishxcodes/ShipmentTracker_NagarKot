import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading shipments...' }) {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#58a6ff] mb-3 animate-pulse">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
      <p className="text-sm font-medium text-[#e6edf3]">{message}</p>
      <p className="text-xs text-[#8b949e] mt-1">Connecting to Nagarkot Forwarders API</p>
    </div>
  );
}
