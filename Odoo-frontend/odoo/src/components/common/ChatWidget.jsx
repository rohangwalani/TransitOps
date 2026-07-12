import React, { useState, useEffect, useRef } from 'react';
import { useTransitOps } from '../../hooks/TransitOpsContext';

// Paste your Mistral API Key here:
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || "YOUR_MISTRAL_API_KEY";

export const ChatWidget = () => {
  const { triggerToast } = useTransitOps();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your TransitOps Co-Pilot. I can help answer logistics questions, optimize dispatch tasks, and analyze your fleet's operations. Ask me anything!",
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const renderMessageContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('*');
      let cleanLine = line;
      if (isBullet) {
        cleanLine = line.trim().replace(/^[-*]\s+/, '');
      }

      // Parse bold **text**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const parsedText = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex gap-1.5 ml-3 my-0.5">
            <span className="text-primary font-bold">•</span>
            <div>{parsedText}</div>
          </div>
        );
      }

      return (
        <p key={idx} className={line.trim() === '' ? 'h-2' : 'my-0.5'}>
          {parsedText}
        </p>
      );
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    // Check if key is configured
    if (!MISTRAL_API_KEY || MISTRAL_API_KEY === 'YOUR_MISTRAL_API_KEY') {
      triggerToast('Mistral API Key is not configured in the code.', 'error');
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: inputVal },
        {
          role: 'assistant',
          content: '⚠️ Co-Pilot is not configured. Please define your Mistral API key in ChatWidget.jsx or set VITE_MISTRAL_API_KEY in your .env file.',
        },
      ]);
      setInputVal('');
      return;
    }

    const userMessage = { role: 'user', content: inputVal };
    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setLoading(true);

    try {
      // Build the message list for Mistral (System prompt first)
      const systemPrompt = {
        role: 'system',
        content: 'You are TransitOps Co-Pilot, a helpful AI logistics assistant built into the TransitOps dashboard. You help dispatchers and managers coordinate fleet operations, view diagnostics, optimize trips, and manage drivers. Keep your responses clear, helpful, professional, and concise.',
      };

      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'open-mistral-7b',
          messages: [systemPrompt, ...history],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Mistral error (${response.status})`);
      }

      const data = await response.json();
      const assistantText = data?.choices?.[0]?.message?.content || 'No response received from Co-Pilot.';

      setMessages((prev) => [...prev, { role: 'assistant', content: assistantText }]);
    } catch (err) {
      console.error(err);
      triggerToast('Failed to connect to Mistral AI: ' + err.message, 'error');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Error: I could not contact Mistral AI. Please verify that your API key is correct and you have an active internet connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-white border border-outline-variant rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-300">
          
          {/* Header */}
          <header className="bg-primary px-4 py-3 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">TransitOps Co-Pilot</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-[10px] opacity-80">AI Logistics Advisor</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </header>

          {/* Message Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-container-lowest custom-scrollbar">
            {messages.map((m, idx) => {
              const isUser = m.role === 'user';
              return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white rounded-tr-none'
                        : 'bg-surface-container border border-outline-variant/30 text-on-surface rounded-tl-none'
                    }`}
                  >
                    {renderMessageContent(m.content)}
                  </div>
                </div>
              );
            })}

            {/* Loading state / Bouncing Dots Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-none px-3.5 py-2.5 bg-surface-container border border-outline-variant/30 flex space-x-1 items-center">
                  <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-outline-variant flex gap-2 bg-white shrink-0">
            <input
              type="text"
              placeholder="Ask a logistics question..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="bg-primary text-white p-2 rounded-lg flex items-center justify-center shadow hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary hover:bg-primary/95 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all relative"
        title="Open TransitOps Co-Pilot"
      >
        <span className="material-symbols-outlined text-2xl select-none">
          {isOpen ? 'chat_bubble_outline' : 'chat_bubble'}
        </span>
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-secondary rounded-full ring-2 ring-white animate-ping"></span>
        )}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-secondary rounded-full ring-2 ring-white"></span>
        )}
      </button>
    </div>
  );
};
