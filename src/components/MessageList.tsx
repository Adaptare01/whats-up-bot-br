
import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 chat-background">
      <div className="flex flex-col space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-center">
              Envie uma mensagem para iniciar a conversa.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div className={message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
              <div className="whitespace-pre-wrap">{message.text}</div>
              <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-600' : 'text-gray-500'} text-right`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="chat-bubble-bot py-2 px-3">
              <div className="typing-indicator">
                <div className="typing-dot animate-typing-dot-1"></div>
                <div className="typing-dot animate-typing-dot-2"></div>
                <div className="typing-dot animate-typing-dot-3"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
