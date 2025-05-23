import { useState, useCallback, useEffect } from 'react';
import { Message, WebhookRequest } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { fetchWebhook } from '@/services/webhookService';
import { 
  getSessionId, 
  getMessageCount, 
  getWebhookUrl, 
  incrementMessageCount,
  resetSession,
  setMessageCount
} from '@/services/storageService';

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messageCount, setCurrentMessageCount] = useState<number>(0);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  
  // Initialize session ID, message count, and webhook URL
  useEffect(() => {
    const storedSessionId = getSessionId();
    const storedMessageCount = getMessageCount();
    const storedWebhookUrl = getWebhookUrl();
    
    setSessionId(storedSessionId);
    setCurrentMessageCount(storedMessageCount);
    setWebhookUrl(storedWebhookUrl);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Check if message count is already at limit
    const currentCount = getMessageCount();
    if (currentCount >= 9) {
      toast.error('Limite de mensagens atingido. Reinicie a conversa.');
      return;
    }

    // Increment message count
    const newMessageCount = incrementMessageCount();
    setCurrentMessageCount(newMessageCount);

    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const request: WebhookRequest = {
        input: text,
        idsession: sessionId,
        nrmessage: newMessageCount,
      };

      console.log('Enviando requisição para webhook:', request);

      const data = await fetchWebhook(request, webhookUrl);
      console.log('Resposta processada do webhook:', data);
      
      if (data.output) {
        // Add bot response to chat
        const botMessage: Message = {
          id: uuidv4(),
          text: data.output,
          sender: 'bot',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, botMessage]);
        console.log('Mensagem do bot adicionada com sucesso:', botMessage);
      } else {
        console.error('Resposta sem conteúdo válido:', data);
        throw new Error('Resposta sem conteúdo válido do servidor');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      
      const errorMessage: Message = {
        id: uuidv4(),
        text: 'Desculpe, houve um erro ao processar sua mensagem. Por favor, tente novamente.',
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, webhookUrl]);

  const resetChat = useCallback(() => {
    setMessages([]);
    const newSessionId = resetSession();
    setSessionId(newSessionId);
    setMessageCount(1); // Reset to 1 instead of 0 as requested
    setCurrentMessageCount(1);
    
    toast.success('Conversa reiniciada com sucesso!');
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    resetChat,
    messageCount: messageCount,
  };
};

export default useChatbot;
