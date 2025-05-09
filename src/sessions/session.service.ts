import { generateContent } from '../ai/gemini.service';
import { UserSession } from '../types';

const userSessions: Record<string, UserSession> = {};
const SESSION_TIMEOUT = 15 * 60 * 1000;

function cleanupOldSessions(): void {
  const now = Date.now();
  for (const userId in userSessions) {
    if (userSessions[userId].lastInteraction && 
        now - userSessions[userId].lastInteraction! > SESSION_TIMEOUT) {
      delete userSessions[userId];
    }
  }
}

export async function handleUserInteraction(userId: string, message: string): Promise<string> {
  cleanupOldSessions();
  
  message = message.trim();
  const session = userSessions[userId] || { step: 'initial' };
  session.lastInteraction = Date.now();
  userSessions[userId] = session;

  switch (session.step) {
    case 'initial':
      session.step = 'awaiting-tool-selection';
      return 'Choose an option:\n1. Summarize text\n2. Translate text\n\nReply with 1 or 2';

    case 'awaiting-tool-selection':
      if (message === '1') {
        session.tool = 'summarize';
        session.step = 'awaiting-summarize-input';
        return 'Please enter the text to summarize:';
      } else if (message === '2') {
        session.tool = 'translate';
        session.step = 'awaiting-translate-language';
        return 'Enter target language (e.g., French, Spanish):';
      }
      return 'Invalid option. Please choose:\n1. Summarize\n2. Translate';

    case 'awaiting-translate-language':
      if (!message.trim()) return 'Please enter a valid target language:';
      session.targetLang = message;
      session.step = 'awaiting-translate-input';
      return `Enter text to translate to ${message}:`;

    case 'awaiting-translate-input':
      if (!message.trim()) return 'Please enter text to translate.';
      const translatePrompt = `Translate to ${session.targetLang} without commentary: ${message}`;
      const translation = await generateContent(translatePrompt);
      delete userSessions[userId];
      return `Translation: ${translation}`;

    case 'awaiting-summarize-input':
      if (!message.trim()) return 'Please enter text to summarize.';
      const summarizePrompt = `Summarize concisely without commentary: ${message}`;
      const summary = await generateContent(summarizePrompt);
      delete userSessions[userId];
      return `Summary: ${summary}`;

    default:
      delete userSessions[userId];
      return 'Session expired. Please start over.';
  }
}