import { Component, Inject, inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignin from '@okta/okta-signin-widget'
import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignIn: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    // Initialize Okta Sign-In widget config
    this.oktaSignIn = new OktaSignin({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
  }

  ngOnInit(): void {
    // Remove any previous widget instances
    this.oktaSignIn.remove();

    // Render the widget inside the given element id
    this.oktaSignIn.renderEl(
      {
        el: '#okta-sign-in-widget' // this id must match the div id in login.component.html
      },
      (response :any) => {
        if (response.status === 'SUCCESS') {
          // Redirect after successful authentication
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error : any) => {
        throw error;
      }
    );
  }
}
