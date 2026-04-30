import { useState, useEffect } from 'react';
import { insforge } from '@/lib/insforge';

export type Message = {
  id: string;
  isUser: boolean;
  text?: string;
  type?: 'text' | 'options' | 'timeline' | 'checklist';
  options?: any[];
  events?: any[];
};

export type UserData = {
  location: string;
  role: string;
};

export function useChatSession(initialAnswer: string | null | undefined, scrollToBottom: () => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState('greeting');
  const [userData, setUserData] = useState<UserData>({ location: '', role: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session and load existing messages
  useEffect(() => {
    let sid = localStorage.getItem('ballotBuddySessionId');
    if (!sid) {
      sid = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      localStorage.setItem('ballotBuddySessionId', sid);
    }

    const loadSession = async () => {
      try {
        const { data, error } = await insforge.database
          .from('chat_sessions')
          .select('*')
          .eq('session_id', sid)
          .single();
          
        if (data && data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          if (data.user_data && data.user_data.location) {
            setUserData(data.user_data);
            setStep('mainMenu');
          } else {
            setStep('askRole');
          }
          setIsLoading(false);
          scrollToBottom();
          return;
        }
      } catch (err) {
        console.error("Failed to load session", err);
      }
      
      // Default greeting if no session exists
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
    };
    
    loadSession();
  }, [scrollToBottom]);

  // Handle initial answer logic if passed as prop
  useEffect(() => {
    if (initialAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), isUser: false, type: 'text', text: `📋 ${initialAnswer}` }]);
        
        // Show main menu options
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString() + Math.random(),
            isUser: false,
            type: 'options',
            options: [
              { id: 'eligibility', label: 'Voter Eligibility & Registration', icon: '📝' },
              { id: 'lifecycle', label: 'The Voting Lifecycle & Methods', icon: '🗳️' },
              { id: 'integrity', label: 'Election Integrity & Security', icon: '🛡️' },
              { id: 'finance', label: 'Campaign Finance & Ethics', icon: '💰' },
              { id: 'transition', label: 'The Transition of Power', icon: '🏛️' },
            ]
          }]);
        }, 1000);
      }, 600);
    }
  }, [initialAnswer]);

  // Sync session state to database when messages or userData change
  useEffect(() => {
    scrollToBottom();
    
    const syncSession = async () => {
      const sid = localStorage.getItem('ballotBuddySessionId');
      if (!sid || messages.length === 0) return;
      
      try {
        await insforge.database
          .from('chat_sessions')
          .upsert({
            session_id: sid,
            messages,
            user_data: userData,
            updated_at: new Date().toISOString()
          });
      } catch (e) {
        console.error("Failed to sync session", e);
      }
    };
    
    const timer = setTimeout(syncSession, 1000);
    return () => clearTimeout(timer);
  }, [messages, userData, scrollToBottom]);

  const clearChat = async () => {
    const sid = localStorage.getItem('ballotBuddySessionId');
    if (sid) {
      await insforge.database.from('chat_sessions').delete().eq('session_id', sid);
    }
    setMessages([]);
    setStep('greeting');
    setUserData({ location: '', role: '' });
    localStorage.removeItem('ballotBuddyUserData');
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          isUser: false,
          type: 'text',
          text: "Hello! I am Ballot Buddy, your non-partisan guide to the election process. To provide the most accurate information based on the National Voter Registration Act (NVRA), what state or ZIP code are you voting in?"
        }
      ]);
    }, 100);
  };

  return {
    messages,
    setMessages,
    step,
    setStep,
    userData,
    setUserData,
    isLoading,
    clearChat
  };
}
