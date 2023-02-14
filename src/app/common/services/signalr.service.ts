import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"

@Injectable({
  providedIn: 'root'
})

export class SignalrService {
  public data!: any;
  private hubConnection!: signalR.HubConnection;

    public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('https://localhost:5004/notification')
                              .build();
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err))
    }
    
    public addNotificationCountListener = () => {
      this.hubConnection.on('sendUserNotificationCount', (data) => {
        this.data = data;
        console.log("Count of notification" + this.data);
      });
    }
}