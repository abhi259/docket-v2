export function ChatHeader() {
  return (
    <header className="shrink-0 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="w-full max-w-full px-4 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Docket Chat</h1>
          <p className="text-xs text-gray-500">AI-powered assistant</p>
        </div>
      </div>
    </header>
  );
}
