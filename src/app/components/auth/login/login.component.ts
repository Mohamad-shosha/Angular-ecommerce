// src/app/components/auth/login/login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { AuthStatusService } from 'src/app/services/auth-status.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private authStatus: AuthStatusService
  ) {
    // إنشاء النموذج بالفاليديشن
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ),
        ],
      ],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        const { accessToken, refreshToken } = res;

        // فك JWT يدويًا
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const role = payload.role;
        const email = payload.sub;
        console.log(role);

        // تخزين البيانات
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userEmail', email);

        // تحديث حالة المستخدم
        this.authStatus.setUserEmail(email);

        this.toastService.showSuccess('Login Successful ✅');

        // توجيه حسب الدور
        if (role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'CUSTOMER') {
          this.router.navigate(['/products']);
        } else {
          this.toastService.showError('Unsupported Role ❌');
        }
      },
      error: (err) => {
        this.toastService.showError(err.error?.message || 'Login failed ❌');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
