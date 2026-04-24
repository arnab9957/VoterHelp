"use client";

import { useState, useRef, useEffect } from 'react';

type SearchResult = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const searchableFAQs: SearchResult[] = [
  { id: '1', question: 'How do I register to vote?', answer: 'You can register online, by mail, or in person at your local DMV, election office, or public library. Many states offer online registration at vote.gov.', category: 'Registration' },
  { id: '2', question: 'What ID do I need to vote?', answer: 'Requirements vary by state. Some states require photo ID (strict), others accept non-photo ID or affidavits (non-strict). Check your state requirements.', category: 'ID Requirements' },
  { id: '3', question: 'When is the registration deadline?', answer: 'Most states require registration 15-30 days before the election. Some states allow same-day registration.', category: 'Deadlines' },
  { id: '4', question: 'Can I vote early?', answer: 'Early voting is available in most states. Dates vary by jurisdiction - typically 10-45 days before the election.', category: 'Early Voting' },
  { id: '5', question: 'How do I request an absentee ballot?', answer: 'Request through your state election website or by contacting your local election office. Deadlines vary by state.', category: 'Absentee' },
  { id: '6', question: 'What is UOCAVA?', answer: 'Uniformed and Overseas Citizens Absentee Voting Act - protects military personnel and overseas citizens to vote by mail.', category: 'Military' },
  { id: '7', question: 'Where is my polling place?', answer: 'Check your state election website or use Vote.org\'s polling place locator.', category: 'Locator' },
  { id: '8', question: 'Can I change my vote?', answer: 'Once submitted, your ballot cannot be changed. If you made a mistake, contact your election office for options.', category: 'General' },
  { id: '9', question: 'What is a provisional ballot?', answer: 'Used when voter eligibility cannot be verified. It is counted after verification by your election office.', category: 'Provisional' },
  { id: '10', question: 'How do I check my registration status?', answer: 'Visit your state election website or use Vote.org to verify your registration.', category: 'Registration' },
];

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
};

export default function SearchModal({ isOpen, onClose, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        const q = query.toLowerCase();
        // Keep static results for quick access
        const filtered = searchableFAQs.filter(
          faq => faq.question.toLowerCase().includes(q) || 
                 faq.answer.toLowerCase().includes(q) ||
                 faq.category.toLowerCase().includes(q)
        );
        
        try {
          // Augment with AI if no direct match or just to provide a dynamic answer
          const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          });
          const data = await res.json();
          
          if (!data.error && data.answer) {
             setResults([
                { id: 'ai-result', question: query, answer: data.answer, category: 'AI Assistant' },
                ...filtered.slice(0, 4)
             ]);
          } else {
             setResults(filtered.slice(0, 5));
          }
        } catch (e) {
          setResults(filtered.slice(0, 5));
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setIsSearching(false);
      }
    }, 600); // Debounce

    return () => clearTimeout(searchTimeout);
  }, [query]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Search FAQs"
    >
      <div className="glass-panel w-full max-w-lg mx-4 rounded-2xl overflow-hidden animate-fade-in-up">
        <div className="p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search common questions..."
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-gray-500 focus:outline-none text-lg"
            />
            <button 
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
              aria-label="Close search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  onClick={() => {
                    onSelect(result);
                    onClose();
                    setQuery('');
                  }}
                  className="w-full p-4 text-left hover:bg-[var(--bg-accent)] transition-colors border-b border-[var(--glass-border)] last:border-b-0"
                >
                  <span className="text-xs text-indigo-400 uppercase tracking-wider">{result.category}</span>
                  <p className="text-[var(--text-primary)] font-medium mt-1">{result.question}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {query.length >= 2 && results.length === 0 && !isSearching && (
          <div className="p-8 text-center text-[var(--text-secondary)]">
            No results found for "{query}"
          </div>
        )}
        
        {isSearching && (
          <div className="p-8 flex justify-center items-center">
            <div className="flex space-x-2">
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        {query.length < 2 && (
          <div className="p-4 text-sm text-[var(--text-secondary)]">
            Type to search common voter questions
          </div>
        )}
      </div>
    </div>
  );
}

export function useSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return {
    isSearchOpen,
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),
  };
}