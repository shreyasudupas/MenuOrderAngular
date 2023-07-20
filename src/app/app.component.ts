import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './common/services/auth.service';
import { ErrorHandlerSerivice } from './common/services/error-handler.service';
import { SignalrService } from './common/services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isUserAuthenticated:boolean = false;
  title="app";
  errorTitle:string;
  errorMessage:string;
  displayErrorDialog:boolean = false;

  constructor(
    public _authService: AuthService,
    public route:Router,
    public signalrService:SignalrService,
    private errorHandlerSerivice:ErrorHandlerSerivice) {
    
    this._authService.loginChanged.subscribe(userAuthenticated => {
      this.isUserAuthenticated = userAuthenticated;
  });
   }

  ngOnInit(){
     this._authService.isAuthenticated().then((value) =>{
       this.isUserAuthenticated = value;
     });

     this.errorHandlerSerivice.errorChangeDetection().subscribe({
      next: result => {
        if(result !== null){
          this.displayErrorDialog = true;
          this.errorMessage = result.errorMessage;
          this.errorTitle = result.errorTitle;
        }
      }
     });
  }

  public login = () => {
    this._authService.login();
  }

  public logout = () => {
    this.signalrService.disconnectHubConnection();
    this._authService.logout();
  }

}
