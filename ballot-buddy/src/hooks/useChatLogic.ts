import { Message, UserData } from './useChatSession';
import { getStateByName, getStateByAbbrev } from '@/data/stateData';
import { insforge } from '@/lib/insforge';

type UseChatLogicProps = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  step: string;
  setStep: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  apiKey: string;
  modelName: string;
  setIsGeneratingResponse: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useChatLogic({
  messages,
  setMessages,
  userData,
  setUserData,
  step,
  setStep,
  language,
  apiKey,
  modelName,
  setIsGeneratingResponse
}: UseChatLogicProps) {
  
  /**
   * Appends a bot message to the chat interface.
   */
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
    streamChatResponse({
      messages: [...messages, { id: 'temp-query', isUser: true, text: query, type: 'text' } as Message].filter(m => m.type === 'text'),
      userState: userData.location,
      userRole: userData.role,
      language,
      apiKey,
      modelName
    });
  };

  /**
   * Streams response from the AI endpoint and updates the UI in real-time.
   */
  const streamChatResponse = async (apiBody: any) => {
    setIsGeneratingResponse(true);
    const botMessageId = Date.now().toString() + Math.random();
    setMessages(prev => [...prev, { id: botMessageId, isUser: false, type: 'text', text: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody)
      });

      if (!res.ok) throw new Error('API error');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let streamedText = '';

      while (reader && !done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          streamedText += decoder.decode(value, { stream: true });
          setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, text: streamedText } : m));
        }
      }
      setIsGeneratingResponse(false);
      showMainMenu(1200);
    } catch (err) {
      setIsGeneratingResponse(false);
      console.error("Chat error:", err);
      setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, text: "I encountered an error connecting to my knowledge base. Please try again." } : m));
      showMainMenu(1200);
    }
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

  /**
   * Handles user selection from quick reply options.
   */
  const handleOptionSelect = (id: string, label: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), isUser: true, text: label, type: 'text' }]);

    const isIndia = userData.location?.toLowerCase().includes('india');
    // Bypass hardcoded US responses if a different language is selected or if location is India
    if ((language !== 'English' || isIndia) && id !== 'main_menu') {
      streamChatResponse({
        messages: [...messages, { id: Date.now().toString(), isUser: true, text: `Please explain: ${label} in the context of my location`, type: 'text' }].filter(m => m.type === 'text'),
        userState: userData.location,
        userRole: userData.role,
        language,
        apiKey,
        modelName
      });
      return;
    }

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

  /**
   * Generates a personalized voting plan by calling the backend API.
   */
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
          language,
          apiKey,
          modelName
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

  /**
   * Main handler for user chat input submissions.
   */
  const handleUserInput = async (e: React.FormEvent<HTMLFormElement>, selectedFile: File | null, clearFileInput: () => void) => {
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
    clearFileInput();

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
        addBotMessage(`Got it, your location is ${input}. I couldn't find exact state data for "${input}", but I'll provide general guidelines tailored to your region.`);
      }
      
      const newData = { ...userData, location: inputClean };
      setUserData(newData);
      localStorage.setItem('ballotBuddyUserData', JSON.stringify(newData));
      setStep('askRole');
      setTimeout(() => {
        addBotMessage(`To help me provide the best guidance, are you a standard civilian voter, military, or living overseas?`);
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

      if (selectedFile) {
        // Handle Vision API
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
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
              query: input,
              apiKey,
              modelName
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
        // Call normal Chat API with streaming
        streamChatResponse({
          messages: [...messages, { id: Date.now().toString(), isUser: true, text: input, type: 'text' }].filter(m => m.type === 'text'),
          userState: userData.location,
          userRole: userData.role,
          language,
          apiKey,
          modelName
        });
      }
    }
  };

  return {
    handleOptionSelect,
    handleGeneratePlan,
    handleUserInput
  };
}
