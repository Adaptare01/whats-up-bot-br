
import { useState, useCallback, useEffect } from 'react';
import { Message, WebhookRequest, WebhookResponse } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// URL do webhook para envio de mensagens
const WEBHOOK_URL = 'https://primary-production-7d89.up.railway.app/webhook-test/I.Nova%20Hub';
const SESSION_ID_KEY = 'whatsapp_chatbot_session_id';
const MESSAGE_COUNT_KEY = 'whatsapp_chatbot_message_count';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1500;

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messageCount, setMessageCount] = useState<number>(0);
  
  // Initialize session ID or get existing one
  useEffect(() => {
    const storedSessionId = localStorage.getItem(SESSION_ID_KEY);
    const storedMessageCount = localStorage.getItem(MESSAGE_COUNT_KEY);
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem(SESSION_ID_KEY, newSessionId);
    }
    
    if (storedMessageCount) {
      setMessageCount(parseInt(storedMessageCount, 10));
    } else {
      localStorage.setItem(MESSAGE_COUNT_KEY, '0');
    }
  }, []);

  // Função para fazer a requisição ao webhook com tentativas automáticas
  const fetchWebhook = async (request: WebhookRequest, retryCount = 0): Promise<WebhookResponse> => {
    try {
      console.log(`Tentativa ${retryCount + 1} de enviar mensagem para o webhook:`, request);
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      // Tenta obter a resposta como JSON
      try {
        const responseText = await response.text();
        console.log('Resposta do webhook (texto):', responseText);
        
        if (!responseText || responseText.trim() === '') {
          throw new Error('Resposta vazia do servidor');
        }
        
        const data = JSON.parse(responseText);
        console.log('Resposta do webhook (JSON):', data);
        return data;
      } catch (jsonError) {
        console.error('Erro ao converter resposta para JSON:', jsonError);
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error(`Erro na tentativa ${retryCount + 1}:`, error);
      
      // Se ainda não atingimos o número máximo de tentativas, tenta novamente
      if (retryCount < MAX_RETRIES) {
        console.log(`Tentando novamente em ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWebhook(request, retryCount + 1);
      }
      
      throw error;
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Increment message count
    const newMessageCount = messageCount + 1;
    setMessageCount(newMessageCount);
    localStorage.setItem(MESSAGE_COUNT_KEY, newMessageCount.toString());

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

      const data = await fetchWebhook(request);
      
      if (data.status === 'success' && data.output) {
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
        throw new Error('Resposta inválida do servidor');
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
  }, [sessionId, messageCount]);

  const resetChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(MESSAGE_COUNT_KEY);
    
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    localStorage.setItem(SESSION_ID_KEY, newSessionId);
    
    setMessageCount(0);
    localStorage.setItem(MESSAGE_COUNT_KEY, '0');
    
    toast.success('Conversa reiniciada com sucesso!');
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    resetChat,
  };
};
