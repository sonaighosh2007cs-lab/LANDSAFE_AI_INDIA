import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Minimize2,
  Maximize2,
  HelpCircle,
  ShieldAlert,
  Compass,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FloatingAiAgent: React.FC = () => {
  const {
    isAiAgentOpen,
    setIsAiAgentOpen,
    chatMessages,
    sendAiMessage,
    isAiTyping,
    userProfile,
    setActiveRoute,
  } = useApp();

  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    `Is ${userProfile.location.area} safe today?`,
    'Calculate slope factor of safety',
    'Show nearest SDRF emergency shelters',
    'What is the threshold rainfall for landslide?',
  ];

  const handleSend = (text: string) => {
    if (!text.trim() || isAiTyping) return;
    sendAiMessage(text);
    setInputVal('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Minimized Pill Button */}
      {!isAiAgentOpen && (
        <button
          id="floating-ai-agent-btn"
          onClick={() => setIsAiAgentOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-semibold text-xs shadow-xl shadow-emerald-950/70 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/40 group"
        >
          <div className="w-6 h-6 rounded-full bg-[#050b14]/50 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-emerald-200 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-bold tracking-wide">LandSafe AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping inline-block" />
        </button>
      )}

      {/* Expanded Mini Bot Dialog */}
      {isAiAgentOpen && (
        <div className="w-[360px] sm:w-[420px] h-[520px] bg-[#081322] border border-[#1b385a] rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3.5 border-b border-[#142942] bg-[#060e19] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center text-[#00d492]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  LandSafe AI Agent
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    ONLINE
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  {userProfile.location.district} Geotechnical Stream
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setActiveRoute('ai-agent');
                  setIsAiAgentOpen(false);
                }}
                title="Open full page AI Assistant"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#0d2238] cursor-pointer text-[10px] font-mono flex items-center gap-1 px-2 border border-slate-700"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Full View</span>
              </button>
              <button
                onClick={() => setIsAiAgentOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#0d2238] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#009e60] text-white rounded-br-none shadow-md'
                      : 'bg-[#0b1b2d] border border-[#19395d] text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">
                  {msg.timestamp} {msg.source ? `• ${msg.source}` : ''}
                </span>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex items-center gap-2 p-3 bg-[#0b1b2d] border border-[#19395d] rounded-2xl rounded-bl-none text-xs text-slate-300 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Analyzing GSI & IMD radar data...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-1.5 bg-[#060e19] border-t border-[#12243a] flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.slice(0, 3).map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-[#0a1829] border border-[#162f4e] hover:border-emerald-500/50 text-slate-300 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 border-t border-[#142942] bg-[#07111e]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask LandSafe AI geotechnical assistant..."
                className="flex-1 bg-[#091626] border border-[#1c385c] focus:border-[#00d492] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isAiTyping}
                className="p-2 rounded-xl bg-[#009e60] hover:bg-[#00b870] disabled:opacity-40 text-white transition-all cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
