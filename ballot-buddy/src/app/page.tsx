
"use client";

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import EssentialInfo from '@/components/EssentialInfo';
import SearchModal, { useSearch } from '@/components/SearchModal';
import ThemeToggle from '@/components/ThemeToggle';

type SearchResult = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-40 glass-panel p-3 rounded-full hover:bg-[var(--bg-accent)] transition-all group shadow-lg"
      aria-label="Search common questions"
      title="Search FAQ"
    >
      <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );
}

export default function Home() {
  const { isSearchOpen, openSearch, closeSearch } = useSearch();
  const [lastSearchResult, setLastSearchResult] = useState<SearchResult | null>(null);

  const handleSearchSelect = (result: SearchResult) => {
    setLastSearchResult(result);
  };

  return (
    <main className="min-h-screen bg-transparent p-4 md:p-8 flex flex-col items-center">
      <SearchButton onClick={openSearch} />
      <ThemeToggle />
      
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={closeSearch} 
        onSelect={handleSearchSelect}
      />

      {/* Header Area */}
      <header className="w-full max-w-7xl flex flex-col items-center justify-center animate-fade-in-up mt-4 md:mt-6 lg:mt-8 mb-6 lg:mb-8">
        <div className="glass-panel px-4 sm:px-6 py-2 rounded-full mb-3 sm:mb-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <span className="text-indigo-400 font-semibold tracking-widest text-xs sm:text-sm uppercase">Federal Election Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 tracking-tight">
          Meet <span className="gradient-text">Ballot Buddy</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-center max-w-2xl text-base sm:text-lg px-4 relative z-10">
          Your personal, non-partisan guide through the election process. We provide accurate timelines, step-by-step guidance, and checklists tailored to your location.
        </p>
      </header>
      
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-cover bg-center bg-no-repeat transition-opacity duration-700 dark:opacity-30"
        style={{ backgroundImage: "url('/voting-background.png')" }}
      ></div>

      {/* Background glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-10 items-start">
        {/* Main Chat Interface (Takes up 7 cols on large screens) */}
        <div className="lg:col-span-7 h-[600px] lg:h-[calc(100vh-280px)] min-h-[500px] w-full">
          <ChatInterface initialAnswer={lastSearchResult?.answer} />
        </div>
        
        {/* Essential Info Sidebar (Takes up 5 cols) */}
        <div className="lg:col-span-5 w-full">
          <EssentialInfo />
        </div>
      </div>
    </main>
  );
}
