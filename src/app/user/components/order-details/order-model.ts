import { CartMenuItem } from "../cart-component/cart-information";
import {  UserOrderDetailsModel } from "../payment/payment";

export interface OrderModel {
id:string;
cartId:string;
menuItems:CartMenuItem[];
totalPrice:number;
paymentDetail:IOrderPaymentModel;
userDetail:UserOrderDetailsModel;
uiOrderNumber:number;
status:IOrderStatusModel;
vendorDetail:IVendorDetailModel;
orderCancelledReason:string;
createdDate:string;
}

interface IVendorDetailModel {
vendorId:string;
vendorName:string;
}

interface IOrderPaymentModel {
price:number;
selectedPayment:string;
methodOfDelivery:string;
paymentSuccess:boolean;
}

export interface IOrderStatusModel{
    orderPlaced:string;
    orderInProgress:string;
    orderReady:string;
    orderDone:string;
    orderCancelled:string;
}

export class OrderDisplayModel implements OrderModel {
    id: string;
    cartId: string;
    menuItems: CartMenuItem[];
    totalPrice: number;
    paymentDetail: IOrderPaymentModel;
    userDetail: UserOrderDetailsModel;
    status: IOrderStatusModel;
    vendorDetail: IVendorDetailModel;
    uiOrderNumber: number;
    orderCancelledReason: string;
    createdDate: string;
    isFastCancelButton?:boolean;
    counter?:number;
    currentStatus:string;
    currentStatusDate?:string;
    statusTimeLineDetails?:statusTimeLineDetails[];
}

export interface statusTimeLineDetails {
    statusName:string;
    placedDate:string;
    icon:string;
    iconColor: string;
}