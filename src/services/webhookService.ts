
import { WebhookRequest, WebhookResponse } from '@/types/chat';
import { DEFAULT_WEBHOOK_URL, MAX_RETRIES, RETRY_DELAY } from '@/constants/chatConstants';

/**
 * Fetches data from the webhook with automatic retry logic
 */
export const fetchWebhook = async (
  request: WebhookRequest, 
  webhookUrl: string = DEFAULT_WEBHOOK_URL, 
  retryCount = 0
): Promise<WebhookResponse> => {
  try {
    console.log(`Tentativa ${retryCount + 1} de enviar mensagem para o webhook:`, request);
    console.log(`Usando URL do webhook: ${webhookUrl}`);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error(`Resposta HTTP não-ok: ${response.status} ${response.statusText}`);
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // Tenta obter a resposta como texto primeiro
    const responseText = await response.text();
    console.log('Resposta do webhook (texto bruto):', responseText);
    
    if (!responseText || responseText.trim() === '') {
      console.error('Resposta vazia recebida do webhook');
      throw new Error('Resposta vazia do servidor');
    }
    
    // Tenta converter para JSON
    try {
      const data = JSON.parse(responseText);
      console.log('Resposta do webhook convertida para JSON:', data);
      
      // Se for um array, pega o primeiro item (formato da resposta observado nos logs)
      if (Array.isArray(data) && data.length > 0) {
        console.log('Detectado formato de array na resposta:', data[0]);
        return {
          status: 'success',
          output: data[0].output || 'Sem resposta definida'
        };
      }
      
      // Se a resposta for um objeto n8n específico, extrair a parte relevante
      if (data.data) {
        console.log('Detectada estrutura de dados n8n com propriedade data:', data.data);
        return {
          status: 'success',
          output: typeof data.data === 'string' ? data.data : 
                  data.data.output || data.data.message || 
                  (typeof data.data === 'object' ? JSON.stringify(data.data) : 'Resposta recebida')
        };
      }
      
      // Se for um formato simples ou personalizado
      return {
        status: data.status || 'success',
        output: data.output || data.message || data.response || 
                (typeof data === 'string' ? data : 'Resposta recebida')
      };
    } catch (jsonError) {
      console.error('Erro ao converter resposta para JSON:', jsonError);
      
      // Se não for JSON válido, tenta usar o texto diretamente
      if (responseText && responseText.length > 0) {
        console.log('Usando resposta de texto diretamente como output');
        return {
          status: 'success',
          output: responseText
        };
      }
      
      throw new Error('Resposta inválida do servidor');
    }
  } catch (error) {
    console.error(`Erro na tentativa ${retryCount + 1}:`, error);
    
    // Se ainda não atingimos o número máximo de tentativas, tenta novamente
    if (retryCount < MAX_RETRIES) {
      console.log(`Tentando novamente em ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWebhook(request, webhookUrl, retryCount + 1);
    }
    
    throw error;
  }
};
