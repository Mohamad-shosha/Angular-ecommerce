import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {
  isLoading = false;

  constructor(private router: Router) {}

  goToLogin() {
    this.isLoading = true;

    // Delay 1.2 ثانية قبل ما يروح للـ login
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/auth/login']);
    }, 1200);
  }
}
