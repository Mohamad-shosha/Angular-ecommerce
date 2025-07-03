// src/app/services/auth-status.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStatusService {
  private userEmailSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('userEmail')
  );
  userEmail$ = this.userEmailSubject.asObservable();

  setUserEmail(email: string | null) {
    this.userEmailSubject.next(email);
    if (email) {
      localStorage.setItem('userEmail', email);
    } else {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
}
