import { CartMenuItem } from "../cart-component/cart-information";
import {  UserOrderDetailsModel } from "../payment/payment";
import { OrderStatus } from "./order-status-enum";

export interface OrderModel {
id:string;
cartId:string;
menuItems:CartMenuItem[];
totalPrice:number;
paymentDetail:OrderPaymentModel;
userDetail:UserOrderDetailsModel;
orderPlacedDateTime:string;
orderStatus:OrderStatus;
vendorDetail:VendorDetailModel;
}

interface VendorDetailModel {
vendorId:string;
vendorName:string;
}

interface OrderPaymentModel {
price:number;
selectedPayment:string;
methodOfDelivery:string;
paymentSuccess:boolean;
}