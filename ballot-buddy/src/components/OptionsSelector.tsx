import React from 'react';

type Option = {
  id: string;
  label: string;
  icon?: string;
};

type OptionsSelectorProps = {
  options: Option[];
  onSelect: (id: string) => void;
};

export default function OptionsSelector({ options, onSelect }: OptionsSelectorProps) {
  const handleKeyDown = (e: React.KeyboardEvent, optionId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(optionId);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm my-4" role="listbox" aria-label="Select an option">
      {options.map((option, index) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          onKeyDown={(e) => handleKeyDown(e, option.id)}
          className="glass-panel glass-panel-hover flex items-center justify-between p-4 rounded-xl text-left border border-[var(--glass-border)] text-[var(--text-primary)] hover:text-[var(--text-primary)] group transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
          role="option"
          aria-selected={false}
          tabIndex={0}
        >
          <span className="flex items-center gap-3">
            {option.icon && <span className="text-xl" aria-hidden="true">{option.icon}</span>}
            <span className="font-medium group-hover:gradient-text text-[var(--text-primary)]">{option.label}</span>
          </span>
          <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>
  );
}
