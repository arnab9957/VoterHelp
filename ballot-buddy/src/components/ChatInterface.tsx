"use client";

import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import OptionsSelector from './OptionsSelector';
import InteractiveTimeline from './InteractiveTimeline';
import { getStateByName, getStateByAbbrev, getAllStates } from '@/data/stateData';
import ReactMarkdown from 'react-markdown';

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

export default function ChatInterface({ initialAnswer }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState('greeting');
  const [userData, setUserData] = useState({ location: '', role: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('English');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestOptionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialAnswer) {
      addBotMessage(`📋 ${initialAnswer}`);
      showMainMenu(1000);
    }
  }, [initialAnswer]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const focusLatestOption = () => {
    setTimeout(() => {
      latestOptionRef.current?.focus();
    }, 100);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('ballotBuddyUserData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.location && parsed.role) {
          setUserData(parsed);
          setStep('mainMenu');
          setTimeout(() => {
            setMessages([{
              id: 'welcome-back',
              isUser: false,
              type: 'text',
              text: `Welcome back! I see your location is ${parsed.location}. What would you like to explore?`
            }]);
            setIsLoading(false);
            showMainMenu(600);
          }, 500);
          return;
        }
      } catch (e) {
        localStorage.removeItem('ballotBuddyUserData');
      }
    }
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          isUser: false,
          type: 'text',
          text: "Hello! I am Ballot Buddy, your non-partisan guide to the election process. To provide the most accurate information based on the National Voter Registration Act (NVRA), what state or ZIP code are you voting in?"
        }
      ]);
      setIsLoading(false);
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

  const fetchGeminiFallback = (query: string) => {
    setIsGeneratingResponse(true);
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...messages, { isUser: true, text: query }].filter(m => m.type === 'text'),
        userState: userData.location,
        userRole: userData.role,
        language
      })
    })
    .then(res => res.json())
    .then(data => {
      setIsGeneratingResponse(false);
      if (data.error) {
        addBotMessage("I encountered an error connecting to my knowledge base. Please try again.");
      } else {
        addBotMessage(data.text);
      }
      showMainMenu(1200);
    })
    .catch(err => {
      setIsGeneratingResponse(false);
      console.error("Chat error:", err);
      addBotMessage("Sorry, I had trouble processing that request.");
      showMainMenu(1200);
    });
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
      
      const stateInfo = userData.location ? getStateByName(userData.location) || getStateByAbbrev(userData.location) : null;
      if (stateInfo) {
        addBotMessage(`📋 For ${stateInfo.state}, visit: ${stateInfo.voterRegistrationUrl}`);
        showMainMenu(1200);
      } else {
        fetchGeminiFallback(`Where can I register to vote or find a DMV in ${userData.location || 'my area'}?`);
      }
    } else if (id === 'id_req') {
      const stateInfo = userData.location ? getStateByName(userData.location) || getStateByAbbrev(userData.location) : null;
      
      if (stateInfo) {
        const idType = stateInfo.idType === 'strict' ? '🔴 STRICT - Photo ID REQUIRED' : '🟡 NON-STRICT - Affidavit available';
        addBotMessage(`📋 ${stateInfo.state} ID Type: ${idType}`);
        addBotMessage(stateInfo.idRequired ? 'You MUST present a valid government-issued photo ID to vote.' : 'ID is recommended but not required - you can sign an affidavit.');
        showMainMenu(1200);
      } else {
        fetchGeminiFallback(`What are the specific voter ID requirements for ${userData.location || 'my area'}?`);
      }
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
      const stateInfo = userData.location ? getStateByName(userData.location) || getStateByAbbrev(userData.location) : null;
      
      if (stateInfo) {
        addBotMessage(`📅 ${stateInfo.state} Registration Deadline: ${stateInfo.registrationDeadline}`);
        addBotMessage(stateInfo.registrationDeadline.includes('same day') 
          ? 'Great news! You can register on Election Day at your polling place.'
          : 'Make sure to register BEFORE this deadline to avoid any issues.');
        showMainMenu(1200);
      } else {
        fetchGeminiFallback(`What is the voter registration deadline in ${userData.location || 'my area'}?`);
      }
    } else if (id === 'absentee') {
      const stateInfo = userData.location ? getStateByName(userData.location) || getStateByAbbrev(userData.location) : null;
      
      if (stateInfo) {
        addBotMessage(`✉️ ${stateInfo.state} Absentee Request Deadline: ${stateInfo.absenteeRequestDeadline}`);
        if (stateInfo.earlyVotingStart !== 'N/A') {
          addBotMessage(`🏃 Early Voting: ${stateInfo.earlyVotingStart} to ${stateInfo.earlyVotingEnd}`);
        }
        addBotMessage("Note: If you are in a disaster-impacted zone (like those affected by Hurricanes Helene and Milton), special Emergency Election Procedures may apply for ballot submission.");
        showMainMenu(1200);
      } else {
        fetchGeminiFallback(`What are the absentee or mail-in voting rules and deadlines for ${userData.location || 'my area'}?`);
      }
    } else if (id === 'early_voting') {
      const stateInfo = userData.location ? getStateByName(userData.location) || getStateByAbbrev(userData.location) : null;
      
      if (stateInfo) {
        if (stateInfo.earlyVotingStart === 'N/A (all vote-by-mail)' || stateInfo.earlyVotingStart === 'No designated early voting period') {
          addBotMessage(`📋 ${stateInfo.state} primarily uses vote-by-mail - ballots are automatically mailed to registered voters.`);
        } else {
          addBotMessage(`🏃 ${stateInfo.state} Early Voting: ${stateInfo.earlyVotingStart} to ${stateInfo.earlyVotingEnd}`);
          addBotMessage("Check your local election office for exact locations and hours.");
        }
        showMainMenu(1200);
      } else {
        fetchGeminiFallback(`What are the early voting dates and rules in ${userData.location || 'my area'}?`);
      }
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

  const handleGeneratePlan = () => {
    setIsGeneratingResponse(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), isUser: true, text: "Please generate my personalized voting plan.", type: 'text' }]);
    
      fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.filter(m => m.type === 'text'),
          userState: userData.location,
          userRole: userData.role,
          language
        })
      })
    .then(res => res.json())
    .then(data => {
      setIsGeneratingResponse(false);
      if (data.error) {
        addBotMessage("I had trouble generating your plan. Please try again.");
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), isUser: false, type: 'text', text: data.text }]);
        showMainMenu(1200);
      }
    })
    .catch(err => {
      setIsGeneratingResponse(false);
      console.error("Plan error:", err);
      addBotMessage("Sorry, something went wrong generating your plan.");
      showMainMenu(1200);
    });
  };

  const handleUserInput = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get('userInput') as string;
    
    if (!input.trim() && !selectedFile) return;
    
    const userMessageContent = selectedFile 
      ? `[Image attached: ${selectedFile.name}] ${input}`
      : input;

    setMessages(prev => [...prev, { id: Date.now().toString(), isUser: true, text: userMessageContent, type: 'text' }]);
    
    // Clear inputs immediately
    e.currentTarget.reset();
    const currentFile = selectedFile;
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (step === 'greeting') {
      const inputClean = input.trim();
      const stateInfo = getStateByName(inputClean) || getStateByAbbrev(inputClean);
      
      if (stateInfo) {
        const idMsg = stateInfo.idRequired 
          ? `⚠️ IMPORTANT: ${stateInfo.state} has STRICT photo ID requirements. You MUST bring an accepted form of photo ID to vote.` 
          : `ℹ️ ${stateInfo.state} has non-strict ID requirements - you may sign an affidavit if you don't have ID.`;
        
        addBotMessage(`Great! I found ${stateInfo.state} (${stateInfo.abbrev}) in our database.`);
        addBotMessage(idMsg);
        addBotMessage(`📅 Registration Deadline: ${stateInfo.registrationDeadline}`);
        addBotMessage(`📅 Early Voting: ${stateInfo.earlyVotingStart} to ${stateInfo.earlyVotingEnd}`);
      } else {
        addBotMessage(`Got it, your location is ${input}. I couldn't find exact state data for "${input}", but I'll provide general federal guidelines.`);
      }
      
      const newData = { ...userData, location: inputClean };
      setUserData(newData);
      localStorage.setItem('ballotBuddyUserData', JSON.stringify(newData));
      setStep('askRole');
      setTimeout(() => {
        addBotMessage(`To help me provide UOCAVA guidance if needed, are you a standard civilian voter, military, or living overseas?`);
      }, 800);
    } else if (step === 'askRole') {
      const newData = { ...userData, role: input };
      setUserData(newData);
      localStorage.setItem('ballotBuddyUserData', JSON.stringify(newData));
      setStep('mainMenu');
      if (input.toLowerCase().includes('military') || input.toLowerCase().includes('overseas')) {
         addBotMessage(`Thank you. Since you indicated military/overseas status, the UOCAVA timeline applies to you.`);
      } else {
         addBotMessage(`Thanks! I've tailored my information for you.`);
      }
      addBotMessage(`What would you like to explore about the federal election process?`);
      showMainMenu(1200);
    } else {
      setIsGeneratingResponse(true);

      if (currentFile) {
        // Handle Vision API
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(currentFile);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
          
          // Extract base64 part and mime type
          const [mimeInfo, b64Data] = base64.split(',');
          const mimeType = mimeInfo.split(':')[1].split(';')[0];

          fetch('/api/vision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: b64Data,
              mimeType: mimeType,
              query: input
            })
          })
          .then(res => res.json())
          .then(data => {
            setIsGeneratingResponse(false);
            if (data.error) {
              addBotMessage("I had trouble analyzing that image. Please try again.");
            } else {
              addBotMessage(data.text);
              showMainMenu(1200);
            }
          })
          .catch(err => {
            setIsGeneratingResponse(false);
            console.error("Vision error:", err);
            addBotMessage("Sorry, something went wrong processing your document.");
            showMainMenu(1200);
          });
        } catch (error) {
          setIsGeneratingResponse(false);
          addBotMessage("Could not read the uploaded file.");
        }
      } else {
        // Call normal Chat API
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, { id: Date.now().toString(), isUser: true, text: input, type: 'text' }].filter(m => m.type === 'text'),
            userState: userData.location,
            userRole: userData.role,
            language
          })
        })
        .then(res => res.json())
        .then(data => {
          setIsGeneratingResponse(false);
          if (data.error) {
            addBotMessage("I encountered an error connecting to my knowledge base. Please try again.");
          } else {
            addBotMessage(data.text);
            showMainMenu(1200);
          }
        })
        .catch(err => {
          setIsGeneratingResponse(false);
          console.error("Chat error:", err);
          addBotMessage("Sorry, I had trouble processing that request. Please try selecting an option from the menu.");
          showMainMenu(1200);
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full glass-panel rounded-3xl overflow-hidden shadow-2xl relative border border-indigo-500/20">
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth" role="log" aria-label="Chat messages" aria-live="polite">
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
              <InteractiveTimeline events={msg.events} />
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
    </div>
  );
}
