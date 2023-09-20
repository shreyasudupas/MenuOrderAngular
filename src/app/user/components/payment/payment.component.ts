import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { GET_USER_INFO, UserInfoResponse, UserInfoVariable } from 'src/app/common/graphQl/querries/getUserInformationsQuery';
import { AuthService } from 'src/app/common/services/auth.service';
import { CartInformationSerivice } from 'src/app/common/services/cart-information.service';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { LocationService } from 'src/app/common/services/location.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { CartInformation } from '../cart-component/cart-information';

@Component({
    selector: 'payment-dashboard',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})

export class PaymentDashboardComponent extends BaseComponent<any> implements OnInit {

    selectedPayment:any;
    paymentOptions:any[] = [
        { imgSrc:'assets/Logo/mastercard.png', alt:'Master Card', class: 'payment-image', value:'MasterCard' },
        { imgSrc:'assets/Logo/visa.png', alt:'Visa Card', class: 'payment-image', value:'VisaCard' },
        { imgSrc:'assets/Logo/upi_payment.jpg', alt:'UPI Payment', class: 'payment-image', value:'UPI' },
        { imgSrc:'assets/Logo/rewardpoints.png', alt:'Reward Payment', class: 'payment-image', value:'Reward' }
    ];
    userId:string;
    rewardPoints:number = 0;
    cartInformation:CartInformation;
    totalPrice:number = 0;
    totalPriceToPay:number;
    discount:number = 0;
    paymentForm:FormGroup;
    deliveryModes:any[] = [
        { key:'Online', value: 'Online' },
        { key:'Collect Yourself', value: 'Offline' }
    ];

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        messageService: MessageService,
        private navigation:NavigationService,
        private cartInformationService:CartInformationSerivice,
        private confirmationService: ConfirmationService,
        private apollo:Apollo,
        private authService:AuthService,
        private locationService:LocationService,
        private fb:FormBuilder){
            super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.userId = this.authService.getUserInformation().profile['userId'];

        this.paymentForm = this.fb.group({
            totalPrice: [0,Validators.required],
            selectedPayment:['',Validators.required],
            fulladdress: [{value:'',disabled:true},Validators.required],
            city:[{value:'',disabled:true},Validators.required],
            area:[{value:'',disabled:true},Validators.required],
            latitude: [0,Validators.required],
            longitude: [0,Validators.required],
            methodOfDelivery: ['',Validators.required]
        });

        this.getCartInformation();
        this.getUserLocation();
        this.selectedPaymentChange();
    }

    selectedPaymentChange() {
        //console.log(event);

        this.paymentForm.get('selectedPayment').valueChanges.subscribe({
            next: result => {
                //console.log(result);
                if(result === 'Reward') {
                    this.getUserInformation();
                    this.selectedPayment = 'Reward'
                } else {
                    this.selectedPayment = '';
                }
            }
        });
    }

    getUserInformation() {
        this.apollo.watchQuery<UserInfoResponse,UserInfoVariable>({
            query: GET_USER_INFO,
            variables: {
                userId: this.userId
            }
        }).valueChanges.subscribe({
            next: result => {
                if(result.data.userInformation !== null) {
                    let cartInfo = result.data.userInformation;
                    this.rewardPoints = cartInfo.points;
                }
            },
            error: err => {
                console.log('Error in Getting the user info ',err);
                this.showError('Error getting User Information');
            }
        });
    }

    getCartInformation() {
        this.cartInformationService.getUserCartInformationFromAPI().subscribe({
            next: result => {
                if(result !== null) {
                    this.cartInformation = result;

                    if(this.cartInformation !== null ) {
                        this.totalPrice = this.cartInformation.menuItems.reduce(function(prevValue,currentValue){
                            return prevValue + currentValue.price;
                        },0);

                        let discountPercentage = this.cartInformation.menuItems.reduce(function(prevValue,currentValue){
                            return prevValue + currentValue.discount;
                        },0);

                        if(discountPercentage > 0) {
                            //discounted amount
                            this.discount = (this.totalPrice * discountPercentage)/100;
                            this.totalPriceToPay = this.totalPrice * ( 1 - discountPercentage/100 );
                        } else {
                            this.totalPriceToPay = this.totalPrice;
                        }

                        this.paymentForm.patchValue({
                            totalPrice: this.totalPriceToPay
                        });
                    }
                }
            },
            error: err => {
                console.log('Error occured in getting the cart information ',err);
                this.showError('Error in Cart serivice');
            }
        });

    }

    getUserLocation() {
        this.locationService.getUserLocationUpdate().subscribe({
            next: result => {
                if(result !== undefined) {

                    this.paymentForm.patchValue({
                        fulladdress: result.displayName,
                        city: result.city,
                        area: result.area,
                        latitude: result.latitude,
                        longitude: result.longitude
                    });
                }
            },
            error: err => {
                console.log('Error in getting User location ',err);
            }
        });
    }

    paymentSubmision() {
        if(this.paymentForm.valid){
            if(this.paymentForm.controls['selectedPayment'].value !== 'Reward') {
                this.paymentForm.controls['selectedPayment'].setErrors({invalid: true,message:'*Please select Rewards since its only active'});
            } else {

                //check if reward is within the price
                if(this.paymentForm.controls['totalPrice'].value >= this.rewardPoints) {
                    this.showError('Not Enough Reward points to buy the items');
                    return;
                }

                let body = {
                    userAddress: {
                        fulladdress: this.paymentForm.controls['fulladdress'].value,
                        city: this.paymentForm.controls['city'].value,
                        area: this.paymentForm.controls['area'].value,
                        latitude: this.paymentForm.controls['latitude'].value,
                        longitude: this.paymentForm.controls['longitude'].value,
                    },
                    cartInfo: {
                        menuItems: this.cartInformation.menuItems,
                        cartId: this.cartInformation.id
                    },
                    paymentInfo: {
                        totalPrice: this.paymentForm.controls['totalPrice'].value,
                        selectedPayment: this.paymentForm.controls['selectedPayment'].value,
                        methodOfDelivery: this.paymentForm.controls['methodOfDelivery'].value,
                        reward: this.rewardPoints
                    },
                    userId: this.cartInformation.userId
                };

                console.log(body);
            }
        } else {
            console.log(this.paymentForm.errors);
        }
    }
}