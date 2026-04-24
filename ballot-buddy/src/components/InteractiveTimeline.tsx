import React from 'react';

type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  isActive?: boolean;
};

type InteractiveTimelineProps = {
  events: TimelineEvent[];
};

export default function InteractiveTimeline({ events }: InteractiveTimelineProps) {
  return (
    <div className="relative pl-6 my-6 border-l-2 border-indigo-500/30">
      {events.map((event, index) => (
        <div 
          key={event.id} 
          className={`mb-8 relative ${event.isActive ? 'opacity-100' : 'opacity-60'} transition-opacity duration-300`}
        >
          {/* Timeline Dot */}
          <div className={`absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-indigo-400 bg-[var(--bg-secondary)] ${event.isActive ? 'animate-pulse-glow bg-indigo-500' : ''}`} />
          
          <div className={`glass-panel p-4 rounded-xl ${event.isActive ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : ''}`}>
            <span className="text-xs font-semibold text-indigo-400 mb-1 block tracking-wider uppercase">{event.date}</span>
            <h4 className="text-lg font-medium text-[var(--text-primary)] mb-2">{event.title}</h4>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
