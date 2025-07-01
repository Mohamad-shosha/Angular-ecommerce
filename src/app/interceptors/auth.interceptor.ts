// src/app/interceptors/auth.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    // ✅ نسخ الطلب وإضافة التوكن إذا وجد
    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // ✅ تمرير الطلب ومعالجة الخطأ إن وجد
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // 🔒 لو حصل 401 Unauthorized، نحاول نستخدم refreshToken
        if (error.status === 401 && localStorage.getItem('refreshToken')) {
          const refreshToken = localStorage.getItem('refreshToken')!;

          return this.authService.refreshToken(refreshToken).pipe(
            switchMap((tokens) => {
              // 🆕 حفظ التوكنات الجديدة
              localStorage.setItem('accessToken', tokens.accessToken);
              localStorage.setItem('refreshToken', tokens.refreshToken);

              // ♻️ إعادة إرسال الطلب الأصلي بالتوكن الجديد
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              });

              return next.handle(retryReq);
            }),
            catchError((refreshError) => {
              // ❌ لو فشل التحديث، يتم تسجيل خروج المستخدم
              localStorage.clear();
              window.location.href = '/auth/login';
              return throwError(() => refreshError);
            })
          );
        }

        // ⚠️ غير ذلك، نعيد الخطأ كما هو
        return throwError(() => error);
      })
    );
  }
}
