import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FormattingToolbar from '../components/FormattingToolbar';
import DocumentPage from '../components/DocumentPage';
import ReviewPanel from '../components/ReviewPanel';
import AICommandBar from '../components/AICommandBar';
import SearchOverlay from '../components/SearchOverlay';
import NewContractModal from '../components/NewContractModal';
import RenameModal from '../components/RenameModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ContextMenu from '../components/ContextMenu';
import Toast from '../components/Toast';
import { mockDocuments } from '../data/documents';
import { FileText } from 'lucide-react';

export default function Workspace() {
  // Initialize documents state from localStorage, fallback to default mock documents
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('eduai-documents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading saved documents:", e);
      }
    }

    // Default Fallback: load mock documents and compile sections to single HTML body
    const initialDocs = mockDocuments.map(doc => {
      if (doc.content.html) return doc;

      let html = '';
      if (doc.content.sections) {
        doc.content.sections.forEach(section => {
          if (section.heading) {
            html += `<h2 class="font-bold uppercase text-[12px] tracking-wider mb-2 text-[#171717] mt-4">${section.heading}</h2>`;
          }

          let paragraphHtml = '';
          if (section.bold1) {
            paragraphHtml = `${section.prefix}<strong class="font-bold">${section.bold1}</strong>${section.mid}<strong class="font-bold">${section.bold2}</strong>${section.suffix}`;
          } else if (section.highlight) {
            const highlightClass = section.highlightType === 'purple' ? 'highlight-purple' : 'highlight-yellow';
            paragraphHtml = `${section.prefix}<span id="sec-highlight-${section.highlightId}" class="${highlightClass}">${section.highlight}</span>${section.suffix}`;
          } else {
            paragraphHtml = section.prefix || '';
          }

          html += `<p class="mb-4 text-justify">${paragraphHtml}</p>`;
        });
      }

      return {
        ...doc,
        archived: doc.archived || false,
        content: {
          ...doc.content,
          html: html
        }
      };
    });

    localStorage.setItem('eduai-documents', JSON.stringify(initialDocs));
    return initialDocs;
  });

  // Active document selection state
  const [activeDocId, setActiveDocId] = useState(() => {
    // Default to the first non-archived document
    const saved = localStorage.getItem('eduai-documents');
    const docs = saved ? JSON.parse(saved) : mockDocuments;
    const activeProjects = docs.filter(d => !d.archived);
    return activeProjects.length > 0 ? activeProjects[0].id : null;
  });

  // Tree and Overlay states
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'share', 'export', 'new-contract', 'normal-text'
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Rename/Delete Modal states
  const [renameModal, setRenameModal] = useState(null); // null or { docId, docTitle }
  const [deleteModal, setDeleteModal] = useState(null); // null or { docId, docTitle }

  // Context Menu state
  const [contextMenu, setContextMenu] = useState(null); // null or { x, y, docId, isArchived }

  // AI Review states
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [toastId, setToastId] = useState(0);

  // Comment Popover state
  const [activeCommentPopover, setActiveCommentPopover] = useState(null); // null or { commentId, commentText, spanText, x, y }

  const saveDebouncedRef = useRef(null);
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);

  // Selection change listener to track ranges inside the editor
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        // Ensure the selection is inside the body editor
        if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
          savedRangeRef.current = range.cloneRange();
        }
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Find currently active document object
  const activeDocument = documents.find(doc => doc.id === activeDocId);

  // Reset review selections and saved range when document shifts
  useEffect(() => {
    setSelectedIssueId(null);
    setAnalysisComplete(false);
    savedRangeRef.current = null;
  }, [activeDocId]);

  // Restore selection range helper
  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRangeRef.current.cloneRange());
      return true;
    }
    return false;
  };

  // Format action execution helper
  const handleFormat = (command, value = null) => {
    // 1. Restore selection
    restoreSelection();

    // 2. Perform command
    if (command === 'comment') {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        showToast("Select text to add a comment");
        return;
      }
      
      const range = selection.getRangeAt(0);
      const commentId = 'comment-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      const span = document.createElement('span');
      span.className = 'comment-highlight';
      span.setAttribute('data-comment-id', commentId);
      span.setAttribute('data-comment-text', 'Add comment text...');
      
      try {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
        
        // Re-select the comment node
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.addRange(newRange);
        
        showToast("Comment added");
      } catch (e) {
        console.error("Failed to add comment:", e);
      }
    } else if (command === 'formatBlock') {
      document.execCommand('formatBlock', false, value);
    } else {
      document.execCommand(command, false, value);
    }

    // 3. Save selection again after change
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }

    // 4. Update the state immediately
    if (editorRef.current) {
      handleContentChange('html', editorRef.current.innerHTML);
    }
  };

  // Synchronous localStorage save helper
  const saveToLocalStorage = (docsList) => {
    localStorage.setItem('eduai-documents', JSON.stringify(docsList));
  };

  // Debounced save for content changes
  const saveDocsDebounced = (updatedDocs) => {
    if (saveDebouncedRef.current) {
      clearTimeout(saveDebouncedRef.current);
    }
    saveDebouncedRef.current = setTimeout(() => {
      saveToLocalStorage(updatedDocs);
    }, 500);
  };

  // Handle clicking on text containing comments
  const handleEditorClick = (e) => {
    const commentSpan = e.target.closest('.comment-highlight');
    if (commentSpan) {
      e.preventDefault();
      e.stopPropagation();
      const commentId = commentSpan.getAttribute('data-comment-id');
      const commentText = commentSpan.getAttribute('data-comment-text') || '';
      
      setActiveDropdown(null);
      
      setActiveCommentPopover({
        commentId,
        commentText,
        spanText: commentSpan.textContent,
        x: e.clientX,
        y: e.clientY
      });
    } else {
      setActiveCommentPopover(null);
    }
  };

  // Handle right-clicking on comments
  const handleEditorContextMenu = (e) => {
    const commentSpan = e.target.closest('.comment-highlight');
    if (commentSpan) {
      e.preventDefault();
      e.stopPropagation();
      const commentId = commentSpan.getAttribute('data-comment-id');
      const commentText = commentSpan.getAttribute('data-comment-text') || '';
      
      setActiveDropdown(null);
      setContextMenu(null);
      
      setActiveCommentPopover({
        commentId,
        commentText,
        spanText: commentSpan.textContent,
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  // Global event listeners for clicking outside and keyboard dismissals
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.dropdown-trigger') && !e.target.closest('.dropdown-content')) {
        setActiveDropdown(null);
      }
      if (!e.target.closest('.comment-highlight') && !e.target.closest('.comment-popover-container')) {
        setActiveCommentPopover(null);
      }
      setContextMenu(null);
    };

    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
        setIsNewContractModalOpen(false);
        setIsSearchOpen(false);
        setRenameModal(null);
        setDeleteModal(null);
        setActiveDropdown(null);
        setActiveCommentPopover(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Show toast helper
  const showToast = (message) => {
    setToastMessage(message);
    setToastId(Date.now());
  };

  // Select another available document helper
  const selectAnotherDoc = (excludeId, preferProjects = true) => {
    const remainingProjects = documents.filter(d => !d.archived && d.id !== excludeId);
    const remainingArchived = documents.filter(d => d.archived && d.id !== excludeId);

    if (preferProjects && remainingProjects.length > 0) {
      setActiveDocId(remainingProjects[0].id);
    } else if (remainingArchived.length > 0) {
      setActiveDocId(remainingArchived[0].id);
    } else if (remainingProjects.length > 0) {
      setActiveDocId(remainingProjects[0].id);
    } else {
      setActiveDocId(null); // No documents left at all
    }
  };

  // Document switching with immediate save flush
  const handleSelectDocument = (newId) => {
    if (saveDebouncedRef.current) {
      clearTimeout(saveDebouncedRef.current);
      saveToLocalStorage(documents);
    }
    setActiveDocId(newId);
  };

  // Document content modification handler
  const handleContentChange = (field, newValue) => {
    setDocuments(prevDocs => {
      const updatedDocs = prevDocs.map(doc => {
        if (doc.id === activeDocId) {
          const updatedContent = { ...doc.content };
          if (field === 'title') updatedContent.title = newValue;
          else if (field === 'date') updatedContent.date = newValue;
          else if (field === 'html') updatedContent.html = newValue;

          return {
            ...doc,
            title: field === 'title' ? (newValue.trim() || doc.title) : doc.title,
            content: updatedContent
          };
        }
        return doc;
      });

      saveDocsDebounced(updatedDocs);
      return updatedDocs;
    });
  };

  // Document creation handler
  const handleCreateContract = (title) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const finalSlug = documents.some(d => d.id === slug) ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const newDoc = {
      id: finalSlug,
      title: title,
      riskScore: 100,
      highRisk: 0,
      mediumRisk: 0,
      archived: false,
      content: {
        title: title.toUpperCase(),
        date: `Dated as of ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        html: `<p class="mb-4 text-justify">Start typing your new agreement terms here...</p>`
      },
      issues: []
    };

    setDocuments(prev => {
      const updated = [...prev, newDoc];
      saveToLocalStorage(updated);
      return updated;
    });
    setActiveDocId(newDoc.id);
    showToast('Document created');
  };

  // Custom Right-Click Context Menu Trigger
  const handleContextMenu = (e, docId, isArchived) => {
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      docId,
      isArchived
    });
  };

  // Document Rename Action
  const handleRename = (newName) => {
    if (!renameModal) return;
    const { docId } = renameModal;

    setDocuments(prevDocs => {
      const updatedDocs = prevDocs.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            title: newName,
            content: {
              ...doc.content,
              title: newName.toUpperCase()
            }
          };
        }
        return doc;
      });
      saveToLocalStorage(updatedDocs);
      return updatedDocs;
    });

    setRenameModal(null);
    showToast('Document renamed');
  };

  // Document Archive Action
  const handleArchive = (docId) => {
    setDocuments(prevDocs => {
      const updatedDocs = prevDocs.map(doc => {
        if (doc.id === docId) {
          return { ...doc, archived: true };
        }
        return doc;
      });
      saveToLocalStorage(updatedDocs);
      return updatedDocs;
    });

    showToast('Document archived');

    if (activeDocId === docId) {
      selectAnotherDoc(docId, true);
    }
  };

  // Document Restore Action
  const handleRestore = (docId) => {
    setDocuments(prevDocs => {
      const updatedDocs = prevDocs.map(doc => {
        if (doc.id === docId) {
          return { ...doc, archived: false };
        }
        return doc;
      });
      saveToLocalStorage(updatedDocs);
      return updatedDocs;
    });

    showToast('Document restored');
  };

  // Document Delete Action
  const handleDelete = () => {
    if (!deleteModal) return;
    const { docId } = deleteModal;

    setDocuments(prevDocs => {
      const updatedDocs = prevDocs.filter(doc => doc.id !== docId);
      saveToLocalStorage(updatedDocs);
      return updatedDocs;
    });

    setDeleteModal(null);
    showToast('Document deleted');

    if (activeDocId === docId) {
      selectAnotherDoc(docId, false);
    }
  };

  // Trigger Review Analysis Simulation
  const handleTriggerReview = () => {
    if (!activeDocument) return;
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setSelectedIssueId(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      showToast('AI analysis complete');

      // Inject mock issues into empty newly created contracts to make them interactive
      if (activeDocument.riskScore === 100 && (!activeDocument.issues || activeDocument.issues.length === 0)) {
        setDocuments(prev => {
          const updated = prev.map(doc => {
            if (doc.id === activeDocId) {
              return {
                ...doc,
                riskScore: 85,
                highRisk: 1,
                mediumRisk: 1,
                content: {
                  ...doc.content,
                  html: `
                    <p class="mb-4 text-justify">This contract acts as the primary vehicle for development. <span id="sec-highlight-issue-new-purpose" class="highlight-purple">This clause outlines that both parties waive all rights to claim damages in case of early project termination.</span></p>
                    <p class="mb-4 text-justify">The service is provided on an as-is basis. <span id="sec-highlight-issue-new-limit" class="highlight-yellow">Warranty claims must be submitted to our support team within exactly forty-eight (48) hours of contract signing.</span></p>
                  `
                },
                issues: [
                  {
                    id: 'issue-new-purpose',
                    label: 'Liability',
                    title: 'Unfair waiver of damages',
                    description: 'Waiving all rights to damages exposes the organization to operational losses.',
                    risk: 'high',
                    sectionId: 'sec-new-purpose'
                  },
                  {
                    id: 'issue-new-limit',
                    label: 'Warranty Scope',
                    title: 'Extremely short claims window',
                    description: '48-hour warranty limit is commercially restrictive and impractical.',
                    risk: 'medium',
                    sectionId: 'sec-new-limit'
                  }
                ]
              };
            }
            return doc;
          });
          saveToLocalStorage(updated);
          return updated;
        });
      }
    }, 1500);
  };

  // Scroll to highlight element inside Document
  const handleSelectIssue = (issueId) => {
    setSelectedIssueId(issueId);
    setTimeout(() => {
      const element = document.getElementById(`sec-highlight-${issueId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#111214] text-[#F5F5F5] font-sans overflow-hidden">
      {/* Header */}
      <Header 
        activeDocTitle={activeDocument ? activeDocument.title : 'No Document'}
        activeDocSlug={activeDocument ? activeDocument.id : ''}
        isAnalyzing={isAnalyzing}
        analysisComplete={analysisComplete}
        onTriggerReview={handleTriggerReview}
        activeDropdown={activeDropdown}
        onToggleDropdown={setActiveDropdown}
        onShowToast={showToast}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 h-[calc(100vh-42px)] overflow-hidden w-full">
        {/* Left Sidebar */}
        <Sidebar 
          documents={documents}
          activeDocId={activeDocId}
          onSelectDocument={handleSelectDocument}
          onOpenSearch={() => setIsSearchOpen(true)}
          isProjectsExpanded={isProjectsExpanded}
          onToggleProjectsExpanded={() => setIsProjectsExpanded(!isProjectsExpanded)}
          activeDropdown={activeDropdown}
          onToggleDropdown={setActiveDropdown}
          onOpenNewContractModal={() => setIsNewContractModalOpen(true)}
          onShowToast={showToast}
          onContextMenu={handleContextMenu}
        />

        {/* Center Document Area */}
        <main className="flex-1 h-full relative bg-[#111214] overflow-hidden flex flex-col border-r border-[#303136]/30">
          {activeDocument ? (
            <>
              {/* Floating Formatting Toolbar */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 dropdown-trigger">
                <FormattingToolbar 
                  onShowToast={showToast}
                  activeDropdown={activeDropdown}
                  onToggleDropdown={setActiveDropdown}
                  editorRef={editorRef}
                  onFormat={handleFormat}
                />
              </div>

              {/* Scrollable Document Container */}
              <div 
                className="flex-1 overflow-y-auto w-full flex flex-col items-center pt-16 pb-24 px-4"
                onClick={handleEditorClick}
                onContextMenu={handleEditorContextMenu}
              >
                <DocumentPage 
                  activeDocument={activeDocument} 
                  selectedIssueId={selectedIssueId} 
                  onContentChange={handleContentChange}
                  editorRef={editorRef}
                />
              </div>

              {/* Floating AI Command Bar */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                <AICommandBar />
              </div>
            </>
          ) : (
            /* Empty document state canvas placeholder */
            <div className="flex flex-col items-center justify-center flex-1 h-full select-none text-center p-8 gap-4 bg-[#111214]">
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-[#9A9BA1]">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-white">No documents</h3>
                <p className="text-xs text-[#9A9BA1]">Create a new contract to get started.</p>
              </div>
            </div>
          )}
        </main>

        {/* Right AI Review Panel */}
        <ReviewPanel 
          activeDocument={activeDocument}
          selectedIssueId={selectedIssueId}
          onSelectIssue={handleSelectIssue}
          isAnalyzing={isAnalyzing}
        />
      </div>

      {/* Right-Click Context Menu overlay */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          docId={contextMenu.docId}
          isArchived={contextMenu.isArchived}
          onClose={() => setContextMenu(null)}
          onRename={() => {
            const doc = documents.find(d => d.id === contextMenu.docId);
            if (doc) setRenameModal({ docId: doc.id, docTitle: doc.title });
          }}
          onArchive={() => handleArchive(contextMenu.docId)}
          onRestore={() => handleRestore(contextMenu.docId)}
          onDelete={() => {
            const doc = documents.find(d => d.id === contextMenu.docId);
            if (doc) setDeleteModal({ docId: doc.id, docTitle: doc.title });
          }}
        />
      )}

      {/* Overlays / Modals */}
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        documents={documents}
        onSelectDocument={handleSelectDocument}
      />

      <NewContractModal 
        isOpen={isNewContractModalOpen}
        onClose={() => setIsNewContractModalOpen(false)}
        onCreateContract={handleCreateContract}
      />

      <RenameModal
        isOpen={!!renameModal}
        currentTitle={renameModal ? renameModal.docTitle : ''}
        onClose={() => setRenameModal(null)}
        onRename={handleRename}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteModal}
        docTitle={deleteModal ? deleteModal.docTitle : ''}
        onClose={() => setDeleteModal(null)}
        onDelete={handleDelete}
      />

      {/* Comment popover overlay */}
      {activeCommentPopover && (
        <div 
          className="fixed bg-[#17191A] border border-[#2C2D31] rounded-lg p-3 shadow-2xl z-50 flex flex-col gap-2 w-[240px] comment-popover-container text-left"
          style={{
            top: activeCommentPopover.y + 10,
            left: Math.min(activeCommentPopover.x, window.innerWidth - 250)
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] uppercase tracking-wider text-[#9A9BA1] font-semibold select-none">Comment</div>
          <div className="text-xs text-[#F5F5F5] italic border-l-2 border-[#8B5CF6] pl-2 py-0.5 max-h-[60px] overflow-y-auto select-none">
            "{activeCommentPopover.spanText}"
          </div>
          <textarea
            value={activeCommentPopover.commentText}
            placeholder="Write a comment note..."
            onChange={(e) => {
              const newText = e.target.value;
              setActiveCommentPopover(prev => ({ ...prev, commentText: newText }));
              
              if (editorRef.current) {
                const span = editorRef.current.querySelector(`span.comment-highlight[data-comment-id="${activeCommentPopover.commentId}"]`);
                if (span) {
                  span.setAttribute('data-comment-text', newText);
                  handleContentChange('html', editorRef.current.innerHTML);
                }
              }
            }}
            className="w-full bg-[#1e2022] border border-[#2C2D31] rounded p-2 text-xs text-[#F5F5F5] placeholder-[#9A9BA1] focus:outline-none focus:border-purple-500 resize-none h-[60px]"
          />
          <div className="flex items-center justify-between gap-2 mt-1 select-none">
            <button
              onClick={() => {
                if (editorRef.current) {
                  const span = editorRef.current.querySelector(`span.comment-highlight[data-comment-id="${activeCommentPopover.commentId}"]`);
                  if (span) {
                    const parent = span.parentNode;
                    while (span.firstChild) {
                      parent.insertBefore(span.firstChild, span);
                    }
                    parent.removeChild(span);
                    handleContentChange('html', editorRef.current.innerHTML);
                    showToast('Comment deleted');
                  }
                }
                setActiveCommentPopover(null);
              }}
              className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              Delete Comment
            </button>
            <button
              onClick={() => setActiveCommentPopover(null)}
              className="text-xs text-[#9A9BA1] hover:text-[#F5F5F5] px-2 py-1 rounded hover:bg-[#25282a] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast Alert Portal */}
      <Toast 
        key={toastId}
        message={toastMessage} 
        onClose={() => setToastMessage('')} 
      />
    </div>
  );
}
