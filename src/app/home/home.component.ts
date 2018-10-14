import { AuthService } from './../auth.service';
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

  constructor(private http: HttpClient, private router: Router, private zone: NgZone, private authService: AuthService) {
    this.subscription = Observable.fromEvent(document, 'keypress').subscribe(e => {
      if (e['key'] === ' ') {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  async ngOnInit() {
    const storeAuthToken = localStorage.getItem('authToken');
    this.userInfo$ = await this.authService.getUserInfo(storeAuthToken);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
