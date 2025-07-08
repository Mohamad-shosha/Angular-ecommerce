import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NlpAnswerResponseDTO, NlpQuestionDTO } from '../common/chatbot-dto';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private baseUrl = 'http://localhost:8080/api/chatbot';

  constructor(private http: HttpClient) {}

  ask(question: NlpQuestionDTO): Observable<NlpAnswerResponseDTO> {
    return this.http.post<NlpAnswerResponseDTO>(
      `${this.baseUrl}/ask`,
      question
    );
  }
  getFAQs(): Observable<{ id: number; question: string }[]> {
    return this.http.get<{ id: number; question: string }[]>(
      `${this.baseUrl}/FAQs`
    );
  }
  getAnswerByFAQId(id: number): Observable<{ answer: string }> {
    return this.http.get<{ answer: string }>(`${this.baseUrl}/FAQs/${id}`);
  }
}
