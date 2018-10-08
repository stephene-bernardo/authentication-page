import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy, OnInit {
  name = '';
  subscription: Subscription;
  userInfo$: Observable<any>;

  constructor(private http: HttpClient, private router: Router, private zone: NgZone) {
    this.subscription = Observable.fromEvent(document, 'keypress').subscribe(e => {
      if (e['key'] === ' ') {
        localStorage.clear();
          this.router.navigate(['/login']);
      }
    });
  }

  async ngOnInit() {
    const storeAuthToken = localStorage.getItem('authToken').split(' ');
    if (storeAuthToken) {
      const headers = new HttpHeaders({ 'token': storeAuthToken[1] });
      if (storeAuthToken[0] === 'dbauth') {
        this.userInfo$ = await this.http.get('http://localhost:3000/getUserInfo', { headers: headers });
      } else if (storeAuthToken[0] === 'googleAuth') {
        this.userInfo$ = await this.http.get('http://localhost:3000/auth/getGoogleInfo', { headers: headers });
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
