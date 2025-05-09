import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import { RateLimitConfig } from '../types';

dotenv.config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const RATE_LIMIT: RateLimitConfig = {
  MAX_REQUESTS_PER_MINUTE: 60,
  DELAY_BETWEEN_REQUESTS: 1000,
};

let requestQueue: number[] = [];
let activeRequests = 0;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

setInterval(() => {
  const now = Date.now();
  requestQueue = requestQueue.filter(timestamp => now - timestamp < 60000);
}, 60000);

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  requestQueue = requestQueue.filter(timestamp => now - timestamp < 60000);
  
  if (requestQueue.length >= RATE_LIMIT.MAX_REQUESTS_PER_MINUTE) {
    const oldestRequest = requestQueue[0];
    const waitTime = 60000 - (now - oldestRequest) + 100;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return waitForRateLimit();
  }
  
  if (requestQueue.length > 0) {
    const lastRequest = requestQueue[requestQueue.length - 1];
    const timeSinceLastRequest = now - lastRequest;
    if (timeSinceLastRequest < RATE_LIMIT.DELAY_BETWEEN_REQUESTS) {
      await new Promise(resolve => setTimeout(
        resolve, 
        RATE_LIMIT.DELAY_BETWEEN_REQUESTS - timeSinceLastRequest
      ));
    }
  }
}

export async function generateContent(prompt: string, retryCount = 0): Promise<string> {
  try {
    await waitForRateLimit();
    
    const now = Date.now();
    requestQueue.push(now);
    activeRequests++;
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.9,
          topP: 1,
          topK: 1,
          maxOutputTokens: 2048
        }
      },
      {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      }
    );

    activeRequests--;
    
    if (!response.data) {
      throw new Error('No response data from Gemini API');
    }

    if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    }

    if (response.data.promptFeedback) {
      console.warn('Content safety filter triggered:', response.data.promptFeedback);
      return 'Sorry, I cannot respond to that request.';
    }

    return 'No valid response from Gemini.';
  } catch (error) {
    activeRequests--;
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
        const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        console.warn(`Rate limited. Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return generateContent(prompt, retryCount + 1);
      }
      
      if (error.response?.data?.error?.message) {
        return `API error: ${error.response.data.error.message}`;
      }
    }
    
    console.error('Gemini API error:', error);
    if (retryCount < MAX_RETRIES) {
      const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return generateContent(prompt, retryCount + 1);
    }
    
    return 'Error processing your request. Please try again.';
  }
}