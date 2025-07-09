import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatbotService } from 'src/app/services/chatbot.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  questionControl = new FormControl('');
  messages: { text: string; from: 'user' | 'bot' }[] = [];
  loading = false;
  showSuggestions = true;

  // عدلنا هنا: الأسئلة المقترحة أصبحت تحتوي على id
  suggestedQuestions: { id: number; question: string }[] = [];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.chatbotService.getFAQs().subscribe({
      next: (data) => {
        this.suggestedQuestions = data;
      },
      error: (err) => {
        console.error('Failed to load suggested questions', err);
      },
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    const text = this.questionControl.value?.trim();
    if (!text) return;

    this.messages.push({ text, from: 'user' });
    this.loading = true;

    this.chatbotService.ask({ text, limit: 3 }).subscribe({
      next: (res) => {
        this.messages.push({ text: res.answer, from: 'bot' });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ text: 'Something went wrong.', from: 'bot' });
        this.loading = false;
      },
    });

    this.questionControl.setValue('');
    this.showSuggestions = false;
  }

  sendSuggested(faq: { id: number; question: string }) {
    this.messages.push({ text: faq.question, from: 'user' });
    this.loading = true;

    this.chatbotService.getAnswerByFAQId(faq.id).subscribe({
      next: (res) => {
        this.messages.push({ text: res.answer, from: 'bot' });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ text: 'Something went wrong.', from: 'bot' });
        this.loading = false;
      },
    }
  );
      this.showSuggestions = false;
  }
}
