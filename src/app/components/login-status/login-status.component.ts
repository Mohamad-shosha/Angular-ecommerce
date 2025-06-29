import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result)=>{
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
    }
    );
  }

  /**
   * Fetch the authenticated user's details (claims)
   * and extract the user's full name.
   */
  getUserDetails(): void {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        (res) => {
          // 'name' claim contains user's full name
          this.userFullName = res.name as string;
        }
      ).catch(err => {
        console.error('Failed to fetch user details', err);
      });
    } else {
      this.userFullName = '';
    }
  }

  /**
   * Logout the user by terminating the session with Okta
   * and removing the current tokens.
   */
  logout(): void {
    this.oktaAuth.signOut();
  }
}
