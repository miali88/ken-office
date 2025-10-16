/**
 * Common types shared across Word and Outlook add-ins
 */

export enum OfficeHost {
  Word = "Word",
  Outlook = "Outlook",
  Unknown = "Unknown"
}

export interface BackendConfig {
  baseUrl: string;
  timeout?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Word-specific types
export interface DocumentData {
  documentText: string;
  placeholders: string[];
}

export interface PlaceholderSuggestion {
  placeholder: string;
  suggestedValue: string;
  source?: string;
}

export interface DocGenResponse {
  suggestions: PlaceholderSuggestion[];
}

export interface RewriteResponse {
  rewrittenDocument: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Outlook-specific types
export interface EmailContent {
  subject: string;
  body: string;
}

export interface EmailSummary {
  summary: string;
}

export interface FilingData {
  client: string;
  matter: string;
  category: string;
  case: string;
}

export interface Attachment {
  name: string;
  filed: boolean;
}
