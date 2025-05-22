import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import LoginModal from '@/components/LoginModal';
import ConfigModal from '@/components/ConfigModal';
import ResetConversationButton from '@/components/ResetConversationButton';
import { useChatbot } from '@/hooks/useChatbot';
import { Settings } from 'lucide-react';
import { getMessageCount } from '@/services/storageService';

const Index = () => {
  const { messages, sendMessage, isLoading, resetChat } = useChatbot();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Update message count whenever messages change
    setMessageCount(getMessageCount());
  }, [messages]);

  const handleSettingsClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsConfigModalOpen(true);
  };

  const handleResetConversation = () => {
    resetChat();
    setMessageCount(0);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header onSettingsClick={handleSettingsClick} />
      
      <MessageList messages={messages} isLoading={isLoading} />
      
      {!started ? (
        <div className="flex justify-center p-4">
          <button
            className="bg-whatsapp-green text-white px-6 py-2 rounded-full shadow hover:bg-whatsapp-dark-green transition"
            onClick={() => {
              setStarted(true);
              sendMessage('Olá quero inscrever minha ideia empreendedora');
            }}
          >
            Iniciar conversa
          </button>
        </div>
      ) : messageCount < 7 ? (
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
      ) : (
        <ResetConversationButton onReset={handleResetConversation} />
      )}
      
      <footer className="bg-gray-200 p-2 flex justify-center">
        <button 
          onClick={handleSettingsClick} 
          className="text-gray-500 hover:text-whatsapp-green focus:outline-none"
          aria-label="Configurações"
        >
          <Settings size={20} />
        </button>
      </footer>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={handleLoginSuccess} 
      />
      
      <ConfigModal 
        isOpen={isConfigModalOpen} 
        onClose={() => setIsConfigModalOpen(false)} 
        onResetChat={handleResetConversation} 
      />
    </div>
  );
};

export default Index;
