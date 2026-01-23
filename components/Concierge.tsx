import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, MessageSquare } from 'lucide-react';
import { getConciergeRecommendation } from '../services/geminiService';

const Concierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Bienvenido a Soberano. Soy su concierge personal. ¿Busca un reloj para una ocasión especial o quizás una fragancia distintiva?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getConciergeRecommendation(userMsg);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gold-500 hover:bg-gold-600 text-black p-4 rounded-full shadow-lg shadow-gold-500/20 transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="font-serif font-bold hidden md:inline">Soberano AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-96 h-[500px] bg-dark-800 border border-gold-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-900 to-dark-800 p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="text-gold-400" size={20} />
          <h3 className="font-serif text-white font-semibold">Concierge Virtual</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-gold-500/20 text-gold-100 border border-gold-500/20' 
                : 'bg-stone-800 text-stone-200 border border-stone-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-800 text-stone-400 p-3 rounded-lg text-xs italic animate-pulse">
              Consultando inventario...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-dark-900 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escriba su consulta..."
            className="flex-1 bg-stone-900 border border-stone-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-gold-500 hover:bg-gold-600 text-black p-2 rounded-md disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Concierge;