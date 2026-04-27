import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Terminal } from 'lucide-react';

const AICommand = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Greetings, Commander. Cablo Brain is online. Multi-shard database synchronized. How can I assist you with platform governance today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input) return;
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI thinking
    setTimeout(() => {
      setMessages([...newMessages, { role: 'ai', text: `Analyzing "${input}"... Action logged. I am monitoring the 1,240 active captains. No anomalies detected in current revenue streams.` }]);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col p-8 bg-[#0f172a]">
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20">
            <Bot className="text-slate-900" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Cablo AI Brain</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Neural Link</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 font-bold">
            Model: GPT-4o Optimized (Cablo-v2)
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 mb-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'ai' ? 'bg-amber-500 text-slate-900' : 'bg-blue-500 text-white'}`}>
                {m.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`p-4 rounded-2xl ${m.role === 'ai' ? 'bg-slate-800 text-white rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20'}`}>
                <p className="text-sm font-medium leading-relaxed">{m.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="relative">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Issue a command to the Cablo AI (e.g., 'Generate revenue report for Bihar', 'Check captain anomalies')..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 pl-6 pr-20 text-white placeholder-slate-600 outline-none focus:border-amber-500 transition-all font-medium"
        />
        <button 
          onClick={handleSend}
          className="absolute right-3 top-3 bottom-3 px-6 bg-amber-500 text-slate-900 rounded-xl font-black hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-2"
        >
          <Send size={18} />
          EXECUTE
        </button>
      </div>
    </div>
  );
};

export default AICommand;
