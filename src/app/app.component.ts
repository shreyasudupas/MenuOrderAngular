import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './common/services/auth.service';
import { SignalrService } from './common/services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isUserAuthenticated:boolean = false;
  title="app";

  constructor(public _authService: AuthService,public route:Router,public signalrService:SignalrService) {
    
    this._authService.loginChanged.subscribe(userAuthenticated => {
      this.isUserAuthenticated = userAuthenticated;
  });
   }

  ngOnInit(){
     this._authService.isAuthenticated().then((value) =>{
       this.isUserAuthenticated = value;
     });
  }

  public login = () => {
    this._authService.login();
  }

  public logout = () => {
    this.signalrService.disconnectNotification();
    this._authService.logout();
  }

}
