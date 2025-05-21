
import { useState } from 'react';
import Header from '@/components/Header';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import LoginModal from '@/components/LoginModal';
import ConfigModal from '@/components/ConfigModal';
import { useChatbot } from '@/hooks/useChatbot';
import { Settings } from 'lucide-react';

const Index = () => {
  const { messages, sendMessage, isLoading, resetChat } = useChatbot();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const handleSettingsClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsConfigModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header onSettingsClick={handleSettingsClick} />
      
      <MessageList messages={messages} isLoading={isLoading} />
      
      <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
      
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
        onResetChat={resetChat}
      />
    </div>
  );
};

export default Index;
