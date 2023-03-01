import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class SignalrService {

  constructor(private authService:AuthService){
  }

  public data!: any;
  private hubConnection!: signalR.HubConnection;
  public connectionId:string;

    public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('https://localhost:5004/hubs/notification',{ 
                                accessTokenFactory: ()=> this.authService.getToken()
                              })
                              .build();
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .then(() => this.getConnectionId())
        //.then(()=> this.addNotificationCountListener())
        .catch(err => console.log('Error while starting connection: ' + err));

    }

    private getConnectionId = () => {
      this.hubConnection.invoke('getconnectionid')
      .then((data) => {
        console.log(data);
        this.connectionId = data;
      });
    }
    
    public addNotificationCountListener = () => {
      this.hubConnection.on('SendUserNotification', (data) => {
        this.data = data;
        console.log("Recieved Notification" + this.data);
      });
    }

    public disconnectHubConnection = () => {
      this.hubConnection.stop().then(()=>console.log('connection closed')).catch(err=>console.log(err));
    }
}