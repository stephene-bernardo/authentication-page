import { ConstantsClass } from './../constants';
import { AuthService} from './../auth.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  authIdentifier = 'authToken';
  constructor(private http: HttpClient,
    private router: Router,
    private authService: AuthService) {
  }

  onSignInDbAuth(login, password) {
    this.authService.loginUsingDbAuth(login, password).subscribe(token => {
      if (token !== 'Not Authenticated User') {
        this.storeAuthTokenAndRedirect(ConstantsClass.DATABASE_AUTH_IDENTIFIER, token);
      }
    });
  }

  onSignInFacebookAuth() {
    this.authService.loginUsingFacebookAuth().then(userData => {
        this.storeAuthTokenAndRedirect(ConstantsClass.FACEBOOK_AUTH_IDENTIFIER,
          userData.token);
      }
    );
  }

  public onSignInGoogleAuth() {
    this.authService.loginUsingGoogleAuth().then((authToken) => {
      this.storeAuthTokenAndRedirect(ConstantsClass.GOOGLE_AUTH_IDENTIFIER, authToken);
    });
  }

  storeAuthTokenAndRedirect(authMethod, authToken) {
    localStorage.setItem(this.authIdentifier, `${authMethod} ${authToken}`);
    this.router.navigate(['']);
  }
}
