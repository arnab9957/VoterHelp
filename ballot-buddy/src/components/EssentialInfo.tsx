import React, { useState, useEffect } from 'react';

export default function EssentialInfo() {
  const [location, setLocation] = useState('');

  useEffect(() => {
    const checkLoc = () => {
      const data = localStorage.getItem('ballotBuddyUserData');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.location !== location) {
            setLocation(parsed.location || '');
          }
        } catch(e){}
      } else {
        if (location !== '') setLocation('');
      }
    };
    checkLoc();
    window.addEventListener('storage', checkLoc);
    const interval = setInterval(checkLoc, 1000);
    return () => { window.removeEventListener('storage', checkLoc); clearInterval(interval); };
  }, [location]);

  const isIndia = location.toLowerCase().includes('india');

  const essentials = isIndia ? [
    {
      title: "Voter Eligibility",
      icon: "👤",
      details: [
        "Indian Citizen",
        "At least 18 years old",
        "Registered in electoral roll"
      ]
    },
    {
      title: "Ways to Vote",
      icon: "🗳️",
      details: [
        "Electronic Voting Machines (EVMs)",
        "Postal Ballot (if eligible)",
        "Service Voters"
      ]
    },
    {
      title: "What to Bring",
      icon: "🪪",
      details: [
        "Voter ID Card (EPIC)",
        "Alternative authorized photo ID",
        "Voter Slip"
      ]
    },
    {
      title: "Key Deadlines",
      icon: "⏰",
      details: [
        "Registration: Closes before elections",
        "Check name in electoral roll early",
        "Election dates announced by ECI"
      ]
    }
  ] : [
    {
      title: "Voter Eligibility",
      icon: "👤",
      details: [
        "U.S. Citizen",
        "At least 18 years old by Election Day",
        "Meet state residency requirements"
      ]
    },
    {
      title: "Ways to Vote",
      icon: "🗳️",
      details: [
        "In-Person on Election Day",
        "Early Voting (Dates vary by state)",
        "Absentee / Mail-in Ballot"
      ]
    },
    {
      title: "What to Bring",
      icon: "🪪",
      details: [
        "Government-issued Photo ID (in Strict states)",
        "Utility bill or bank statement (in Non-Strict states)",
        "Check your specific state requirements"
      ]
    },
    {
      title: "Key Deadlines",
      icon: "⏰",
      details: [
        "Registration: Often 15-30 days before",
        "Mail Ballot Request: Varies, check early",
        "General Election: First Tuesday after Nov 1"
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full h-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="glass-panel p-6 rounded-3xl border-indigo-500/20 bg-gradient-to-br from-[var(--glass-bg)] to-indigo-900/10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">📋</span> 
          <span>Voting Fundamentals</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {essentials.map((item, index) => (
            <div key={index} className="bg-[var(--bg-secondary)]/50 p-5 rounded-2xl hover:border-indigo-500/50 transition-colors border border-[var(--glass-border)] group">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-xl bg-[var(--bg-accent)] p-2 rounded-xl border border-[var(--glass-border)] group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg text-[var(--text-primary)]">{item.title}</h3>
              </div>
              <ul className="space-y-2">
                {item.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span className="leading-snug">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Links Card */}
      <div className="glass-panel p-6 rounded-3xl bg-indigo-900/10 border-indigo-500/20">
        <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-4 text-indigo-300 flex items-center gap-2">
          <span>🔗</span> Essential Resources
        </h3>
        {isIndia ? (
          <div className="flex flex-wrap gap-3">
            <a href="https://eci.gov.in" target="_blank" rel="noreferrer" className="flex-1 min-w-[120px] text-center px-4 py-3 bg-[var(--bg-accent)] rounded-xl text-sm font-medium hover:bg-indigo-600 hover:text-white transition-all border border-[var(--glass-border)] shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              Election Commission
            </a>
            <a href="https://voters.eci.gov.in" target="_blank" rel="noreferrer" className="flex-1 min-w-[120px] text-center px-4 py-3 bg-[var(--bg-accent)] rounded-xl text-sm font-medium hover:bg-indigo-600 hover:text-white transition-all border border-[var(--glass-border)] shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              Voter Portal
            </a>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <a href="https://vote.gov" target="_blank" rel="noreferrer" className="flex-1 min-w-[120px] text-center px-4 py-3 bg-[var(--bg-accent)] rounded-xl text-sm font-medium hover:bg-indigo-600 hover:text-white transition-all border border-[var(--glass-border)] shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              Vote.gov
            </a>
            <a href="https://www.fec.gov" target="_blank" rel="noreferrer" className="flex-1 min-w-[120px] text-center px-4 py-3 bg-[var(--bg-accent)] rounded-xl text-sm font-medium hover:bg-indigo-600 hover:text-white transition-all border border-[var(--glass-border)] shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              FEC Database
            </a>
            <a href="https://www.eac.gov" target="_blank" rel="noreferrer" className="flex-1 min-w-[120px] text-center px-4 py-3 bg-[var(--bg-accent)] rounded-xl text-sm font-medium hover:bg-indigo-600 hover:text-white transition-all border border-[var(--glass-border)] shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              EAC.gov
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
