export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  type: "general" | "job_match";
  content: string;
  matchPercentage?: number;
  matchLevel?: string;
  breakdown?: Record<string, string>;
  followUps?: string[];
}
