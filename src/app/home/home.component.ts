import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy{
  name = '';
  subscription: Subscription;
  constructor(private http: HttpClient, private router: Router) {
    this.subscription = Observable.fromEvent(document, 'keypress').subscribe(e => {
      if (e['key'] === ' ') {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
    const storeAuthToken = localStorage.getItem('authToken');
    if (storeAuthToken) {
      const headers = new HttpHeaders({ 'token': storeAuthToken });
      http.get('http://localhost:3000/getUserInfo', { headers: headers }).subscribe(res => {
        if (res) {
          this.name = res['name'];
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
