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
    // Limpa o localStorage ao abrir a página para evitar dados antigos
    localStorage.clear();
    setMessageCount(getMessageCount());
  }, []);

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
    localStorage.clear(); // Limpa o localStorage ao reiniciar conversa
    resetChat();
    setMessageCount(0);
    window.location.reload(); // Atualiza a página após reiniciar conversa
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header onSettingsClick={handleSettingsClick} />
      
      <MessageList messages={messages} isLoading={isLoading} />
      
      {!started ? (
        <div className="flex justify-center p-4">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
            onClick={() => {
              setStarted(true);
              sendMessage('Vamos Inovar');
            }}
          >
            Apresente sua Idéia
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
      <div style={{ height: 20 }} />
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
