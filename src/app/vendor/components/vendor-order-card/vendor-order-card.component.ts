import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NotificationService } from 'src/app/common/services/notification.service';
import { OrderService } from 'src/app/common/services/order.service';
import { OrderModel } from 'src/app/user/components/order-details/order-model';
import { OrderStatusEnum } from 'src/app/user/components/payment/payment';
import { Notification } from 'src/app/common/components/notification/notification';
import { AuthService } from 'src/app/common/services/auth.service';
import { Role } from 'src/app/common/models/role';

@Component({
    selector: 'vendor-order-card',
    templateUrl: './vendor-order-card.component.html',
    styleUrls: ['./vendor-order-card.component.scss'],
    providers: [MessageService]
})

export class VendorOrderCardComponent implements OnInit {

    @Input()
    data:OrderModel[]=[];

    @Output()
    sendOrderDetail = new EventEmitter<OrderModel>();

    constructor(private orderService: OrderService,
        private messageService: MessageService,
        private notificationService:NotificationService,
        private authService:AuthService) {}

    ngOnInit(): void {
        console.log(this.data);
    }

    //function to call view order component
    viewOrderFnCall(data:OrderModel) {
        this.sendOrderDetail.emit(data);
    }

    //move order to in progress
    acceptOrder(currentorder:OrderModel) {
        currentorder.status = {...currentorder.status,orderInProgress: this.formatDateTime(new Date()) };
        currentorder.currentOrderStatus = OrderStatusEnum[OrderStatusEnum.OrderInProgress];

        //console.log(currentorder);
        this.orderService.updateOrderInformation(currentorder).subscribe({
            next:(orderResponse:OrderModel) => {
                if(orderResponse !== null) {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updated Order ' + orderResponse.uiOrderNumber });
                }
            },
            error:(error) => {
                currentorder.status = {...currentorder.status,orderInProgress:null};
                currentorder.currentOrderStatus = OrderStatusEnum[OrderStatusEnum.OrderPlaced];
                console.log('Error has Occured in Order Update Accpet orders '+ error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured while updating this Order' });
            }
        });
    }

    orderReady(currentorder:OrderModel) {
        currentorder.status = {...currentorder.status,orderReady: this.formatDateTime(new Date()) };
        currentorder.currentOrderStatus = OrderStatusEnum[OrderStatusEnum.OrderReady];

        this.orderService.updateOrderInformation(currentorder).subscribe({
            next:(orderResponse:OrderModel) => {
                if(orderResponse !== null) {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Order ' + orderResponse.uiOrderNumber + ' Ready' });

                    this.notifyUsersOrders(currentorder);
                }
            },
            error:(error) => {
                currentorder.status = {...currentorder.status,orderInProgress:null};
                currentorder.currentOrderStatus = OrderStatusEnum[OrderStatusEnum.OrderPlaced];
                console.log('Error has Occured in Order update order ready '+ error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured while updating this Order' });
            }
        });
    }

    //reject order to order ready
    rejectOrderReady(currentorder:OrderModel) {
        let oldOrderReadyTime = currentorder.status.orderReady;
        currentorder.status = {...currentorder.status,orderReady: null };
        currentorder.currentOrderStatus = OrderStatusEnum[OrderStatusEnum.OrderInProgress];

        //console.log(currentorder);
        this.orderService.updateOrderInformation(currentorder).subscribe({
            next:(orderResponse:OrderModel) => {
                if(orderResponse !== null) {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updated Order ' + orderResponse.uiOrderNumber });
                }
            },
            error:(error) => {
                currentorder.status = {...currentorder.status,orderReady: oldOrderReadyTime };
                currentorder.currentOrderStatus = OrderStatusEnum[OrderStatusEnum.OrderReady];
                console.log('Error has Occured in Order Update Accpet orders '+ error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured while updating this Order' });
            }
        });
    }

    formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    formatDateTime(date: Date): string {
        const formattedDate = this.formatDate(date); // Reuse formatDate function
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${formattedDate} ${hours}:${minutes}:${seconds}`;
    }
    
    notifyUsersOrders(currentOrder:OrderModel) {
        let fromUserId:string = this.authService.getUserInformation().profile['userId'];
        let orderDesciption:string = 'Order Number ' +  currentOrder.uiOrderNumber + ' Ready to Collect from ' + currentOrder.vendorDetail.vendorName;

        let newNotification:Notification = {
            id:'',
            title:'Order is now Ready',
            description: orderDesciption,
            fromUserId: fromUserId,
            toUserId: currentOrder.userDetail.userId,
            link:'',
            role: Role.Vendor,
            read:false,
            recordedTimeStamp: null,
            sendAll: false
        };

        this.notificationService.addNotification(newNotification).subscribe({
            next: (result) => {
                if(result !== null) {
                    console.log('User Notified');
                }
            },
            error: (error) => {
                console.log('Error has occured in Adding the Notification');
            }
        });
    }
}