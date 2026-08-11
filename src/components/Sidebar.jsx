import React, { useState } from 'react';
import { Search, PlusCircle, Folder, ChevronDown, FileText, Archive, Settings, HelpCircle } from 'lucide-react';

export default function Sidebar({
  documents,
  activeDocId,
  onSelectDocument,
  onOpenSearch,
  isProjectsExpanded,
  onToggleProjectsExpanded,
  activeDropdown,
  onToggleDropdown,
  onOpenNewContractModal,
  onShowToast,
  onContextMenu
}) {
  const [isArchiveExpanded, setIsArchiveExpanded] = useState(false);

  const isNewContractOpen = activeDropdown === 'new-contract';

  // Filter documents into active projects and archived contracts
  const activeProjects = documents.filter(doc => !doc.archived);
  const archivedDocuments = documents.filter(doc => doc.archived);

  const handleDocRightClick = (e, docId, isArchived) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, docId, isArchived);
  };

  return (
    <aside className="w-[287px] bg-[#181A1B] border-r border-[#303136] flex flex-col justify-between h-full select-none text-sm shrink-0 relative z-20">
      {/* Top Section */}
      <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
        
        {/* Search */}
        <div className="relative flex items-center cursor-pointer" onClick={onOpenSearch}>
          <Search className="absolute left-3 w-4 h-4 text-[#9A9BA1]" />
          <input
            id="sidebar-search"
            type="text"
            readOnly
            placeholder="Search"
            className="w-full bg-[#1e2022] hover:bg-[#25282a] border border-[#2c2d31] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#9A9BA1] focus:outline-none cursor-pointer transition-colors"
          />
        </div>

        {/* New Contract Button */}
        <div className="relative dropdown-trigger">
          <button
            id="btn-sidebar-new-contract"
            type="button"
            onClick={() => onToggleDropdown(isNewContractOpen ? null : 'new-contract')}
            className={`flex items-center gap-2.5 w-full text-xs border px-3 py-2 rounded-md font-medium cursor-pointer transition-colors ${
              isNewContractOpen 
                ? 'text-white bg-[#1e2022] border-[#3e4144]' 
                : 'text-[#9A9BA1] bg-[#181A1B] hover:bg-[#1e2022] hover:text-[#F5F5F5] border-[#303136]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Contract</span>
          </button>

          {isNewContractOpen && (
            <div 
              className="absolute left-0 right-0 top-full mt-1.5 bg-[#17191A] border border-[#2C2D31] rounded-lg p-1.5 shadow-2xl z-40 flex flex-col dropdown-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                type="button" 
                onClick={() => {
                  onOpenNewContractModal();
                  onToggleDropdown(null);
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#1e2022] rounded transition-colors"
              >
                New Blank Contract
              </button>
              <button 
                type="button" 
                onClick={() => {
                  onShowToast('DOCX import started');
                  onToggleDropdown(null);
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#1e2022] rounded transition-colors"
              >
                Import DOCX
              </button>
              <button 
                type="button" 
                onClick={() => {
                  onShowToast('PDF import started');
                  onToggleDropdown(null);
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#1e2022] rounded transition-colors"
              >
                Import PDF
              </button>
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="flex flex-col">
          <div className="bg-[#1e2022]/40 border border-[#2c2d31] rounded-lg p-2 flex flex-col">
            
            {/* Folder Toggle */}
            <div 
              onClick={onToggleProjectsExpanded}
              className="flex items-center justify-between px-2 py-1.5 text-[#F5F5F5] hover:bg-[#25282a] rounded cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#9A9BA1]" />
                <span className="font-medium text-xs">Projects</span>
              </div>
              <ChevronDown 
                className={`w-3.5 h-3.5 text-[#9A9BA1] transition-transform duration-200 ${
                  isProjectsExpanded ? '' : '-rotate-90'
                }`} 
              />
            </div>

            {/* Document list */}
            {isProjectsExpanded && (
              <div className="mt-1 flex flex-col relative pl-2">
                <div className="absolute left-4 top-0 bottom-4 w-[1px] bg-[#303136]" />

                {activeProjects.length > 0 ? (
                  activeProjects.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => onSelectDocument(doc.id)}
                      onContextMenu={(e) => handleDocRightClick(e, doc.id, false)}
                      className={`group flex items-center justify-between py-1.5 px-3 pl-6 rounded-md my-[2px] cursor-pointer text-xs transition-all relative ${
                        doc.id === activeDocId
                          ? 'bg-[#25282a] border border-[#303136] text-[#F5F5F5] font-medium'
                          : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#1e2022]/50'
                      }`}
                    >
                      {doc.id === activeDocId && (
                        <div className="absolute left-[3px] top-1.5 bottom-1.5 w-[2.5px] bg-white rounded-full" />
                      )}

                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText 
                          className={`w-3.5 h-3.5 shrink-0 ${
                            doc.id === activeDocId ? 'text-white' : 'text-[#9A9BA1]'
                          }`} 
                        />
                        <span className="truncate">{doc.title}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-3 pl-6 text-[10px] text-[#9A9BA1] italic">
                    No active projects
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Archive Section Toggle */}
        <div className="flex flex-col">
          <div 
            onClick={() => setIsArchiveExpanded(!isArchiveExpanded)}
            className="flex items-center justify-between px-3 py-2 text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#1e2022]/40 rounded-md cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Archive className="w-4 h-4" />
              <span className="text-xs font-medium">Archive</span>
            </div>
            <ChevronDown 
              className={`w-3.5 h-3.5 text-[#9A9BA1] transition-transform duration-200 ${
                isArchiveExpanded ? '' : '-rotate-90'
              }`} 
            />
          </div>

          {/* Archived list */}
          {isArchiveExpanded && (
            <div className="mt-1 flex flex-col relative pl-2 ml-1">
              <div className="absolute left-4 top-0 bottom-4 w-[1px] bg-[#303136]" />

              {archivedDocuments.length > 0 ? (
                archivedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDocument(doc.id)}
                    onContextMenu={(e) => handleDocRightClick(e, doc.id, true)}
                    className={`group flex items-center justify-between py-1.5 px-3 pl-6 rounded-md my-[2px] cursor-pointer text-xs transition-all relative ${
                      doc.id === activeDocId
                        ? 'bg-[#25282a] border border-[#303136] text-[#F5F5F5]/90 font-medium'
                        : 'text-[#9A9BA1]/60 hover:text-[#F5F5F5] hover:bg-[#1e2022]/50'
                    }`}
                  >
                    {doc.id === activeDocId && (
                      <div className="absolute left-[3px] top-1.5 bottom-1.5 w-[2.5px] bg-[#9A9BA1] rounded-full" />
                    )}

                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText 
                        className={`w-3.5 h-3.5 shrink-0 ${
                          doc.id === activeDocId ? 'text-[#9A9BA1]' : 'text-[#9A9BA1]/40'
                        }`} 
                      />
                      <span className="truncate italic">{doc.title}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-3 pl-6 text-[10px] text-[#9A9BA1]/50 italic">
                  Archive is empty
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Pinned Items */}
      <div className="p-4 border-t border-[#2c2d31]/40 flex flex-col gap-3 shrink-0">
        <div 
          onClick={() => onShowToast('Settings panel coming soon')}
          className="flex items-center gap-2.5 px-3 py-1.5 text-[#9A9BA1] hover:text-[#F5F5F5] cursor-pointer transition-colors rounded-md hover:bg-[#1e2022]/40 w-fit"
        >
          <Settings className="w-4.5 h-4.5" />
        </div>
        <div 
          onClick={() => onShowToast('Help center coming soon')}
          className="flex items-center gap-2.5 px-3 py-1.5 text-[#9A9BA1] hover:text-[#F5F5F5] cursor-pointer transition-colors rounded-md hover:bg-[#1e2022]/40 w-fit"
        >
          <HelpCircle className="w-4.5 h-4.5" />
        </div>
      </div>
    </aside>
  );
}
