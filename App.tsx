
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Role, Message } from './types';
import { SOCRATES_SYSTEM_PROMPT } from './constants';

// --- Helper Components (defined outside main App to prevent re-creation on render) ---

const SocratesIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 rounded-full bg-slate-500 p-1 text-white"
  >
    <path
      fillRule="evenodd"
      d="M12.528 1.472a.75.75 0 01.005 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97L11.473 1.477a.75.75 0 011.055-.005zM19.028 1.472a.75.75 0 01.005 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97L18.473 1.477a.75.75 0 011.055-.005zM9.528 11.472a.75.75 0 01.005 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97L8.473 11.477a.75.75 0 011.055-.005zm9.505 0a.75.75 0 01.005 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97L17.978 11.477a.75.75 0 011.055-.005z"
      clipRule="evenodd"
    />
    <path
      d="M4.5 1.5a.75.75 0 00-1.5 0v11.25a.75.75 0 001.5 0V1.5zM21 1.5a.75.75 0 00-1.5 0v11.25a.75.75 0 001.5 0V1.5zM12.75 2.25a.75.75 0 00-1.5 0v9.75a.75.75 0 001.5 0V2.25z"
    />
    <path
      fillRule="evenodd"
      d="M3 14.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 3.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3 21.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

interface MessageProps {
  message: Message;
}

const MessageBubble: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const alignment = isUser ? 'justify-end' : 'justify-start';
  const bgColor = isUser ? 'bg-blue-600' : 'bg-slate-700';
  const textColor = 'text-white';

  return (
    <div className={`flex ${alignment} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <SocratesIcon />
        </div>
      )}
      <div className={`max-w-prose px-4 py-3 rounded-lg ${bgColor} ${textColor} whitespace-pre-wrap`}>
        {message.text}
      </div>
    </div>
  );
};

const LoadingBubble: React.FC = () => (
  <div className="flex justify-start mb-4">
    <div className="flex-shrink-0 mr-3">
      <SocratesIcon />
    </div>
    <div className="max-w-prose px-4 py-3 rounded-lg bg-slate-700 text-white flex items-center space-x-2">
      <span className="sr-only">Thinking...</span>
      <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
    </div>
  </div>
);

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-800/80 backdrop-blur-sm">
      <div className="flex items-center bg-slate-700 rounded-full p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="소크라테스에게 질문하세요..."
          className="flex-grow bg-transparent text-white placeholder-slate-400 focus:outline-none px-4"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white rounded-full p-2 disabled:bg-slate-500 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.105 3.105a.75.75 0 011.06 0L10 8.94l5.835-5.836a.75.75 0 111.06 1.06L11.06 10l5.835 5.835a.75.75 0 11-1.06 1.06L10 11.06l-5.835 5.835a.75.75 0 01-1.06-1.06L8.94 10 3.105 4.165a.75.75 0 010-1.06z" clipRule="evenodd" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity="0" />
            <path d="M3.105 16.895a.75.75 0 01-1.06-1.06L8.94 10 3.105 4.165a.75.75 0 011.06-1.06L10 8.94l5.835-5.836a.75.75 0 111.06 1.06L11.06 10l5.835 5.835a.75.75 0 11-1.06 1.06L10 11.06l-5.835 5.835zM3.5 10a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" opacity="0" />
            <path d="M10 2.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM2.5 10a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity="0" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" opacity="0" />
            <path d="M.5 9.5a.5.5 0 01.5-.5h18a.5.5 0 010 1H1a.5.5 0 01-.5-.5z" transform="rotate(90 10 10)" opacity="0" />
            <path d="M3.22 3.22a.5.5 0 01.707 0l12.86 12.86a.5.5 0 01-.707.707L3.22 3.927a.5.5 0 010-.707z" opacity="0" />
            <path d="M16.78 3.22a.5.5 0 01.707.707L4.627 16.78a.5.5 0 01-.707-.707L16.78 3.22z" opacity="0" />
            <path d="M2.5 10a.5.5 0 01.5-.5h14a.5.5 0 010 1h-14a.5.5 0 01-.5-.5z" opacity="0" />
            <path d="M2.5 10a.5.5 0 01.5-.5h14a.5.5 0 010 1h-14a.5.5 0 01-.5-.5z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-5.5-8a.5.5 0 01.5-.5h10a.5.5 0 010 1H5a.5.5 0 01-.5-.5z" opacity="0" />
            <path d="M2.969 10a.5.5 0 01.5-.5h13.062a.5.5 0 110 1H3.469a.5.5 0 01-.5-.5z" opacity="0" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707a1 1 0 00-1.414-1.414L10 10.586 7.707 8.293a1 1 0 00-1.414 1.414L8.586 12l-2.293 2.293a1 1 0 101.414 1.414L10 13.414l2.293 2.293a1 1 0 001.414-1.414L11.414 12l2.293-2.293z" clipRule="evenodd" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-11.707a1 1 0 00-1.414 1.414L9.586 10l-1.707 1.707a1 1 0 101.414 1.414L11 11.414l1.707 1.707a1 1 0 101.414-1.414L12.414 10l1.707-1.707a1 1 0 00-1.414-1.414L11 8.586 9.293 6.293z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-11.707a1 1 0 00-1.414 1.414L9.586 10l-1.707 1.707a1 1 0 101.414 1.414L11 11.414l1.707 1.707a1 1 0 101.414-1.414L12.414 10l1.707-1.707a1 1 0 00-1.414-1.414L11 8.586 9.293 6.293z" opacity="0" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-11.707a1 1 0 00-1.414 1.414L9.586 10l-1.707 1.707a1 1 0 101.414 1.414L11 11.414l1.707 1.707a1 1 0 101.414-1.414L12.414 10l1.707-1.707a1 1 0 00-1.414-1.414L11 8.586 9.293 6.293z" opacity="0" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" opacity="0" />
             <path d="M15.964 10c0 .339-.033.67-.095.992a.75.75 0 01-1.41.598A7.502 7.502 0 0015.498 10c0-.42-.04-.83-.112-1.23a.75.75 0 111.432-.444A8.963 8.963 0 0115.964 10zM10 15.964c.339 0 .67-.033.992-.095a.75.75 0 01.598 1.41A8.962 8.962 0 0110 18c-.42 0-.83-.04-1.23-.112a.75.75 0 01.444-1.432A7.502 7.502 0 0010 15.964zM4.036 10c0-.339.033-.67.095-.992a.75.75 0 011.41-.598A7.502 7.502 0 004.502 10c0 .42.04.83.112 1.23a.75.75 0 11-1.432.444A8.963 8.963 0 014.036 10zM10 4.036c-.339 0-.67.033-.992.095a.75.75 0 01-.598-1.41A8.962 8.962 0 0110 2c.42 0 .83.04 1.23.112a.75.75 0 01-.444 1.432A7.502 7.502 0 0010 4.036z" opacity="0" />
             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.03-8.22a.75.75 0 010-1.06l3-3a.75.75 0 111.06 1.06l-1.72 1.72h3.14a.75.75 0 010 1.5H8.72l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3.001z" clipRule="evenodd" transform="rotate(45 10 10)" />
          </svg>
        </button>
      </div>
    </form>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: Role.MODEL,
      text: "만나서 반갑네, 젊은 사상가여. 나는 소크라테스일세. \n자네의 마음속에는 어떤 질문이 맴돌고 있는가? 함께 탐구해 보세.",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const initializeChat = useCallback(async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SOCRATES_SYSTEM_PROMPT,
        },
      });
      chatSessionRef.current = chat;
    } catch (error) {
      console.error("Failed to initialize Gemini chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: Role.MODEL,
          text: "오류가 발생하여 대화를 시작할 수 없네. 페이지를 새로고침 해보게.",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleSendMessage = async (text: string) => {
    if (!chatSessionRef.current) {
      setMessages((prev) => [
        ...prev,
        {
          role: Role.MODEL,
          text: "대화 세션이 아직 준비되지 않았네. 잠시 후 다시 시도해보게.",
        },
      ]);
      return;
    }

    const userMessage: Message = { role: Role.USER, text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: text });
      const modelMessage: Message = { role: Role.MODEL, text: response.text };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = {
        role: Role.MODEL,
        text: "흠, 생각의 흐름에 문제가 생긴 듯하네. 다시 질문해주겠나?",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans text-slate-200 bg-slate-900">
      <header className="p-4 text-center border-b border-slate-700 shadow-lg bg-slate-800">
        <h1 className="text-2xl font-bold text-white">Neuro-City</h1>
        <p className="text-sm text-slate-400">소크라테스와의 대화</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          {isLoading && <LoadingBubble />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;
