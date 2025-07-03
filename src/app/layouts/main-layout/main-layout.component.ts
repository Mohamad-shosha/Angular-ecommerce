import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStatusService } from 'src/app/services/auth-status.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {
  isLoading = false;
  userEmail: string | null = null;
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private authStatus: AuthStatusService,
    private toastService: ToastService
  ) {
    this.authStatus.userEmail$.subscribe((email) => {
      this.userEmail = email;
    });
  }

  goToLogin() {
    this.isLoading = true;

    // Delay 1.2 ثانية قبل ما يروح للـ login
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/auth/login']);
    }, 1200);
  }

  goToRegister() {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/auth/register']);
    }, 1200);
  }

  logout() {
    this.isLoading = true;
    // امسح بيانات الدخول
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    this.authStatus.setUserEmail(null);

    // ✅ أظهر رسالة نجاح
    this.toastService.showSuccess('Logout Successful 👋');

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/products']);
    }, 1200);
    // روح على صفحة اللوجين
  }
}
