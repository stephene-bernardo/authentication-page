import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sign } from 'jsonwebtoken';
import { Router } from '@angular/router';
declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  public auth2: any;
  constructor(private http: HttpClient, private router: Router, private zone: NgZone) {
    this.loadScript();
  }

  public loadScript() {
    const url = 'https://apis.google.com/js/platform.js';
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
}

  onSignIn(login, password) {
    const httpOptions = {
      responseType: 'text' as 'text'
    };
    this.http.post('http://localhost:3000/auth', { username: login, password: password },
      httpOptions).subscribe((res) => {

        if (res !== 'Not Authenticated User') {

          localStorage.setItem('authToken', `dbauth ${res}`);
          this.router.navigate(['']);
        }
      });
  }

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '82798158560-b44domiskkgha8gm1l95c951f1r9ulvc.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }
  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        localStorage.setItem('authToken', `googleAuth ${googleUser.getAuthResponse().id_token}`);
        this.zone.run(() => this.router.navigate(['']));
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }
  ngAfterViewInit() {
    this.googleInit();
  }

}
