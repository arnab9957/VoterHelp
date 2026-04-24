export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[var(--text-secondary)] text-lg">Loading Ballot Buddy...</p>
        <p className="text-[var(--text-secondary)] opacity-60 text-sm mt-2">Preparing your election information</p>
      </div>
    </div>
  );
}