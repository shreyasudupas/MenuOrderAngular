import { Injectable } from '@angular/core';
import { OrderModel } from 'src/app/user/components/order-details/order-model';
import * as signalR from "@microsoft/signalr"
import { AuthService } from './auth.service';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';

const CONNECTIONID:string = 'getconnectionid';
const PUBLISHLATEST_ORDERINFO:string = 'PublishLatestOrderInformation';

@Injectable()

export class OrderSignalRService {
    orderConnectionId:string;
    order:Subject<OrderModel> = new Subject<OrderModel>();
    private orderHubConnection: signalR.HubConnection;

    constructor(private authService:AuthService) {}

    public startConnection = () => {
        this.orderHubConnection = new signalR.HubConnectionBuilder()
                                .withUrl('https://localhost:5008/orderHub',{ 
                                  accessTokenFactory: ()=> this.authService.getToken()
                                })
                                .withAutomaticReconnect()
                                .build();
  
        this.orderHubConnection
          .start()
          //.then(() => console.log('Connection started'))
          .then(() => this.getConnectionId())
          .catch(err => console.log('Error while starting order connection: ' + err));

      }

      private getConnectionId = () => {
        this.orderHubConnection.invoke(CONNECTIONID)
        .then((connectionId) => {
          console.log('order connection Id' + connectionId);
          this.orderConnectionId = connectionId;
        });
      }

      public disconnectHubConnection = () => {
        this.orderHubConnection.stop().then(()=>console.log('order connection closed'))
        .catch(err=>console.log(err));
      }

      public getLatestOrderInfoListner() {
        this.orderHubConnection.on(PUBLISHLATEST_ORDERINFO,(orderInfo)=> {
          //console.log('Item Recieved ' + orderInfo);
          this.order.next(orderInfo);
        });
      }

      public getLatestOrder(): Observable<OrderModel> {
        return this.order.asObservable();
      }
}