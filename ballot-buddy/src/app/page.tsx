import ChatInterface from '@/components/ChatInterface';
import EssentialInfo from '@/components/EssentialInfo';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8 flex flex-col items-center">
      {/* Header Area */}
      <header className="w-full max-w-7xl flex flex-col items-center justify-center animate-fade-in-up mt-4 md:mt-8 mb-8">
        <div className="glass-panel px-6 py-2 rounded-full mb-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <span className="text-indigo-400 font-semibold tracking-widest text-sm uppercase">Federal Election Assistant</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 tracking-tight">
          Meet <span className="gradient-text">Ballot Buddy</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-center max-w-2xl text-lg relative z-10">
          Your personal, non-partisan guide through the election process. We provide accurate timelines, step-by-step guidance, and checklists tailored to your location.
        </p>
      </header>
      
      {/* Background glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        {/* Main Chat Interface (Takes up 7 cols on large screens) */}
        <div className="lg:col-span-7 h-[calc(100vh-280px)] min-h-[600px] w-full">
          <ChatInterface />
        </div>
        
        {/* Essential Info Sidebar (Takes up 5 cols) */}
        <div className="lg:col-span-5 w-full">
          <EssentialInfo />
        </div>
      </div>
    </main>
  );
}
