import React from 'react';

type MessageBubbleProps = {
  text: string;
  isUser: boolean;
  animate?: boolean;
};

export default function MessageBubble({ text, isUser, animate = true }: MessageBubbleProps) {
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[75%] p-4 rounded-2xl ${animate ? 'animate-fade-in-up' : ''} ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'glass-panel text-[var(--text-primary)] rounded-bl-sm'
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}
