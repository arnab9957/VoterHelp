import React from 'react';

type TimelineEvent = {
  id?: string;
  date: string;
  title: string;
  description: string;
  isActive?: boolean;
};

type InteractiveTimelineProps = {
  events: TimelineEvent[];
};

export default function InteractiveTimeline({ events }: InteractiveTimelineProps) {
  const handleExportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Ballot Buddy//Voting Plan//EN\n";
    
    events.forEach(event => {
      let dateObj = new Date(event.date);
      if (isNaN(dateObj.getTime())) {
        dateObj = new Date();
      }
      
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      
      const dtStart = `${year}${month}${day}T090000Z`;
      const dtEnd = `${year}${month}${day}T100000Z`;
      
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `DTSTART:${dtStart}\n`;
      icsContent += `DTEND:${dtEnd}\n`;
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DESCRIPTION:${event.description}\n`;
      icsContent += "END:VEVENT\n";
    });
    
    icsContent += "END:VCALENDAR";
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'voting_plan.ics';
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>My Voting Plan</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1f2937; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            h1 { color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 30px; }
            .event { margin-bottom: 24px; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #4f46e5; }
            .date { font-weight: 600; color: #6b7280; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
            .title { font-size: 1.25rem; font-weight: 700; margin: 8px 0; color: #111827; }
            .desc { margin: 0; color: #4b5563; }
            @media print { body { padding: 0; } .event { break-inside: avoid; border: 1px solid #e5e7eb; border-left: 4px solid #4f46e5; } }
          </style>
        </head>
        <body>
          <h1>My Voting Plan - Ballot Buddy</h1>
          ${events.map(e => `
            <div class="event">
              <div class="date">${e.date}</div>
              <div class="title">${e.title}</div>
              <div class="desc">${e.description}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div id="timeline-container" className="my-6">
      <div className="flex gap-2 mb-4">
        <button 
          onClick={handleExportICS}
          className="text-xs font-medium bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          📅 Export to Calendar (.ics)
        </button>
        <button 
          onClick={handlePrint}
          className="text-xs font-medium bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          📄 Download as PDF / Print
        </button>
      </div>
      <div className="relative pl-6 border-l-2 border-indigo-500/30">
        {events.map((event, index) => (
          <div 
            key={event.id || index} 
            className={`mb-8 relative ${event.isActive === false ? 'opacity-60' : 'opacity-100'} transition-opacity duration-300`}
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-indigo-400 bg-[var(--bg-secondary)] ${event.isActive !== false ? 'animate-pulse-glow bg-indigo-500' : ''}`} />
            
            <div className={`glass-panel p-4 rounded-xl ${event.isActive !== false ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : ''}`}>
              <span className="text-xs font-semibold text-indigo-400 mb-1 block tracking-wider uppercase">{event.date}</span>
              <h4 className="text-lg font-medium text-[var(--text-primary)] mb-2">{event.title}</h4>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
