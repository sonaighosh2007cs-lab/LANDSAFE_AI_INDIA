import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  Bot,
  Sparkles,
  Send,
  User,
  Shield,
  Compass,
  AlertTriangle,
  RotateCcw,
  Cpu,
  Layers,
  HelpCircle,
  Trash2,
  Globe,
  Wind,
  Droplets,
  Activity,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiAgentPage: React.FC = () => {
  const {
    userProfile,
    telemetry,
    riskScore,
    riskLevel,
    chatMessages,
    sendAiMessage,
    clearChatMessages,
    isAiTyping,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  const activeArea = userProfile.location?.area || 'Your Area';
  const activeDistrict = userProfile.location?.district || 'District';
  const activeState = userProfile.location?.state || 'India';

  const suggestedQuestions = [
    {
      title: `Why is risk ${riskLevel} in ${activeArea}?`,
      query: `Why is the landslide risk calculated as ${riskLevel} (${riskScore}/100) in ${activeArea}, ${activeDistrict}?`,
    },
    {
      title: 'Live Weather & Soil Saturation',
      query: `Provide a live weather and soil moisture report for ${activeArea} with rainfall threshold analysis.`,
    },
    {
      title: 'Safe Corridors & Road Closures',
      query: `Which highways and evacuation corridors are currently safe to travel around ${activeDistrict}?`,
    },
    {
      title: 'Recent Indian Disaster Updates',
      query: `What are the latest natural disaster alerts or events reported across India today?`,
    },
  ];

  const languageChips = [
    { label: 'English', text: `What is the current landslide safety status in ${activeArea}?` },
    { label: 'বাংলা (Bengali)', text: `${activeArea} এলাকায় কি এখন ভূমিধসের কোনো ঝুঁকি আছে?` },
    { label: 'हिन्दी (Hindi)', text: `क्या ${activeArea} में अभी भूस्खलन का कोई खतरा है?` },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isAiTyping) return;
    sendAiMessage(inputVal);
    setInputVal('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="border-b border-[#14263c] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#00d492]" />
            LandSafe AI Disaster Risk Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time context-aware intelligence for landslide, flood, and extreme weather risks across India.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChatMessages}
            title="Clear Chat History"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b1b2d] border border-[#1c385c] hover:border-red-500/50 hover:text-red-400 text-slate-400 text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Data Bridge Active
          </span>
        </div>
      </div>

      {/* Live Context Telemetry Strip */}
      <div className="p-3 rounded-xl bg-[#091626] border border-[#162f4e] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">
            Active Monitored Sector: <strong className="text-white font-bold">{activeArea}</strong>, {activeDistrict} ({activeState})
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="px-2.5 py-0.5 rounded-md bg-[#0d2238] text-slate-300 border border-[#1b3e64]">
            Risk: <strong className={riskScore > 65 ? 'text-rose-400' : riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'}>{riskScore}/100 ({riskLevel})</strong>
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-[#0d2238] text-slate-300 border border-[#1b3e64] flex items-center gap-1">
            <Droplets className="w-3 h-3 text-sky-400" />
            Rain: {telemetry.precipitation.value} mm
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-[#0d2238] text-slate-300 border border-[#1b3e64] flex items-center gap-1">
            <Activity className="w-3 h-3 text-teal-400" />
            Saturation: {telemetry.soilMoisture.value}%
          </span>
        </div>
      </div>

      {/* Suggested Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {suggestedQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => sendAiMessage(sq.query)}
            className="p-3.5 rounded-xl bg-[#091626] border border-[#182f4d] hover:border-emerald-500/60 hover:bg-[#0c1e33] text-left transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                Context Prompt #{idx + 1}
              </span>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                {sq.title}
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-mono">
              <span>Ask assistant</span> →
            </span>
          </button>
        ))}
      </div>

      {/* Multilingual Quick Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Globe className="w-3 h-3 text-emerald-400" />
          Ask in:
        </span>
        {languageChips.map((chip, i) => (
          <button
            key={i}
            onClick={() => sendAiMessage(chip.text)}
            className="text-[11px] px-3 py-1 rounded-full bg-[#081524] border border-[#183454] hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px]">
        {/* Chat Header Bar */}
        <div className="p-3.5 border-b border-[#14263c] bg-[#07111e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                LandSafe AI Assistant • {activeArea}, {activeDistrict}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Multilingual Support: English • বাংলা • हिन्दी | Connected to IMD & GSI Mesh
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
            Real-time Telemetry Synced
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {chatMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[#00d492] shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#009e60] text-white rounded-br-none shadow-md font-medium'
                      : 'bg-[#060e19] border border-[#152a42] text-slate-200 rounded-bl-none shadow-lg'
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-line">{msg.content}</div>
                  ) : (
                    <div className="chat-markdown-body space-y-2">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  )}
                  <div
                    className={`text-[9px] font-mono mt-2 pt-1 border-t ${
                      isUser ? 'border-white/20 text-emerald-100' : 'border-white/5 text-slate-400'
                    }`}
                  >
                    {msg.timestamp} {msg.source ? `• [${msg.source}]` : ''}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isAiTyping && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[#00d492] shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-[#060e19] border border-[#152a42] rounded-2xl rounded-bl-none text-xs text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Synthesizing live sensor mesh, weather telemetry & disaster records...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Box */}
        <div className="p-4 border-t border-[#14263c] bg-[#07111e]">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Ask about ${activeArea} landslide risk, rainfall, safe roads, or disaster news (English / বাংলা / हिन्दी)...`}
              className="flex-1 bg-[#091626] border border-[#1c385c] focus:border-[#00d492] focus:ring-1 focus:ring-[#00d492] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isAiTyping}
              className="px-5 py-3 rounded-xl bg-[#009e60] hover:bg-[#00b870] disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

