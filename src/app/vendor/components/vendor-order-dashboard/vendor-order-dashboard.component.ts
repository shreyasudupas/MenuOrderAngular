import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { AuthService } from 'src/app/common/services/auth.service';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { OrderSignalRService } from 'src/app/common/services/order-signalr.service';
import { OrderModel } from 'src/app/user/components/order-details/order-model'
import { OrderStatus } from 'src/app/user/components/order-details/order-status-enum';
import { environment } from 'src/environments/environment';

const CurrentOrders:string = "Current Orders";
const AllOrders:string = "All Orders";

@Component({
    selector:'vendor-order-dashboard',
    templateUrl:'./vendor-order-dashboard.component.html',
    styleUrls: ['./vendor-order-dashboard.component.scss']
})

export class VendorOrderDasboardComponent extends BaseComponent<any> implements OnInit,OnDestroy {
orders:OrderModel[];
showAllOrderButton:boolean = false;
showOrderType:string = CurrentOrders;
sampleDate:Date = new Date();
viewOrderDetail:OrderModel;
showViewOrderDetail:boolean = false;
vendorId:string;

constructor(private menuService:MenuService,
    public override httpclient:HttpClient,
    public commonBroadcastService:CommonDataSharingService,
    private activatedRoute:ActivatedRoute,
    messageService:MessageService,
    public router:Router,
    public navigation:NavigationService,
    private authService:AuthService,
    private orderSignalRService:OrderSignalRService){
    super(menuService,httpclient,commonBroadcastService,messageService)
}

    ngOnInit(): void {

        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.navigation.startSaveHistory('/vendor-order-dashboard');

        this.orderSignalRServiceInit();

        this.vendorId = this.authService.GetVendorId();
        let currentStatus =[OrderStatus[OrderStatus.OrderPlaced],OrderStatus[OrderStatus.OrderInProgress]];
        this.getOrder(currentStatus);

        // this.orders = [
        //     {   id:'1',
        //         uiOrderNumber:1,
        //         cartId:'',
        //         menuItems:[
        //             { menuId:'1232344',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'idly',price:30,quantity:1,vendorId:'3434435' },
        //             { menuId:'1232345',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'dosa',price:30,quantity:2,vendorId:'3434435' },
        //             { menuId:'1232345',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'dosa',price:30,quantity:2,vendorId:'3434435' },
        //             { menuId:'1232345',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'dosa',price:30,quantity:2,vendorId:'3434435' },
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
        //         orderStatus: OrderStatus.OrderPlaced,
        //         userDetail: {
        //             fullAddress: 'asasas asas aa asa',
        //             latitude: 45.02998,
        //             longitude: 17.9128821,
        //             area: 'Kathregupe',
        //             city: 'Bangalore',
        //             emailId:'shreyasudupas@gmail.com',
        //             phoneNumber: '123344'
        //         },
        //         vendorDetail: {
        //             vendorId: '123',
        //             vendorName:'McDonalds'
        //         }
        //     },
        //     {   id:'2',
        //         uiOrderNumber:2,
        //         cartId:'',
        //         menuItems:[
        //             { menuId:'1232344',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'idly',price:30,quantity:1,vendorId:'3434435' },
        //             { menuId:'1232345',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'dosa',price:30,quantity:2,vendorId:'3434435' }
        //         ],
        //         totalPrice:22,
        //         paymentDetail: {
        //             methodOfDelivery:'Offline',
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
        //             city: 'Bangalore',
        //             emailId:'shreyasudupas@gmail.com',
        //             phoneNumber: '123344'
        //         },
        //         vendorDetail: {
        //             vendorId: '123',
        //             vendorName:'McDonalds'
        //         }
        //     },
        //     {   id:'3',
        //         uiOrderNumber:3,
        //         cartId:'',
        //         menuItems:[
        //             { menuId:'1232344',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'rava idly',price:30,quantity:1,vendorId:'3434435' },
        //             { menuId:'1232345',discount:10,category:'Vegitarian',foodType:'Breakfast',image:{imageFileName:'',imageId:''},itemName:'masala dosa',price:30,quantity:2,vendorId:'3434435' }
        //         ],
        //         totalPrice:22,
        //         paymentDetail: {
        //             methodOfDelivery:'Online',
        //             price: 40,
        //             selectedPayment:'Reward',
        //             paymentSuccess: true
        //         },
        //         orderPlacedDateTime: new Date().toDateString(),
        //         orderStatus: OrderStatus.OrderInProgress,
        //         userDetail: {
        //             fullAddress: 'asasas asas aa asa',
        //             latitude: 45.02998,
        //             longitude: 17.9128821,
        //             area: 'Kathregupe',
        //             city: 'Bangalore',
        //             emailId:'shreyasudupas@gmail.com',
        //             phoneNumber: '123344'
        //         },
        //         vendorDetail: {
        //             vendorId: '123',
        //             vendorName:'McDonalds'
        //         }
        //     }
        // ]
    }

    getCurrentOrders(event:any) {
        let hasClass = event.target.classList.contains('current-order-button-inactive');
        //console.log(hasClass);
        if (hasClass) {
            this.showAllOrderButton = false;
            this.showOrderType = CurrentOrders;
            
            let currentStatus =[OrderStatus[OrderStatus.OrderPlaced],OrderStatus[OrderStatus.OrderInProgress]];
            this.getOrder(currentStatus);
        } 
    }

    getAllOrders(event:any) {
        let hasClass = event.target.classList.contains('all-order-button-inactive');
        //console.log(hasClass);
        if (hasClass) {
           this.showAllOrderButton = true;
           this.showOrderType = AllOrders;

           let allStatus =[OrderStatus[OrderStatus.OrderPlaced],
                OrderStatus[OrderStatus.OrderInProgress],
                OrderStatus[OrderStatus.OrderDone],
                OrderStatus[OrderStatus.OrderReady],
                OrderStatus[OrderStatus.OrderCancelled]];

           this.getOrder(allStatus);
        } 
    }

    getViewOrderDetail(viewOrderDetail:OrderModel) {
        this.showViewOrderDetail = true;
        this.viewOrderDetail = viewOrderDetail;
    }

    getOrder(statuses:string[]) {
        let url = environment.orderService.order + '/list/status';
        let body = {
            vendorId: this.vendorId,
            vendorStatus: statuses
        };

        this.httpclient.post<OrderModel[]>(url,body).subscribe({
            next: result => {
                if(result !== null) {
                    this.orders = result;

                    this.showViewOrderDetail = false;
                }
            },
            error: err => {
                console.log('Error occured in Get Vendor Order By Status', err);
                this.showError('Internal Server Error');
            }
        });
    }

    refreshOrders() {
        //alert(this.showOrderType);
        if(this.showOrderType === CurrentOrders) {
            let currentStatus =[OrderStatus[OrderStatus.OrderPlaced],OrderStatus[OrderStatus.OrderInProgress]];
            this.getOrder(currentStatus);
        } else {
            let allStatus =[OrderStatus[OrderStatus.OrderPlaced],
                OrderStatus[OrderStatus.OrderInProgress],
                OrderStatus[OrderStatus.OrderDone],
                OrderStatus[OrderStatus.OrderReady],
                OrderStatus[OrderStatus.OrderCancelled]];

           this.getOrder(allStatus);
        }
    }

    orderSignalRServiceInit() {
        this.orderSignalRService.startConnection();
        this.orderSignalRService.getLatestOrderInfoListner();

        this.orderSignalRService.getLatestOrder().subscribe({
            next: result => {
                this.orders.unshift(result);
            },
            error: err => {
                console.error("Error has occured: ",err);
            }
        });
    }

    ngOnDestroy() {
        this.orderSignalRService.disconnectHubConnection();
    }
}