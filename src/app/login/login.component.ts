import { ConstantsClass } from './../constants';
import { AuthService as InternalAuthService } from './../auth.service';
import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sign } from 'jsonwebtoken';
import { Router } from '@angular/router';
declare const gapi: any;
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular5-social-login';
import { log } from 'util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  GoogleAuth;
  public auth2: any;
  authIdentifier = 'authToken';
  constructor(private http: HttpClient, private router: Router, 
    private zone: NgZone, private authService: AuthService, private internalAuthService: InternalAuthService) {
    this.loadScript();
  }

  public loadScript() {
    const url = 'https://apis.google.com/js/platform.js';
    console.log('preparing to load...');
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  onSignInDbAuth(login, password) {
    this.internalAuthService.loginUsingDbAuth(login, password).subscribe((res) => {
      if (res !== 'Not Authenticated User') {
        localStorage.setItem(this.authIdentifier, `${ConstantsClass.DATABASE_AUTH_IDENTIFIER} ${res}`);
        this.router.navigate(['']);
      }
    });
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

  onSignInFacebookAuth() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (userData) => {
        localStorage.setItem(this.authIdentifier, `${ConstantsClass.FACEBOOK_AUTH_IDENTIFIER} ${userData.token}`);
        this.router.navigate(['']);
      }
    );
  }

  public onSignInGoogleAuth() {
    this.GoogleAuth.signIn().then(() => {
      const authToken = this.GoogleAuth.currentUser.get()['Zi']['id_token'];
      localStorage.setItem(this.authIdentifier, `${ConstantsClass.GOOGLE_AUTH_IDENTIFIER} ${authToken}`);
      this.zone.run(() => this.router.navigate(['']));
    });
  }

  ngAfterViewInit() {
    this.googleInit();
  }
}
