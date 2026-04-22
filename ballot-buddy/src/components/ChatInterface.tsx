"use client";

import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import OptionsSelector from './OptionsSelector';
import InteractiveTimeline from './InteractiveTimeline';

type Message = {
  id: string;
  isUser: boolean;
  text?: string;
  type?: 'text' | 'options' | 'timeline' | 'checklist';
  options?: any[];
  events?: any[];
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState('greeting');
  const [userData, setUserData] = useState({ location: '', role: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          isUser: false,
          type: 'text',
          text: "Hello! I am Ballot Buddy, your non-partisan guide to the election process. To provide the most accurate information based on the National Voter Registration Act (NVRA), what state or ZIP code are you voting in?"
        }
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = (text: string, delay: number = 600) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), isUser: false, type: 'text', text }]);
    }, delay);
  };

  const addOptions = (options: any[], delay: number = 600) => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + Math.random(),
        isUser: false,
        type: 'options',
        options
      }]);
    }, delay);
  };

  const addTimeline = (events: any[], delay: number = 600) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), isUser: false, type: 'timeline', events }]);
    }, delay);
  };

  const showMainMenu = (delay: number = 600) => {
    addOptions([
      { id: 'eligibility', label: 'Voter Eligibility & Registration', icon: '📝' },
      { id: 'lifecycle', label: 'The Voting Lifecycle & Methods', icon: '🗳️' },
      { id: 'integrity', label: 'Election Integrity & Security', icon: '🛡️' },
      { id: 'finance', label: 'Campaign Finance & Ethics', icon: '💰' },
      { id: 'transition', label: 'The Transition of Power', icon: '🏛️' },
    ], delay);
  };

  const handleOptionSelect = (id: string, label: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), isUser: true, text: label, type: 'text' }]);

    // Eligibility Menu
    if (id === 'eligibility') {
      addBotMessage("Under the NVRA and VRA, we have specific frameworks. What would you like to know?");
      addOptions([
        { id: 'nvra', label: 'Motor Voter & Registration Agencies', icon: '🏢' },
        { id: 'id_req', label: 'State ID Requirements', icon: '🪪' },
        { id: 'uocava', label: 'Military & Overseas (UOCAVA)', icon: '🌍' },
        { id: 'main_menu', label: 'Back to Main Menu', icon: '⬅️' }
      ]);
    } else if (id === 'nvra') {
      addBotMessage("The National Voter Registration Act of 1993 (NVRA) mandates that states provide registration opportunities at Motor Vehicle Agencies (DMVs), public assistance offices, and disability service centers.");
      addBotMessage(`Based on your location, you can register at your local DMV or online.`);
      showMainMenu(1200);
    } else if (id === 'id_req') {
      addBotMessage("Federal law sets baselines, but ID requirements are state-specific. Some states have 'strict' document requirements, while others are 'non-strict' and allow affidavits.");
      addBotMessage(`You may need to check if your ID type is accepted to avoid a provisional ballot.`);
      showMainMenu(1200);
    } else if (id === 'uocava') {
      addBotMessage("The Uniformed and Overseas Citizens Absentee Voting Act (UOCAVA) protects military personnel and overseas citizens. It allows you to use the Federal Post Card Application (FPCA) to register and request an absentee ballot simultaneously.");
      showMainMenu(1200);
    }
    
    // Lifecycle Menu
    else if (id === 'lifecycle') {
      addBotMessage("The voting lifecycle involves several key milestones. Which area do you need guidance on?");
      addOptions([
        { id: 'registration_verify', label: 'Registration Cut-offs', icon: '📅' },
        { id: 'absentee', label: 'Absentee & Mail-in Voting', icon: '✉️' },
        { id: 'early_voting', label: 'Early Voting Windows', icon: '🏃' },
        { id: 'main_menu', label: 'Back to Main Menu', icon: '⬅️' }
      ]);
    } else if (id === 'registration_verify') {
      addBotMessage(`You must validate your registration status before your state's cut-off date. In many states, this is 15-30 days before the federal election.`);
      showMainMenu(1200);
    } else if (id === 'absentee') {
      addBotMessage("Monitor deadlines for ballot requests! Postmark requirements and drop-off box locations vary.");
      addBotMessage("Note: If you are in a disaster-impacted zone (like those affected by Hurricanes Helene and Milton), special Emergency Election Procedures may apply for ballot submission.");
      showMainMenu(1200);
    } else if (id === 'early_voting') {
      addBotMessage("In-person early voting jurisdictions have specific start and end dates. Check your local election office for the exact dates in your county.");
      showMainMenu(1200);
    }

    // Integrity Menu
    else if (id === 'integrity') {
      addBotMessage("Public confidence is built through transparency. What security topic interests you?");
      addOptions([
        { id: 'vvsg', label: 'Voluntary Voting System Guidelines (VVSG)', icon: '📋' },
        { id: 'epoll', label: 'E-Poll Books & Security', icon: '💻' },
        { id: 'secret_ballot', label: 'The Secret Ballot', icon: '🤫' },
        { id: 'main_menu', label: 'Back to Main Menu', icon: '⬅️' }
      ]);
    } else if (id === 'vvsg') {
      addBotMessage("VVSG 2.0 is the 'North Star' for security. It ensures hardware and software meet rigorous federal standards for accuracy, accessibility, and auditability.");
      showMainMenu(1200);
    } else if (id === 'epoll') {
      addBotMessage("Electronic Poll Books undergo federal testing to ensure voter data encryption and high availability during peak traffic, protecting your data.");
      showMainMenu(1200);
    } else if (id === 'secret_ballot') {
      addBotMessage("The Secret Ballot is a cornerstone of election policy. Systems are architected so your identity is completely decoupled from your specific ballot selections, preventing coercion.");
      showMainMenu(1200);
    }

    // Finance Menu
    else if (id === 'finance') {
      addBotMessage("Ethical oversight is essential for an informed electorate. Select a topic:");
      addOptions([
        { id: 'fec', label: 'FEC Disclosure Search', icon: '🔍' },
        { id: 'super_pac', label: 'Super PAC Monitoring', icon: '📈' },
        { id: 'ai_disclosure', label: 'AI Disclosures in Campaigns', icon: '🤖' },
        { id: 'main_menu', label: 'Back to Main Menu', icon: '⬅️' }
      ]);
    } else if (id === 'fec') {
      addBotMessage("You can query the Federal Election Commission database to see candidate and committee filings, including coordinated party expenditures under 52 U.S.C. §30116.");
      showMainMenu(1200);
    } else if (id === 'super_pac') {
      addBotMessage("Super PACs (Independent-Expenditure-Only Committees) have unlimited contribution thresholds but cannot coordinate directly with candidates.");
      showMainMenu(1200);
    } else if (id === 'ai_disclosure') {
      addBotMessage("Recent policy shifts require disclosures or labels for AI-generated content (like deepfakes) in campaign materials to maintain transparency.");
      showMainMenu(1200);
    }

    // Transition Timeline
    else if (id === 'transition') {
      addBotMessage("The stability of our democratic system relies on clear procedural integrity. Here is the chronological transition timeline:");
      addTimeline([
        { id: 'tr1', date: 'State-Level', title: 'Federal Election Results Certification', description: 'Finalization of popular vote tallies by states.', isActive: false },
        { id: 'tr2', date: 'Mid-December', title: 'Meeting of Electors', description: 'Electors cast their votes for President and Vice President.', isActive: false },
        { id: 'tr3', date: 'Jan 6', title: 'Joint Session for Counting Electoral Votes', description: 'A constitutionally mandated session to count and certify the electoral votes.', isActive: false },
        { id: 'tr4', date: 'Jan 3', title: 'First Day of a New Congress', description: 'The formal convening of the Senate and House and swearing-in of members.', isActive: false },
        { id: 'tr5', date: 'Jan 20', title: 'Presidential Inauguration', description: 'The formal transfer of executive authority. (Covered by the 25th Amendment for succession).', isActive: true },
        { id: 'tr6', date: 'Early Feb', title: 'Executive Budget Process', description: 'Submission of the President’s budget request post-inauguration.', isActive: false }
      ], 600);
      showMainMenu(2000);
    }
    
    // Main Menu Fallback
    else if (id === 'main_menu') {
      showMainMenu(100);
    }
  };

  const handleUserInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get('userInput') as string;
    
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now().toString(), isUser: true, text: input, type: 'text' }]);
    e.currentTarget.reset();

    if (step === 'greeting') {
      setUserData(prev => ({ ...prev, location: input }));
      setStep('askRole');
      addBotMessage(`Got it, your location is ${input}. To help me provide UOCAVA guidance if needed, are you a standard civilian voter, military, or living overseas?`);
    } else if (step === 'askRole') {
      setUserData(prev => ({ ...prev, role: input }));
      setStep('mainMenu');
      if (input.toLowerCase().includes('military') || input.toLowerCase().includes('overseas')) {
         addBotMessage(`Thank you. Since you indicated military/overseas status, the UOCAVA timeline applies to you.`);
      } else {
         addBotMessage(`Thanks! I've tailored my information for you.`);
      }
      addBotMessage(`What would you like to explore about the federal election process?`);
      showMainMenu(1200);
    } else {
      addBotMessage("I am a simulated assistant built on the federal blueprint framework. Please use the interactive menu options above to explore.");
      showMainMenu(1200);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-4xl mx-auto glass-panel rounded-t-3xl overflow-hidden mt-8 shadow-2xl relative">
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.type === 'text' && <MessageBubble text={msg.text || ''} isUser={msg.isUser} />}
            {msg.type === 'options' && msg.options && (
              <OptionsSelector options={msg.options} onSelect={(id) => handleOptionSelect(id, msg.options!.find(o => o.id === id)?.label || id)} />
            )}
            {msg.type === 'timeline' && msg.events && (
              <InteractiveTimeline events={msg.events} />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--glass-border)] shrink-0">
        <form onSubmit={handleUserInput} className="flex gap-4">
          <input
            type="text"
            name="userInput"
            placeholder="Type your response here..."
            className="flex-1 bg-[var(--bg-accent)] text-white p-4 rounded-xl border border-[var(--glass-border)] focus:outline-none focus:border-[var(--accent-glow)] focus:ring-1 focus:ring-[var(--accent-glow)] transition-all font-medium placeholder-gray-500"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 flex items-center justify-center"
          >
             Send
          </button>
        </form>
      </div>
    </div>
  );
}
