import { useState, useEffect } from 'react'
import { MessageBox, IMessage } from './MessageBox'
import { Input } from './Input'
import { apiClient } from '../services/apiClient'
import axios from 'axios'

function ChatBot() {
  const [messages, setMessages] = useState<IMessage[]>([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [threadId, setThreadId] = useState<string | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const saveThreadId = (threadId: string) => {
    localStorage.setItem('threadId', threadId)
    setThreadId(threadId)
  }

  useEffect(() => {
    const loadThreadHistory = async () => {
      const savedThreadId = localStorage.getItem("threadId");

      if (savedThreadId) {
        setThreadId(savedThreadId);
        setLoading(true);

        try {
          const response = await axios.get(
            `http://localhost:3000/history/${savedThreadId}`
          );
          const history = response.data.history || [];

          const historyMessages: IMessage[] = [];
          let messageId = 1;

          history.forEach((item: { role: string; content: string }) => {
            if (item.role === "user") {
              historyMessages.push({
                id: messageId++,
                text: item.content,
                sender: "user",
              });
            } else if (item.role === "assistant") {
              historyMessages.push({
                id: messageId++,
                text: item.content,
                sender: "bot",
              });
            }
          });

          setMessages(historyMessages);
        } catch (error) {
          console.error("Error loading thread history:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadThreadHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: IMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };

    setMessages([...messages, userMessage]);
    const messageText = input;
    setInput("");

    try {
      const response = await apiClient.post("", {
        message: messageText,
        threadId: threadId,
      });

      // Extract the last AI message from LangChain response
      const aiMessages =
        response.data.response?.messages?.filter(
          (msg: { kwargs?: { type?: string } }) => msg.kwargs?.type === "ai"
        ) || [];
      const responseThreadId = response.data.threadId;
      saveThreadId(responseThreadId);

      const lastAiMessage = aiMessages[aiMessages.length - 1];
      const botText = lastAiMessage?.kwargs?.content || "No response received";

      const botMessage: IMessage = {
        id: messages.length + 2,
        text: botText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: IMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl h-[700px] bg-[#FAFAFA] rounded-[20px] shadow-[2px_2px_10px_0px_rgba(0,0,0,0.1)] flex flex-col mx-[50px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-6 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6"
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
            <h1 className="text-xl font-bold">AI Assistant</h1>
            <p className="text-sm text-indigo-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online and ready to help
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"
                  style={{ animationDuration: "1.5s" }}
                ></div>
              </div>
              <p className="text-gray-600 text-sm font-medium">
                Loading your conversation...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBox key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white rounded-b-2xl">
        <Input
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}

export default ChatBot
