import { CartMenuItem } from "../cart-component/cart-information";

export class PaymentModel {
    id:string;
    cartId:string;
    menuItems:CartMenuItem[];
    payementDetails:PaymentDetailModel;
    userDetails:UserOrderDetailsModel;
    orderPlaced:string;
    orderStatus:string;
}

export class PaymentDetailModel {
    price:number;
    selectedPayment:string;
    methodOfDelivery:string;
    paymentSuccess:boolean;
}

export class UserOrderDetailsModel {
    userId:string;
    fullAddress:string;
    latitude:number;
    longitude:number;
}

export enum OrderStatusEnum {
    WaitingOnVendorAccept,
    AcceptedByVendor,
    Processing,
    Ready,
    Done
}

