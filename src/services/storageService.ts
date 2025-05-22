
import { v4 as uuidv4 } from 'uuid';
import { 
  SESSION_ID_KEY, 
  MESSAGE_COUNT_KEY, 
  WEBHOOK_URL_KEY,
  DEFAULT_WEBHOOK_URL
} from '@/constants/chatConstants';

/**
 * Gets the session ID from local storage or creates a new one
 */
export const getSessionId = (): string => {
  const storedSessionId = localStorage.getItem(SESSION_ID_KEY);
  
  if (storedSessionId) {
    return storedSessionId;
  }
  
  const newSessionId = uuidv4();
  localStorage.setItem(SESSION_ID_KEY, newSessionId);
  return newSessionId;
};

/**
 * Gets the current message count from local storage
 */
export const getMessageCount = (): number => {
  const storedMessageCount = localStorage.getItem(MESSAGE_COUNT_KEY);
  return storedMessageCount ? parseInt(storedMessageCount, 10) : 0;
};

/**
 * Sets the message count in local storage
 */
export const setMessageCount = (count: number): void => {
  localStorage.setItem(MESSAGE_COUNT_KEY, count.toString());
};

/**
 * Increments the message count and returns the new value
 */
export const incrementMessageCount = (): number => {
  const currentCount = getMessageCount();
  const newCount = currentCount + 1;
  setMessageCount(newCount);
  return newCount;
};

/**
 * Resets the session ID and message count
 */
export const resetSession = (): string => {
  const newSessionId = uuidv4();
  localStorage.setItem(SESSION_ID_KEY, newSessionId);
  localStorage.setItem(MESSAGE_COUNT_KEY, '0');
  return newSessionId;
};

/**
 * Gets the webhook URL from local storage or returns the default
 */
export const getWebhookUrl = (): string => {
  const storedWebhookUrl = localStorage.getItem(WEBHOOK_URL_KEY);
  return storedWebhookUrl || DEFAULT_WEBHOOK_URL;
};

/**
 * Sets the webhook URL in local storage
 */
export const setWebhookUrl = (url: string): void => {
  localStorage.setItem(WEBHOOK_URL_KEY, url);
};
