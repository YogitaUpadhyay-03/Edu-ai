import React from 'react';
import EditableBlock from './EditableBlock';

export default function DocumentPage({ activeDocument, selectedIssueId, onContentChange, editorRef }) {
  if (!activeDocument) return null;

  const { content } = activeDocument;

  // Helper to highlight currently selected issue span in the raw HTML string
  // If selectedIssueId is active, we find its span ID in the HTML and inject inline select styling dynamically.
  // Wait, since raw HTML is loaded into contentEditable, we can dynamically add an active class to the element
  // inside our contentEditable block. But doing it on raw HTML can be tricky.
  // Instead, we can add a small CSS rule in index.css to style the selected span automatically!
  // E.g., in index.css:
  // `#sec-highlight-${selectedIssueId} { background-color: #d8b4fe !important; color: #581c1c !important; font-weight: 600; ring: 2px solid purple; }`
  // Wait, this is brilliant! It requires ZERO raw HTML regex manipulation, is 100% robust, and updates the styles dynamically in real-time!
  // Let's implement this dynamic styling rule in the index.css.

  return (
    <article className="w-[530px] min-h-[750px] bg-white text-[#171717] shadow-xl rounded-md p-10 flex flex-col font-serif select-text text-[13px] leading-relaxed mx-auto my-6 border border-[#e5e4e7] transition-all">
      {/* Dynamic Style Overlay for Selected Highlight */}
      {selectedIssueId && (
        <style dangerouslySetInnerHTML={{
          __html: `
            #sec-highlight-${selectedIssueId} {
              background-color: #d8b4fe !important;
              color: #3b0764 !important;
              font-weight: 600 !important;
              outline: 2px solid #8b5cf6 !important;
              outline-offset: 1px !important;
              border-radius: 2px !important;
            }
          `
        }} />
      )}

      {/* Title */}
      <EditableBlock
        value={content.title || ''}
        onChange={(val) => onContentChange('title', val)}
        className="text-center font-bold tracking-wide text-sm uppercase mb-1 text-[#171717] border-b border-transparent hover:border-gray-200 focus:border-purple-300 py-0.5"
        placeholder="UNTITLED DOCUMENT"
      />
      
      {/* Date */}
      <EditableBlock
        value={content.date || ''}
        onChange={(val) => onContentChange('date', val)}
        className="text-center text-xs text-gray-500 italic mb-4 border-b border-transparent hover:border-gray-100 focus:border-purple-300 py-0.5"
        placeholder="Dated as of..."
      />

      {/* Horizontal Divider */}
      <hr className="border-t border-gray-300 w-full mb-6" />

      {/* Editable Body HTML */}
      <EditableBlock
        ref={editorRef}
        value={content.html || ''}
        onChange={(val) => onContentChange('html', val)}
        className="flex-1 w-full text-justify text-[13px] leading-relaxed focus:outline-none min-h-[500px]"
        placeholder="Start writing contract terms here..."
      />
    </article>
  );
}
