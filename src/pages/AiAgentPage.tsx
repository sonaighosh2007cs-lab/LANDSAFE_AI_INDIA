import React, { useState } from 'react';
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
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiAgentPage: React.FC = () => {
  const { userProfile, telemetry, riskScore, chatMessages, sendAiMessage, isAiTyping } = useApp();

  const [inputVal, setInputVal] = useState('');

  const suggestedQuestions = [
    {
      title: `Analyze Slope Stability in ${userProfile.location.district}`,
      query: `Provide a detailed geotechnical stability analysis for ${userProfile.location.area}, ${userProfile.location.district} given current 14.5° slope and ${telemetry.precipitation.value}mm precipitation.`,
    },
    {
      title: 'Emergency Evacuation & Nearest Shelters',
      query: `List designated SDRF evacuation camps and emergency helplines for ${userProfile.location.district}.`,
    },
    {
      title: 'Explain Pore-Water Pressure & FoS',
      query: `How does the current pore pressure (${telemetry.groundCondition.value} kPa) affect the geotechnical Factor of Safety on hillside roads?`,
    },
    {
      title: 'Monsoon Trigger Warning Threshold',
      query: `What is the cumulative 24-hour rainfall threshold for debris flow initiation in ${userProfile.location.state}?`,
    },
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
      <div className="border-b border-[#14263c] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#00d492]" />
            LandSafe AI Geotechnical Assistant & Command Bot
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Powered by Deep Geotechnical Knowledge Bases, GSI hazard archives, and live IoT telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            ● Gemini 3.7 Flash Engine Online
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
                Prompt #{idx + 1}
              </span>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                {sq.title}
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-mono">
              <span>Execute query</span> →
            </span>
          </button>
        ))}
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl shadow-xl overflow-hidden flex flex-col h-[580px]">
        {/* Chat Header Bar */}
        <div className="p-3.5 border-b border-[#14263c] bg-[#07111e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Live Geotechnical Command • {userProfile.location.district}, {userProfile.location.state}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Risk Index: {riskScore}% • Saturation: {telemetry.soilMoisture.value}% • Incline: {telemetry.slopeAngle.value}°
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Real-time Sensor Stream Connected
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
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#009e60] text-white rounded-br-none shadow-md font-medium'
                      : 'bg-[#060e19] border border-[#152a42] text-slate-200 rounded-bl-none shadow-lg'
                  }`}
                >
                  <div className="whitespace-pre-line prose-invert">{msg.content}</div>
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
                <span>Generating geotechnical synthesis from telemetry feeds...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Box */}
        <div className="p-4 border-t border-[#14263c] bg-[#07111e]">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about slope stability, rainfall thresholds, safe corridors, or relief shelters..."
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
