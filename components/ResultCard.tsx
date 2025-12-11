import React from 'react';
import { GreetingResult } from '../types';
import { LucideCopy, LucideCheck, LucideQuote, LucideInfo } from 'lucide-react';

interface ResultCardProps {
  result: GreetingResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.greeting);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-indigo-200/50 border border-slate-100 transform transition-all duration-500 hover:shadow-indigo-300/50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-1"></div>
      
      <div className="p-8">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            {result.language}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
            {result.style} Style
          </span>
        </div>

        {/* Main Greeting */}
        <div className="relative group mb-8">
          <LucideQuote className="absolute -top-4 -left-4 w-8 h-8 text-slate-100 -z-10 transform -scale-x-100" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {result.greeting}
          </h2>
          <button
            onClick={handleCopy}
            className="absolute top-1/2 -right-12 -translate-y-1/2 p-2 text-slate-300 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
            title="Copy to clipboard"
          >
            {copied ? <LucideCheck className="w-5 h-5 text-green-500" /> : <LucideCopy className="w-5 h-5" />}
          </button>
        </div>

        {/* Explanation */}
        <div className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
          <LucideInfo className="w-5 h-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-slate-600 text-sm leading-relaxed">
            {result.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};