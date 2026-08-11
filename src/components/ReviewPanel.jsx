import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import ReviewIssue from './ReviewIssue';

export default function ReviewPanel({ 
  activeDocument, 
  selectedIssueId, 
  onSelectIssue,
  isAnalyzing 
}) {
  if (!activeDocument) {
    return (
      <aside className="w-[310px] bg-[#17191A] border-l border-[#303136] flex flex-col h-full select-none shrink-0 items-center justify-center p-6 text-center text-xs text-[#9A9BA1] gap-2">
        <ShieldCheck className="w-8 h-8 text-[#9A9BA1]/40" />
        <span>No documents loaded</span>
      </aside>
    );
  }

  // Use values from the active document, default to healthy states if empty
  const riskScore = isAnalyzing ? 50 : (activeDocument.riskScore !== undefined ? activeDocument.riskScore : 100);
  const highRisk = isAnalyzing ? 0 : (activeDocument.highRisk !== undefined ? activeDocument.highRisk : 0);
  const mediumRisk = isAnalyzing ? 0 : (activeDocument.mediumRisk !== undefined ? activeDocument.mediumRisk : 0);
  const issues = isAnalyzing ? [] : (activeDocument.issues || []);

  return (
    <aside className="w-[310px] bg-[#17191A] border-l border-[#303136] flex flex-col h-full select-none shrink-0 overflow-y-auto">
      {/* Overview Header */}
      <div className="p-4 border-b border-[#303136]/50">
        <h2 className="text-[#F5F5F5] font-semibold text-sm">Review Overview</h2>
        <p className="text-[11px] text-[#9A9BA1] mt-0.5">
          {isAnalyzing ? 'Analyzing contract...' : 'AI Analysis Complete'}
        </p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Document Health Card */}
        <div className="bg-[#1e2022]/40 border border-[#2C2D31] rounded-lg p-4">
          <div className="flex items-center gap-2 text-[#9A9BA1] mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-medium">Document Health</span>
          </div>

          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-white">
              {riskScore}
            </span>
            <span className="text-xs text-[#9A9BA1]">/ 100</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#2c2d31] rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-white h-1.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${riskScore}%` }} 
            />
          </div>
        </div>

        {/* Risk Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* High Risk Card */}
          <div className="bg-[#3b1c1c] border border-[#5c2424] rounded-lg p-3 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#4a2222] transition-colors">
            <span className="text-lg font-bold text-[#ef4444]">{highRisk}</span>
            <span className="text-[10px] font-semibold text-[#ef4444]/90 tracking-wide uppercase mt-0.5">
              High Risk
            </span>
          </div>

          {/* Medium Risk Card */}
          <div className="bg-[#3d2b1f] border border-[#613d24] rounded-lg p-3 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#4a3426] transition-colors">
            <span className="text-lg font-bold text-[#f59e0b]">{mediumRisk}</span>
            <span className="text-[10px] font-semibold text-[#f59e0b]/90 tracking-wide uppercase mt-0.5">
              Medium Risk
            </span>
          </div>
        </div>

        {/* Critical Issues Section */}
        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-xs font-semibold text-[#9A9BA1] tracking-wide uppercase mb-1">
            Critical Issues
          </h3>
          
          <div className="flex flex-col gap-3">
            {issues.length > 0 ? (
              issues.map((issue) => (
                <ReviewIssue
                  key={issue.id}
                  label={issue.label}
                  title={issue.title}
                  description={issue.description}
                  risk={issue.risk}
                  isSelected={selectedIssueId === issue.id}
                  onClick={() => onSelectIssue(issue.id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-[#2C2D31] rounded-lg bg-[#111214]/30 gap-2">
                <Info className="w-5 h-5 text-[#9A9BA1]" />
                <p className="text-[11px] text-[#9A9BA1] leading-normal">
                  {isAnalyzing ? 'Evaluating clauses...' : 'No critical issues detected. Document is healthy.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
