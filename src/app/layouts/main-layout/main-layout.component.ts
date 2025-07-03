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
  isLoginLoading = false;
  isRegisterLoading = false;
  islogoutLoading = false;

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
    this.isLoginLoading = true;

    setTimeout(() => {
      this.isLoginLoading = false;
      this.router.navigate(['/auth/login']);
    }, 1200);
  }

  goToRegister() {
    this.isRegisterLoading = true;

    setTimeout(() => {
      this.isRegisterLoading = false;
      this.router.navigate(['/auth/register']);
    }, 1200);
  }

  logout() {
    this.islogoutLoading = true;

    setTimeout(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userEmail');
      this.authStatus.setUserEmail(null);

      this.islogoutLoading = false;

      this.toastService.showSuccess('Logout Successful 👋');

      this.router.navigate(['/products']);
    }, 1200);
  }
}
