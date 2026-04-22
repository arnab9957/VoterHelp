import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8 flex flex-col items-center">
      {/* Header Area */}
      <header className="w-full max-w-4xl flex flex-col items-center justify-center animate-fade-in-up mt-4 md:mt-8 mb-4">
        <div className="glass-panel px-6 py-2 rounded-full mb-4 border border-indigo-500/30">
          <span className="text-indigo-400 font-semibold tracking-widest text-sm uppercase">Election Assistant</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Meet <span className="gradient-text">Ballot Buddy</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-center max-w-2xl text-lg relative z-10">
          Your personal, non-partisan guide through the election process. We provide accurate timelines, step-by-step guidance, and checklists tailored to your location.
        </p>
      </header>
      
      {/* Background glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>

      {/* Main Chat Interface */}
      <ChatInterface />
    </main>
  );
}
