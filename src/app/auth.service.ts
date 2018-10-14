import { ConstantsClass } from './constants';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) { }

  loginUsingDbAuth(login: string, password: string): Observable<any> {
    const httpOptions = {
      responseType: 'text' as 'text'
    };
    return this.http.post(`${this.baseUrl}/auth`, { username: login, password: password }, httpOptions);
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

}
