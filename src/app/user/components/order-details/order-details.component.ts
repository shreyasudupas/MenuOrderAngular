import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { takeWhile, tap, timer } from 'rxjs';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { AuthService } from 'src/app/common/services/auth.service';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { environment } from 'src/environments/environment';
import { OrderStatusEnum } from '../payment/payment';
import { OrderDisplayModel, IOrderStatusModel, OrderModel } from './order-model';

@Component({
    selector: 'order-details',
    templateUrl:'./order-details.component.html',
    styleUrls: ['./order-details.component.scss']
})

export class OrderDetailsComponent extends BaseComponent<OrderModel> implements OnInit {
orders:OrderDisplayModel[];
userId:string;
events: any[];
//counter = 40;

    constructor(private menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        messageService:MessageService,
        public router:Router,
        public navigation:NavigationService,
        private authService:AuthService){
        super(menuService,httpclient,commonBroadcastService,messageService)

        this.events = [
            { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
            { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
            { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
            { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
        ];
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.navigation.startSaveHistory('orders/list');

        // this.orders = [
        //     {   id:'12345566',
        //         cartId:'',
        //         menuItems:[
        //             { menuId:'1232344',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'idly',price:30,quantity:1,vendorId:'3434435' },
        //             { menuId:'1232345',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'dosa',price:30,quantity:2,vendorId:'3434435' }
        //         ],
        //         totalPrice:22,
        //         paymentDetail: {
        //             methodOfDelivery:'Online',
        //             price: 40,
        //             selectedPayment:'Reward',
        //             paymentSuccess: true
        //         },
        //         orderPlacedDateTime: new Date().toDateString(),
        //         orderStatus: OrderStatus.OrderAccepted,
        //         userDetail: {
        //             fullAddress: 'asasas asas aa asa',
        //             latitude: 45.02998,
        //             longitude: 17.9128821,
        //             area: 'Kathregupe',
        //             city: 'Bangalore'
        //         },
        //         vendorDetail: {
        //             vendorId: '123',
        //             vendorName:'McDonalds'
        //         }
        //     },
        //     {   id:'12345566',
        //         cartId:'',
        //         menuItems:[
        //             { menuId:'1232344',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'idly',price:30,quantity:1,vendorId:'3434435' },
        //             { menuId:'1232345',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'dosa',price:30,quantity:2,vendorId:'3434435' }
        //         ],
        //         totalPrice:22,
        //         paymentDetail: {
        //             methodOfDelivery:'Online',
        //             price: 40,
        //             selectedPayment:'Reward',
        //             paymentSuccess: true
        //         },
        //         orderPlacedDateTime: new Date().toDateString(),
        //         orderStatus: OrderStatus.OrderDone,
        //         userDetail: {
        //             fullAddress: 'asasas asas aa asa',
        //             latitude: 45.02998,
        //             longitude: 17.9128821,
        //             area: 'Kathregupe',
        //             city: 'Bangalore'
        //         },
        //         vendorDetail: {
        //             vendorId: '123',
        //             vendorName:'McDonalds'
        //         }
        //     }
        // ]
        this.userId = this.authService.getUserInformation()?.profile['userId'];

        this.getOrdersBasedOnUserId(this.userId);

        //this.orderPlacedTimer();
    }

    getOrdersBasedOnUserId(userId:string) {
        this.baseUrl = environment.orderService.order;
        this.action = 'list';
        let param = new HttpParams().set('userId',userId);

        this.ListItems(param).subscribe({
            next: result => {
                if(result !== null) {
                    this.orders = result.map((order,index)=> {

                        let orderMap:OrderDisplayModel = {
                            id: order.id,
                            cartId: order.cartId,
                            menuItems: order.menuItems,
                            totalPrice: order.totalPrice,
                            paymentDetail: order.paymentDetail,
                            userDetail: order.userDetail,
                            status: {
                                orderPlaced: order.status.orderPlaced,
                                orderInProgress: order.status.orderInProgress,
                                orderDone: order.status.orderDone,
                                orderReady: order.status.orderReady,
                                orderCancelled: order.status.orderCancelled
                            },
                            vendorDetail: order.vendorDetail,
                            uiOrderNumber: order.uiOrderNumber,
                            isFastCancelButton: (order.status.orderPlaced !== null && order.status.orderInProgress === null) ? true: false, //remaining status no need to show fast cancel button
                            counter: 0,
                            createdDate: order.createdDate,
                            orderCancelledReason: order.orderCancelledReason,
                            statusTimeLineDetails: [
                                { statusName: 'Order Placed',icon: 'pi pi-shopping-cart',placedDate: order.status.orderPlaced ,iconColor: '#9C27B0'},
                                { statusName: 'Order InProgress',icon: 'pi pi-cog',placedDate: order.status.orderInProgress,iconColor:  '#673AB7'},
                                { statusName: 'Order Ready',icon: 'pi pi-thumbs-up',placedDate: order.status.orderDone,iconColor: '#FF9800'},
                                { statusName: 'Order Done',icon: 'pi pi pi-check',placedDate: order.status.orderDone,iconColor: '#4cbb17' },
                                { statusName: 'Order Cancelled',icon: 'pi pi-times',placedDate: order.status.orderCancelled,iconColor: '#e13b31' }
                            ],
                            currentOrderStatus: order.currentOrderStatus
                        };

                        this.calculateIfOrderIsUnder40Seconds(new Date(order.status.orderPlaced),orderMap);
                        this.secondsRemaining(index);
                        
                        return orderMap;
                    });

                    //console.log(this.orders);
                } else {
                    this.showError('Error occured in the Server, please try again later.');
                }
                
            },
            error: err => {
                console.log('Error occured in getting Order List ',err);
            }
        });
    }

    secondsRemaining(index) {
        timer(1000,1000).pipe(
            takeWhile( () =>  this.orders[index].counter > 0 ),
            tap(() => this.orders[index].counter--)
        ).subscribe(()=>{
            if(this.orders[index].counter === 0) {
                this.orders[index].isFastCancelButton = false;
            }
        });
    }

    calculateIfOrderIsUnder40Seconds(orderPlacedDateTime:Date,orderModel:OrderDisplayModel) {
        let currentDate = new Date();
        let diffInTime = currentDate.getTime() - orderPlacedDateTime.getTime();

        //convert to seconds
        let diffInSec = diffInTime * 0.001;
        diffInSec = Math.round(diffInSec);

        //40 sec is what currently we are checking the threshold
        if(diffInSec <= 60 && diffInSec >=0) {
            let counterThreshold = 40;
            orderModel.counter = counterThreshold - diffInSec;
        } else {
            orderModel.isFastCancelButton = false;
            orderModel.counter = 0; //date is passed 40 sec threshold so no fast cancel
        }
    }

    getCurrentStatus(orderStatus:IOrderStatusModel) {
        if(orderStatus.orderPlaced !== null && orderStatus.orderInProgress === null && orderStatus.orderCancelled === null) {
            return OrderStatusEnum[OrderStatusEnum.OrderPlaced];
        } else if(orderStatus.orderReady === null && orderStatus.orderCancelled !== null) {
            return OrderStatusEnum[OrderStatusEnum.OrderCancelled];
        } else if(orderStatus.orderReady === null) {
            return OrderStatusEnum[OrderStatusEnum.OrderInProgress];
        } else if(orderStatus.orderDone === null) {
            return OrderStatusEnum[OrderStatusEnum.OrderReady];
        } else if(orderStatus.orderCancelled == null) {
            return OrderStatusEnum[OrderStatusEnum.OrderDone];
        } else {
            return OrderStatusEnum[OrderStatusEnum.OrderCancelled];
        }
    }

    validateIfClassNeedsSpinner(status:string) {
        if(status === 'OrderDone' || status === 'OrderCancelled') {
            return 'pi pi-cog';
        } else {
            return 'pi pi-spin pi-cog';
        }
    }
}