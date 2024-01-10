import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { OrderModel } from 'src/app/user/components/order-details/order-model'
import { OrderStatus } from 'src/app/user/components/order-details/order-status-enum';

@Component({
    selector:'vendor-order-dashboard',
    templateUrl:'./vendor-order-dashboard.component.html',
    styleUrls: ['./vendor-order-dashboard.component.scss']
})

export class VendorOrderDasboardComponent extends BaseComponent<any> implements OnInit {
orders:OrderModel[];
showAllOrderButton:boolean = false;
showOrderType:string = 'Current Orders';

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

        this.navigation.startSaveHistory('/vendor-order-dashboard');

        this.orders = [
            {   id:'12345566',
                cartId:'',
                menuItems:[
                    { menuId:'1232344',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'idly',price:30,quantity:1,vendorId:'3434435' },
                    { menuId:'1232345',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'dosa',price:30,quantity:2,vendorId:'3434435' }
                ],
                totalPrice:22,
                paymentDetail: {
                    methodOfDelivery:'Online',
                    price: 40,
                    selectedPayment:'Reward',
                    paymentSuccess: true
                },
                orderPlacedDateTime: new Date().toDateString(),
                orderStatus: OrderStatus.OrderAccepted,
                userDetail: {
                    fullAddress: 'asasas asas aa asa',
                    latitude: 45.02998,
                    longitude: 17.9128821,
                    area: 'Kathregupe',
                    city: 'Bangalore',
                    emailId:'shreyasudupas@gmail.com',
                    phoneNumber: '123344'
                },
                vendorDetail: {
                    vendorId: '123',
                    vendorName:'McDonalds'
                }
            },
            {   id:'12345566',
                cartId:'',
                menuItems:[
                    { menuId:'1232344',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'idly',price:30,quantity:1,vendorId:'3434435' },
                    { menuId:'1232345',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'dosa',price:30,quantity:2,vendorId:'3434435' }
                ],
                totalPrice:22,
                paymentDetail: {
                    methodOfDelivery:'Online',
                    price: 40,
                    selectedPayment:'Reward',
                    paymentSuccess: true
                },
                orderPlacedDateTime: new Date().toDateString(),
                orderStatus: OrderStatus.OrderDone,
                userDetail: {
                    fullAddress: 'asasas asas aa asa',
                    latitude: 45.02998,
                    longitude: 17.9128821,
                    area: 'Kathregupe',
                    city: 'Bangalore',
                    emailId:'shreyasudupas@gmail.com',
                    phoneNumber: '123344'
                },
                vendorDetail: {
                    vendorId: '123',
                    vendorName:'McDonalds'
                }
            },
            {   id:'12345566',
                cartId:'',
                menuItems:[
                    { menuId:'1232344',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'idly',price:30,quantity:1,vendorId:'3434435' },
                    { menuId:'1232345',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'dosa',price:30,quantity:2,vendorId:'3434435' }
                ],
                totalPrice:22,
                paymentDetail: {
                    methodOfDelivery:'Online',
                    price: 40,
                    selectedPayment:'Reward',
                    paymentSuccess: true
                },
                orderPlacedDateTime: new Date().toDateString(),
                orderStatus: OrderStatus.OrderDone,
                userDetail: {
                    fullAddress: 'asasas asas aa asa',
                    latitude: 45.02998,
                    longitude: 17.9128821,
                    area: 'Kathregupe',
                    city: 'Bangalore',
                    emailId:'shreyasudupas@gmail.com',
                    phoneNumber: '123344'
                },
                vendorDetail: {
                    vendorId: '123',
                    vendorName:'McDonalds'
                }
            }
        ]
    }

    getCurrentOrders(event:any) {
        let hasClass = event.target.classList.contains('current-order-button-inactive');
        //console.log(hasClass);
        if (hasClass) {
            this.showAllOrderButton = false;
            this.showOrderType = "Current orders"
        } 
    }

    getAllOrders(event:any) {
        let hasClass = event.target.classList.contains('all-order-button-inactive');
        //console.log(hasClass);
        if (hasClass) {
           this.showAllOrderButton = true;
           this.showOrderType = "All Orders"
        } 
    }

}