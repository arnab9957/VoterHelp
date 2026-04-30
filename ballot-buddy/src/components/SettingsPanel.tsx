import React from 'react';

type SettingsPanelProps = {
  settingsPanelRef: React.RefObject<HTMLDivElement | null>;
  apiKey: string;
  setApiKey: (key: string) => void;
  modelName: string;
  setModelName: (name: string) => void;
  clearChat: () => void;
};

export default function SettingsPanel({
  settingsPanelRef,
  apiKey,
  setApiKey,
  modelName,
  setModelName,
  clearChat
}: SettingsPanelProps) {
  return (
    <div
      id="settings-panel"
      ref={settingsPanelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Ballot Buddy settings"
      className="px-6 py-4 bg-[var(--bg-accent)] border-b border-[var(--glass-border)] flex flex-col gap-3 shrink-0"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 w-full">
          <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1">API Key</label>
          <input 
            type="password" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Leave blank to use default key"
            className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--glass-border)] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1">Model</label>
          <select 
            value={modelName} 
            onChange={(e) => setModelName(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--glass-border)] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast)</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro (Powerful)</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end pt-2 border-t border-[var(--glass-border)] mt-2">
        <button 
          onClick={clearChat}
          className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Clear Chat History
        </button>
      </div>
    </div>
  );
}
