import ReactMarkdown from 'react-markdown'

export interface IMessage {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export const MessageBox = ({ message }: { message: IMessage }) => {
    return (
      <div
        className={`flex ${
          message.sender === "user" ? "justify-end" : "justify-start"
        } animate-fadeIn`}
      >
        <div className={`flex gap-3 max-w-3xl ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.sender === "user"
              ? "bg-gradient-to-br from-indigo-500 to-purple-600"
              : "bg-gradient-to-br from-gray-200 to-gray-300"
          }`}>
            {message.sender === "user" ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
          </div>

          {/* Message bubble */}
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              message.sender === "user"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm"
                : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
            }`}
          >
            {message.sender === "bot" ? (
              <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.text}
              </p>
            )}
          </div>
        </div>
      </div>
    );
}