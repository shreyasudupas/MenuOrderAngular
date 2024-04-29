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
currentOrderStatus:string;
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
orderCancelled:boolean;
paymentCredited:boolean;
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
    currentStatusDate?:string;
    statusTimeLineDetails?:statusTimeLineDetails[];
    currentOrderStatus:string;
}

export interface statusTimeLineDetails {
    statusName:string;
    placedDate:string;
    icon:string;
    iconColor: string;
}

export interface OrderNotificationModel {
    orderId:string;
    notificationId?:string;
}

export interface OrderSignalRSubjectModel {
    orderModel:OrderModel;
    operation:string;
}

export interface OrderCountResponse {
    orderPlaced:number;
    orderInProgress:number;
    orderCancelled:number;
}