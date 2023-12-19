import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { OrderModel } from './order-model';
import { OrderStatus } from './order-status-enum';

@Component({
    selector: 'order-details',
    templateUrl:'./order-details.component.html',
    styleUrls: ['./order-details.component.scss']
})

export class OrderDetailsComponent extends BaseComponent<any> implements OnInit {
orders:OrderModel[];

    constructor(private menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        messageService:MessageService,
        public router:Router,
        public navigation:NavigationService){
        super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.navigation.startSaveHistory('orders/list');

        this.orders = [
            {   id:'',
                cartId:'',
                menuItems:[],
                paymentDetails: {
                    methodOfDelivery:'Online',
                    price: 40,
                    selectedPayment:'Reward',
                    paymentSuccess: true
                },
                orderPlacedDateTime: new Date().toDateString(),
                orderStatus: OrderStatus.OrderAccepted,
                userDetails: {
                    fullAddress: 'asasas asas aa asa',
                    latitude: 45.02998,
                    longitude: 17.9128821,
                    userId: ''
                }
            }
        ]
    }

}