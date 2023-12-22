import { CartMenuItem } from "../cart-component/cart-information";

export class PaymentModel {
    userId:string;
    cartInfo:CartInfoModel;
    paymentInfo:PaymentDetailModel;
    userAddress:UserOrderDetailsModel;
}

export class PaymentDetailModel {
    totalPrice:number;
    selectedPayment:string;
    methodOfDelivery:string;
    paymentSuccess:boolean;
}

export class UserOrderDetailsModel {
    fullAddress:string;
    latitude:number;
    longitude:number;
    city:string;
    area:string;
    phoneNumber:string;
    emailId:string;
}

export class CartInfoModel {
    cartId:string;
    menuItems:CartMenuItem[];
}

export enum OrderStatusEnum {
    OrderPlaced,
    OrderAccepted,
    OrderInProgress,
    OrderReady,
    OrderDone
}

