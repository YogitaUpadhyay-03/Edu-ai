import React from 'react';
import { Sparkles, Upload, Loader2 } from 'lucide-react';
import SharePopover from './SharePopover';
import ExportMenu from './ExportMenu';

export default function Header({ 
  activeDocTitle, 
  activeDocSlug,
  isAnalyzing, 
  analysisComplete, 
  onTriggerReview,
  activeDropdown,
  onToggleDropdown,
  onShowToast
}) {
  const isShareOpen = activeDropdown === 'share';
  const isExportOpen = activeDropdown === 'export';

  return (
    <header className="flex items-center justify-between px-4 bg-[#111214] border-b border-[#292A2E] h-[42px] select-none w-full relative z-30">
      {/* Left side */}
      <div className="flex items-center h-full">
        {/* Logo */}
        <span className="font-serif italic text-lg font-bold text-[#F5F5F5] tracking-tight">
          EduAI
        </span>
        
        {/* Vertical Divider */}
        <div className="w-[1px] h-4 bg-[#292A2E] mx-4" />
        
        {/* Breadcrumbs / Tabs */}
        <div className="flex items-center space-x-4 h-full text-xs">
          <span className="text-[#9A9BA1] cursor-pointer hover:text-white transition-colors duration-150">
            Project
          </span>
          <div className="relative flex items-center h-full">
            <span className="text-white font-medium cursor-pointer py-2">
              {activeDocTitle}
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3 h-full">
        {/* Share button container */}
        <div className="relative dropdown-trigger">
          <button 
            id="btn-header-share"
            type="button" 
            onClick={() => onToggleDropdown(isShareOpen ? null : 'share')}
            className={`px-3 py-1 text-xs hover:text-white border rounded transition-colors duration-150 font-medium ${
              isShareOpen 
                ? 'text-white bg-[#25282a] border-[#3e4144]' 
                : 'text-[#9A9BA1] bg-[#1e2022] hover:bg-[#25282a] border-[#2c2d31]'
            }`}
          >
            Share
          </button>

          {isShareOpen && (
            <SharePopover
              docTitle={activeDocTitle}
              docSlug={activeDocSlug}
              onClose={() => onToggleDropdown(null)}
              onShowToast={onShowToast}
            />
          )}
        </div>

        {/* Review button */}
        <button 
          id="btn-header-review"
          type="button" 
          disabled={isAnalyzing}
          onClick={onTriggerReview}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors duration-150 shadow-sm ${
            isAnalyzing 
              ? 'text-[#9A9BA1] bg-[#1e2022] border border-[#2c2d31] cursor-not-allowed'
              : analysisComplete
              ? 'text-green-400 bg-[#1e2022] border border-green-950'
              : 'text-[#111214] bg-[#F5F5F5] hover:bg-white cursor-pointer'
          }`}
        >
          {isAnalyzing ? (
            <>
              <span>Analyzing...</span>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9A9BA1]" />
            </>
          ) : analysisComplete ? (
            <>
              <span>AI Analysis Complete</span>
              <Sparkles className="w-3.5 h-3.5 fill-green-400 stroke-green-400" />
            </>
          ) : (
            <>
              <span>Review</span>
              <Sparkles className="w-3.5 h-3.5 fill-[#111214] stroke-[#111214]" />
            </>
          )}
        </button>

        {/* Share/Export icon */}
        <div className="relative dropdown-trigger">
          <button 
            id="btn-header-export"
            type="button" 
            title="Export"
            onClick={() => onToggleDropdown(isExportOpen ? null : 'export')}
            className={`p-1 hover:text-white transition-colors duration-150 rounded ${
              isExportOpen ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1]'
            }`}
          >
            <Upload className="w-4 h-4" />
          </button>

          {isExportOpen && (
            <ExportMenu
              onClose={() => onToggleDropdown(null)}
              onShowToast={onShowToast}
            />
          )}
        </div>

        {/* Small circular avatar */}
        <div className="w-6 h-6 rounded-full overflow-hidden border border-[#2c2d31] flex items-center justify-center bg-purple-900 cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" 
            alt="User Avatar" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>
    </header>
  );
}
