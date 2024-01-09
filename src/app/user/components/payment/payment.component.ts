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
import { environment } from 'src/environments/environment';
import { CartInformation } from '../cart-component/cart-information';
import { PaymentModel } from './payment';

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
    displayDefaultPaymentPage:boolean;
    showOverlay:boolean= false;
    isPhoneNumberConfirmed:boolean;

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

        this.baseUrl = environment.sagaService.payment;
        this.action = null;

        this.userId = this.authService.getUserInformation().profile['userId'];

        this.paymentForm = this.fb.group({
            totalPrice: [0,Validators.required],
            selectedPayment:['',Validators.required],
            fulladdress: [{value:'',disabled:true},Validators.required],
            city:[{value:'',disabled:true},Validators.required],
            area:[{value:'',disabled:true},Validators.required],
            latitude: [0,Validators.required],
            longitude: [0,Validators.required],
            methodOfDelivery: ['',Validators.required],
            phoneNumber: [{value:'',disabled:true},Validators.required],
            emailId: [{value:'',disabled:true},Validators.required]
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
            },
            fetchPolicy: "network-only"
        }).valueChanges.subscribe({
            next: result => {
                if(result.data.userInformation !== null) {
                    let userInfo = result.data.userInformation;
                    this.rewardPoints = userInfo.points;
                    this.isPhoneNumberConfirmed = userInfo.phoneNumberConfirmed;

                    this.paymentForm.patchValue({
                        phoneNumber: userInfo.phoneNumber,
                        emailId: userInfo.email
                    });                
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

                        if(this.cartInformation.menuItems.length > 0 ) {
                            this.displayDefaultPaymentPage = false;
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
                        } else {
                            this.displayEmptyPaymentPage();
                        }
                    } else {
                        this.displayEmptyPaymentPage();
                    }
                }
            },
            error: err => {
                console.log('Error occured in getting the cart information ',err);
                this.showError('Error in Cart serivice');
            }
        });
    }


    displayEmptyPaymentPage() {
        this.displayDefaultPaymentPage = true;
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
            } else if(this.paymentForm.controls['phoneNumber'].value === '' || this.isPhoneNumberConfirmed === false) {
                this.paymentForm.controls['phoneNumber'].setErrors({invalid:true,message:'*Phone Number not confirmed'});
            } else {

                //check if reward is within the price
                if(this.paymentForm.controls['totalPrice'].value >= this.rewardPoints) {
                    this.showError('Not Enough Reward points to buy the items');
                    return;
                }

                let body : PaymentModel= {
                    userId: this.cartInformation.userId,
                    userAddress: {
                        fullAddress: this.paymentForm.controls['fulladdress'].value,
                        latitude: this.paymentForm.controls['latitude'].value,
                        longitude: this.paymentForm.controls['longitude'].value,
                        city: this.paymentForm.controls['city'].value,
                        area: this.paymentForm.controls['area'].value,
                        emailId: this.paymentForm.controls['emailId'].value,
                        phoneNumber: this.paymentForm.controls['phoneNumber'].value,
                    },
                    cartInfo: {
                        cartId: this.cartInformation.id,
                        menuItems: this.cartInformation.menuItems
                    },
                    paymentInfo: {
                        totalPrice: this.paymentForm.controls['totalPrice'].value,
                        selectedPayment: this.paymentForm.controls['selectedPayment'].value,
                        methodOfDelivery: this.paymentForm.controls['methodOfDelivery'].value,
                        paymentSuccess: true
                        
                    }
                };

                //console.log(body);
                this.showOverlay = true;
                this.paymentApiCalling(body);
            }
        } else {
            console.log(this.paymentForm.errors);
        }
    }

    private paymentApiCalling(paymentModel:any) {
        this.Create(paymentModel).subscribe({
            next: result => {
                //console.log(result);
                if(result.isSuccess === false)
                {
                    this.showError('Error has occured in the Server');
                }
                else {
                    this.cartInformationService.modifyItemsInCart(0);
                    this.router.navigateByUrl('/user/food');
                }
                this.showOverlay = false;
            },
            error: err => {
                console.log('Error occrued in Payment API',err);
                this.showOverlay = false;
            }
        });
    }
}