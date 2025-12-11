import React, { useState } from 'react';
import { LucideSend, LucideWand2 } from 'lucide-react';

interface GeneratorFormProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onGenerate(input || "Surprise me with a unique Hello World");
    }
  };

  const suggestions = [
    "In Japanese",
    "Like a Pirate",
    "In Binary Code",
    "Like Shakespeare",
    "Cyberpunk style"
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100">
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="prompt" className="block text-sm font-semibold text-slate-700 mb-2">
          How should we say "Hello World"?
        </label>
        <div className="relative flex items-center">
          <input
            id="prompt"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., In French, Like a robot, Joyful..."
            className="w-full pl-4 pr-14 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`absolute right-2 p-2 rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LucideSend className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Try these</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setInput(s);
                onGenerate(s);
              }}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
            >
              <LucideWand2 className="w-3 h-3 mr-1.5 opacity-50" />
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};