"use client";

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import MessageBubble from './MessageBubble';
import OptionsSelector from './OptionsSelector';
import SettingsPanel from './SettingsPanel';
import InputArea from './InputArea';
const InteractiveTimeline = lazy(() => import('./InteractiveTimeline'));
import { getStateByName, getStateByAbbrev } from '@/data/stateData';
import ReactMarkdown from 'react-markdown';
import { insforge } from '@/lib/insforge';

type Message = {
  id: string;
  isUser: boolean;
  text?: string;
  type?: 'text' | 'options' | 'timeline' | 'checklist';
  options?: any[];
  events?: any[];
};

type ChatInterfaceProps = {
  initialAnswer?: string | null;
};

import { useChatSession } from '@/hooks/useChatSession';
import { useChatLogic } from '@/hooks/useChatLogic';

export default function ChatInterface({ initialAnswer }: ChatInterfaceProps) {
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('English');
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestOptionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const {
    messages,
    setMessages,
    step,
    setStep,
    userData,
    setUserData,
    isLoading,
    clearChat
  } = useChatSession(initialAnswer, scrollToBottom);

  // Focus trap for settings panel
  useEffect(() => {
    if (showSettings && settingsPanelRef.current) {
      const focusable = settingsPanelRef.current.querySelectorAll<HTMLElement>(
        'input, select, button, [tabindex]:not([tabindex="-1"])'
      );
      focusable[0]?.focus();
    } else if (!showSettings && settingsButtonRef.current) {
      settingsButtonRef.current.focus();
    }
  }, [showSettings]);

  const focusLatestOption = () => {
    setTimeout(() => {
      latestOptionRef.current?.focus();
    }, 100);
  };

  const { handleOptionSelect, handleGeneratePlan, handleUserInput } = useChatLogic({
    messages,
    setMessages,
    userData,
    setUserData,
    step,
    setStep,
    language,
    apiKey,
    modelName,
    setIsGeneratingResponse
  });

  const onUserInput = (e: React.FormEvent<HTMLFormElement>) => {
    handleUserInput(e, selectedFile, () => {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  return (
    <div className="flex flex-col h-full w-full glass-panel rounded-3xl overflow-hidden shadow-2xl relative border border-indigo-500/20">
      {/* Header & Settings */}
      <div className="px-6 py-3 border-b border-[var(--glass-border)] flex justify-between items-center bg-[var(--bg-secondary)] shrink-0">
        <div className="font-semibold text-indigo-400 flex items-center gap-2" role="heading" aria-level={2}>
          <span className="text-xl" aria-hidden="true">🗳️</span> Ballot Buddy
        </div>
        <button 
          ref={settingsButtonRef}
          onClick={() => setShowSettings(!showSettings)}
          aria-expanded={showSettings}
          aria-controls="settings-panel"
          aria-label={showSettings ? 'Close settings' : 'Open settings'}
          className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Settings
        </button>
      </div>

      {showSettings && (
        <SettingsPanel
          settingsPanelRef={settingsPanelRef}
          apiKey={apiKey}
          setApiKey={setApiKey}
          modelName={modelName}
          setModelName={setModelName}
          clearChat={clearChat}
        />
      )}

      <div
        className="flex-1 overflow-y-auto p-6 scroll-smooth"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-busy={isGeneratingResponse}
      >
        {isLoading && (
          <div className="flex flex-col gap-3 my-4">
            <div className="bg-[var(--bg-accent)] p-4 rounded-2xl rounded-tl-sm w-4/5 animate-pulse">
              <div className="h-4 bg-[var(--glass-border)] rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-[var(--glass-border)] rounded w-1/2"></div>
            </div>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={msg.id} ref={index === messages.length - 1 && msg.type === 'options' ? latestOptionRef : null}>
            {msg.type === 'text' && (
              <div className={`flex flex-col gap-1 mb-4 ${msg.isUser ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl max-w-[85%] prose prose-sm dark:prose-invert max-w-none ${
                  msg.isUser 
                    ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md' 
                    : 'bg-[var(--bg-accent)] text-[var(--text-primary)] rounded-tl-sm border border-[var(--glass-border)] shadow-sm'
                }`}>
                  <ReactMarkdown>{msg.text || ''}</ReactMarkdown>
                </div>
              </div>
            )}
            {msg.type === 'options' && msg.options && (
              <OptionsSelector options={msg.options} onSelect={(id) => handleOptionSelect(id, msg.options!.find(o => o.id === id)?.label || id)} />
            )}
            {msg.type === 'timeline' && msg.events && (
              <Suspense fallback={<div className="h-24 animate-pulse bg-white/5 rounded-xl" />}>
                <InteractiveTimeline events={msg.events} />
              </Suspense>
            )}
          </div>
        ))}
        {isGeneratingResponse && (
          <div className="flex flex-col gap-3 my-4">
             <div className="bg-[var(--bg-accent)] p-4 rounded-2xl rounded-tl-sm w-max">
                 <div className="flex space-x-2">
                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                 </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Action Bar (Optional, e.g., for Plan) */}
      {step === 'mainMenu' && (
        <div className="px-4 py-2 border-t border-[var(--glass-border)] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Language</span>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[var(--bg-accent)] text-[var(--text-primary)] border border-[var(--glass-border)] rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="English">🇺🇸 English</option>
              <option value="Spanish">🇪🇸 Spanish</option>
              <option value="Mandarin">🇨🇳 Mandarin</option>
              <option value="Tagalog">🇵🇭 Tagalog</option>
              <option value="Hindi">🇮🇳 Hindi</option>
              <option value="Bengali">🇮🇳 Bengali</option>
            </select>
          </div>
          <button 
            onClick={handleGeneratePlan}
            disabled={isGeneratingResponse}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            Generate My Voting Plan
          </button>
        </div>
      )}

      {/* Input Area */}
      <InputArea
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        fileInputRef={fileInputRef}
        handleUserInput={onUserInput}
      />
    </div>
  );
}
