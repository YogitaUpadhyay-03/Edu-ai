import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, User, Bot, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AICommandBar() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom of chat when new messages appear
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: userMessage }]);

    // Simulated AI response delay (800ms)
    setTimeout(() => {
      let aiText = "Here is a revised confidentiality clause with a longer survival period and clearer obligations.";
      
      // Dynamic mock responses depending on user query
      const lowerMessage = userMessage.toLowerCase();
      if (lowerMessage.includes('liability')) {
        aiText = "Here is a standard limitation of liability clause: 'Neither party shall be liable for indirect, incidental, or consequential damages. Licensor\'s total cumulative liability shall be capped at the fees paid in the past 12 months.'";
      } else if (lowerMessage.includes('purpose') || lowerMessage.includes('clause 1')) {
        aiText = "I\'ve redrafted the Purpose clause to state: 'The Parties agree to cooperate in good faith to develop and distribute the Zenith Suite. This agreement acts as a preliminary framework, and binding terms will be detailed in the Definitive Agreement.'";
      } else if (lowerMessage.includes('exclusivity')) {
        aiText = "Redrafted Exclusivity: 'The 6-month exclusivity period is reduced to 90 days, permitting either party to pursue alternative integrations should negotiations stall.'";
      }

      setMessages((prev) => [
        ...prev, 
        { id: `ai-${Date.now()}`, sender: 'ai', text: aiText }
      ]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="relative select-text flex flex-col w-[400px]">
      
      {/* Response Area (Floating directly above input bar) */}
      <AnimatePresence>
        {(messages.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 left-0 right-0 w-[400px] bg-[#17191A] border border-[#2C2D31] rounded-lg shadow-2xl z-30 flex flex-col max-h-[190px] overflow-hidden"
          >
            {/* Header / Clear chat */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#2C2D31]/50 bg-[#1e2022]/30 shrink-0">
              <span className="text-[9px] uppercase tracking-wider text-[#9A9BA1] font-semibold">
                AI Copilot Chat
              </span>
              <button 
                type="button" 
                onClick={handleClear}
                className="text-[#9A9BA1] hover:text-white transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Message list container */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 scrollbar-none"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-2 text-xs ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-5 h-5 rounded-full bg-purple-900/60 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-purple-300" />
                    </div>
                  )}
                  <div className={`rounded-lg px-2.5 py-1.5 max-w-[80%] leading-normal ${
                    msg.sender === 'user' 
                      ? 'bg-[#8B5CF6] text-white rounded-tr-none text-[11px]' 
                      : 'bg-[#1e2022] text-[#F5F5F5] rounded-tl-none text-[11px] border border-[#2c2d31]/55'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-neutral-300" />
                    </div>
                  )}
                </div>
              ))}

              {/* Simulated Loading Indicator */}
              {isLoading && (
                <div className="flex gap-2 text-xs justify-start items-center">
                  <div className="w-5 h-5 rounded-full bg-purple-900/60 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-purple-300 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#1e2022] border border-[#2c2d31]/55 rounded-lg px-2.5 py-1.5 text-[11px] text-[#9A9BA1]">
                    <span>Thinking</span>
                    <Loader2 className="w-3 h-3 animate-spin text-[#9A9BA1]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Input Bar */}
      <div className="flex items-center justify-between w-[400px] bg-[#1e2022] border border-[#2c2d31] rounded-full pl-4 pr-1.5 py-1.5 shadow-2xl z-20">
        <div className="flex items-center flex-1">
          <Sparkles className="w-3.5 h-3.5 text-[#9A9BA1] mr-2.5 shrink-0" />
          <input
            id="input-ai-command"
            type="text"
            placeholder="Ask AI to redraft clause 2..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-[#9A9BA1] focus:ring-0 focus:outline-none"
          />
        </div>
        <button
          id="btn-ai-command-send"
          type="button"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-150 shrink-0 ${
            input.trim() && !isLoading
              ? 'bg-[#8B5CF6] hover:bg-[#7c3aed] text-white cursor-pointer'
              : 'bg-[#25282a] text-[#9A9BA1] cursor-not-allowed'
          }`}
        >
          <Send className="w-3.5 h-3.5 -translate-x-[0.5px] translate-y-[0.5px] fill-current stroke-current" />
        </button>
      </div>
    </div>
  );
}
