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
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm my-4">
      {options.map((option, index) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className="glass-panel glass-panel-hover flex items-center justify-between p-4 rounded-xl text-left border border-white/10 text-white/90 hover:text-white group transition-all"
        >
          <span className="flex items-center gap-3">
            {option.icon && <span className="text-xl">{option.icon}</span>}
            <span className="font-medium group-hover:gradient-text">{option.label}</span>
          </span>
          <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>
  );
}
