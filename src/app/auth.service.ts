import { ConstantsClass } from './constants';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
  AuthService as SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular5-social-login';

declare const gapi: any;
@Injectable()
export class AuthService {
  baseUrl = 'http://localhost:3000';

  GoogleAuth;
  public auth2: any;
  constructor(private http: HttpClient, private router: Router, private authService: SocialAuthService) { 
    this.googleInit();
  }

  loginUsingDbAuth(login: string, password: string): Observable<any> {
    const httpOptions = {
      responseType: 'text' as 'text'
    };
    return this.http.post(`${this.baseUrl}/auth`, { username: login, password: password }, httpOptions);
  }

  loginUsingFacebookAuth() {
    return this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  loginUsingGoogleAuth() {
    return this.GoogleAuth.signIn().then(() => this.GoogleAuth.currentUser.get()['Zi']['id_token']);
  }

  getUserInfo(authToken: string): Observable<any>  {
    if (authToken) {
      const splitStoreAuthToken = authToken.split(' ');
      const headers = new HttpHeaders({ 'token': splitStoreAuthToken[1] });
      return this.http.get(`${this.baseUrl}${this.getUrlPathForUserInfo(splitStoreAuthToken[0])}`, { headers: headers });
    } else {
      this.router.navigate(['/login']);
    }
  }

  getUrlPathForUserInfo(authType: string) {
    if (authType === ConstantsClass.DATABASE_AUTH_IDENTIFIER) {
      return  '/auth/getDBUserInfo';
    } else if (authType === ConstantsClass.GOOGLE_AUTH_IDENTIFIER) {
      return '/auth/getGoogleInfo';
    } else if (authType === ConstantsClass.FACEBOOK_AUTH_IDENTIFIER) {
      return '/auth/getFacebookInfo';
    }
  }


  public googleInit() {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: '82798158560-b44domiskkgha8gm1l95c951f1r9ulvc.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      }).then(res => {
        this.GoogleAuth = gapi.auth2.getAuthInstance();
      });
    });
  }
}
