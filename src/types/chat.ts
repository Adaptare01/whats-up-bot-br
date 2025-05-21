
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export interface WebhookRequest {
  input: string;
  idsession: string;
  nrmessage: number;
}

export interface WebhookResponse {
  output: string;
  status: string;
  data?: any;
}
