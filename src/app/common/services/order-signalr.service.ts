import { Injectable } from '@angular/core';
import { OrderModel, OrderSignalRSubjectModel } from 'src/app/user/components/order-details/order-model';
import * as signalR from "@microsoft/signalr"
import { AuthService } from './auth.service';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';

const CONNECTIONID:string = 'getconnectionid';
const PUBLISHLATEST_ORDERINFO:string = 'PublishLatestOrderInformation';
const PUBLISHCANCEL_ORDER:string = 'PublishCancelOrder';
const ADD = 'Add';
const CANCEL = 'Cancel';

@Injectable()

export class OrderSignalRService {
    orderConnectionId:string;
    order:Subject<OrderSignalRSubjectModel> = new Subject<OrderSignalRSubjectModel>();
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
          this.order.next({
            orderModel: orderInfo,
            operation: ADD
          });
        });
      }

      public getLatestOrder(): Observable<OrderSignalRSubjectModel> {
        return this.order.asObservable();
      }

      public publishCancelOrderListner() {
        this.orderHubConnection.on(PUBLISHCANCEL_ORDER,(orderInfo)=> {
          this.order.next({
            operation: CANCEL,
            orderModel: orderInfo
          });
        });
      }
}