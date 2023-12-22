import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { AuthService } from 'src/app/common/services/auth.service';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { environment } from 'src/environments/environment';
import { OrderModel } from './order-model';

@Component({
    selector: 'order-details',
    templateUrl:'./order-details.component.html',
    styleUrls: ['./order-details.component.scss']
})

export class OrderDetailsComponent extends BaseComponent<any> implements OnInit {
orders:OrderModel[];
userId:string;

    constructor(private menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        messageService:MessageService,
        public router:Router,
        public navigation:NavigationService,
        private authService:AuthService){
        super(menuService,httpclient,commonBroadcastService,messageService)
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
    }

    getOrdersBasedOnUserId(userId:string) {
        this.baseUrl = environment.orderService.order;
        this.action = 'list';
        let param = new HttpParams().set('userId',userId);

        this.ListItems(param).subscribe({
            next: result => {
                if(result !== null) {
                    this.orders = result;
                } else {
                    this.showError('Error occured in the Server, please try again later.');
                }
                
            },
            error: err => {
                console.log('Error occured in getting Order List ',err);
            }
        });
    }

}