export interface NlpQuestionDTO {
  text: string;
  limit: number;
}

export interface NlpAnswerResponseDTO {
  answer: string;
  fullPrompt?: string;
  chatHistory?: ChatMessage[];
}

export interface ChatMessage {
  role: string;
  content: string;
}
