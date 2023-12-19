import { CartMenuItem } from "../cart-component/cart-information";
import { PaymentDetailModel, UserOrderDetailsModel } from "../payment/payment";
import { OrderStatus } from "./order-status-enum";

export interface OrderModel {
id:string;
cartId:string;
menuItems:CartMenuItem[];
paymentDetails:PaymentDetailModel;
userDetails:UserOrderDetailsModel;
orderPlacedDateTime:string;
orderStatus:OrderStatus;
}