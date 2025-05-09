export type ToolType = 'summarize' | 'translate';

export interface UserSession {
  step: string;
  tool?: ToolType;
  targetLang?: string;
  lastInteraction?: number;
}

export interface RateLimitConfig {
  MAX_REQUESTS_PER_MINUTE: number;
  DELAY_BETWEEN_REQUESTS: number;
}