import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText } from 'lucide-react';

export default function SearchOverlay({ isOpen, onClose, documents, onSelectDocument }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 z-50 animate-fade-in">
      <div 
        className="w-[500px] bg-[#17191A] border border-[#2C2D31] rounded-lg shadow-2xl overflow-hidden dropdown-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#2C2D31] gap-3">
          <Search className="w-5 h-5 text-[#9A9BA1]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documents by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-[#9A9BA1] focus:ring-0 focus:outline-none"
          />
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-[#9A9BA1] hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredDocs.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => {
                    onSelectDocument(doc.id);
                    onClose();
                  }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-md hover:bg-[#1e2022] text-xs text-[#9A9BA1] hover:text-[#F5F5F5] transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#9A9BA1]" />
                  <span className="font-medium">
                    {doc.title}
                    {doc.archived && (
                      <span className="ml-2 text-[10px] text-gray-500 italic font-normal">(Archived)</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#9A9BA1]">
              No documents found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
