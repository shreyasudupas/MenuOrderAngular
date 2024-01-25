import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { AuthService } from './auth.service';

const SEND_USERNOTIFICATION:string = 'SendUserNotification';
const CONNECTIONID:string = 'getconnectionid';
const SENDTO_ALLNOTIFICATION:string = 'SendToAllNotification';

@Injectable({
  providedIn: 'root'
})

export class NotificationSignalrService {

  constructor(private authService:AuthService){
  }

  public notificationCount: any = 0;
  private notificationHubConnection!: signalR.HubConnection;
  public connectionId:string;

    public startConnection = () => {
      this.notificationHubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('https://localhost:5008/notificationHub',{ 
                                accessTokenFactory: ()=> this.authService.getToken()
                              })
                              .build();

      this.notificationHubConnection
        .start()
        .then(() => console.log('Connection started'))
        .then(() => this.getConnectionId())
        //.then(()=> this.addNotificationCountListener())
        .catch(err => console.log('Error while starting connection: ' + err));

    }

    private getConnectionId = () => {
      this.notificationHubConnection.invoke(CONNECTIONID)
      .then((connectionId) => {
        console.log(connectionId);
        this.connectionId = connectionId;
      });
    }
    
    public addNotificationCountListener = () => {
      this.notificationHubConnection.on(SEND_USERNOTIFICATION, (data) => {
        this.notificationCount = data;
        //console.log("Recieved Notification" + this.notificationCount);
      });
    }

    public getAllCountListener = () => {
      this.notificationHubConnection.on(SENDTO_ALLNOTIFICATION, () => {
        this.notificationCount = this.notificationCount + 1;
        //console.log("Recieved Notification" + this.notificationCount);
      });
    }

    public disconnectHubConnection = () => {
      this.notificationHubConnection.stop().then(()=>console.log('connection closed')).catch(err=>console.log(err));
    }
}