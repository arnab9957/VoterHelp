import React from 'react';

type InputAreaProps = {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleUserInput: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function InputArea({
  selectedFile,
  setSelectedFile,
  fileInputRef,
  handleUserInput
}: InputAreaProps) {
  return (
    <div className="p-3 sm:p-4 bg-[var(--bg-secondary)] border-t border-[var(--glass-border)] shrink-0" role="form" aria-label="Type your message">
      {selectedFile && (
        <div className="mb-2 flex items-center justify-between bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg text-sm w-fit">
          <span className="truncate max-w-[200px]">📎 {selectedFile.name}</span>
          <button 
            type="button" 
            onClick={() => { setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
            className="ml-2 hover:text-indigo-100"
          >
            ✕
          </button>
        </div>
      )}
      <form onSubmit={handleUserInput} className="flex gap-2 sm:gap-4 items-center">
        <label className="sr-only" htmlFor="user-input">Type your response</label>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setSelectedFile(e.target.files[0]);
            }
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 sm:p-4 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl transition-all"
          title="Upload Document"
          aria-label="Upload a document or image for analysis"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21"/><path d="M16 16l-4-4-4 4"/></svg>
        </button>
        <input
          id="user-input"
          type="text"
          name="userInput"
          placeholder={selectedFile ? "Ask about this document..." : "Type your response here..."}
          className="flex-1 bg-[var(--bg-accent)] text-[var(--text-primary)] p-3 sm:p-4 rounded-xl border border-[var(--glass-border)] focus:outline-none focus:border-[var(--accent-glow)] focus:ring-1 focus:ring-[var(--accent-glow)] transition-all font-medium placeholder-gray-500 text-base"
          autoComplete="off"
          suppressHydrationWarning
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 flex items-center justify-center"
          suppressHydrationWarning
          aria-label="Send message"
        >
           <span className="hidden sm:inline">Send</span>
           <span className="sm:hidden">➤</span>
        </button>
      </form>
    </div>
  );
}
