
import { useState, FormEvent, KeyboardEvent } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput = ({ onSendMessage, isLoading }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-3 bg-gray-100 border-t">
      <form onSubmit={handleSubmit} className="flex items-center">
        <button
          type="button"
          className="text-gray-500 hover:text-whatsapp-green p-2"
          disabled={isLoading}
          aria-label="Anexar arquivo"
        >
          <Paperclip size={24} />
        </button>
        
        <div className="flex-1 relative mx-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma mensagem"
            className="input-message"
            disabled={isLoading}
            aria-label="Mensagem"
          />
        </div>
        
        <button
          type="button"
          className="text-gray-500 hover:text-whatsapp-green p-2"
          disabled={isLoading}
          aria-label="Emojis"
        >
          <Smile size={24} />
        </button>
        
        <button
          type="submit"
          className={`ml-2 rounded-full p-2 ${
            !message.trim() || isLoading
              ? 'bg-gray-300 text-gray-500'
              : 'bg-whatsapp-green text-white'
          }`}
          disabled={!message.trim() || isLoading}
          aria-label="Enviar"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
