import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function SharePopover({ docTitle, docSlug, onClose, onShowToast }) {
  const shareUrl = `https://eduai.app/document/${docSlug || 'service-agreement'}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onShowToast('Link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-[280px] bg-[#17191A] border border-[#2C2D31] rounded-lg p-3.5 shadow-2xl z-40 flex flex-col gap-3 text-left dropdown-content"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title */}
      <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">
        Share Project {docTitle}
      </h4>

      {/* Input row */}
      <div className="flex items-center gap-1.5 bg-[#1e2022] border border-[#2C2D31] rounded-md p-1.5">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="flex-1 bg-transparent border-none outline-none text-[11px] text-[#9A9BA1] focus:ring-0 overflow-x-auto select-all"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 text-[#9A9BA1] hover:text-white rounded hover:bg-[#25282a] transition-colors shrink-0"
          title="Copy Link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 mt-1">
        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1 text-[11px] font-semibold text-[#111214] bg-[#F5F5F5] hover:bg-white rounded transition-colors"
        >
          Copy Link
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-2.5 py-1 text-[11px] font-medium text-[#9A9BA1] hover:text-white bg-[#1e2022] hover:bg-[#25282a] border border-[#2c2d31] rounded transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
