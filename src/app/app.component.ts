import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  onSignIn(login, password) {
    console.log(login + "   "+ password )
    console.log("sign in")
  }
}
