import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sign } from 'jsonwebtoken';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit() {
  }

  onSignIn(login, password) {

    const httpOptions = {
      responseType: 'text' as 'text'
    };
    this.http.post('http://localhost:3000/auth', { username: login, password: password }, httpOptions).subscribe((res) => {
        console.log(res)
      });
  }

}
