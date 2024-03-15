import { Injectable } from '@angular/core';
import { OrderDisplayModel, IOrderStatusModel, OrderModel } from 'src/app/user/components/order-details/order-model';
import { OrderStatusEnum } from 'src/app/user/components/payment/payment';

@Injectable({
    providedIn:'root'
})

export class OrderService {

    public getCurrentStatusAndDate(orderStatus:IOrderStatusModel) {
        if(orderStatus.orderPlaced !== null && orderStatus.orderInProgress == null && orderStatus.orderCancelled === null) {
            return { 
                'orderStatus':OrderStatusEnum[OrderStatusEnum.OrderPlaced],
                'currentOrderPlacedDate':orderStatus.orderPlaced 
            };
        } else if(orderStatus.orderReady === null && orderStatus.orderCancelled !== null) {
            return {
                'orderStatus': OrderStatusEnum[OrderStatusEnum.OrderCancelled],
                'currentOrderPlacedDate': orderStatus.orderCancelled
            };
        } else if(orderStatus.orderReady === null) {
            return {
                'orderStatus': OrderStatusEnum[OrderStatusEnum.OrderInProgress],
                'currentOrderPlacedDate': orderStatus.orderInProgress
            };
        } else if(orderStatus.orderDone === null) {
            return { 
                'orderStatus': OrderStatusEnum[OrderStatusEnum.OrderReady],
                'currentOrderPlacedDate':orderStatus.orderReady
            };
        } else if(orderStatus.orderCancelled == null) {
            return {
                'orderStatus': OrderStatusEnum[OrderStatusEnum.OrderDone],
                'currentOrderPlacedDate': orderStatus.orderDone
            };
        } else {
            return {
                'orderStatus': OrderStatusEnum[OrderStatusEnum.OrderCancelled],
                'currentorderPlacedDate':orderStatus.orderCancelled
            };
        }
    }

    public getOrderDisplayModel(order:OrderModel) : OrderDisplayModel {

        var {orderStatus,currentOrderPlacedDate} = this.getCurrentStatusAndDate(order.status);

        let orderMap:OrderDisplayModel = {
            id: order.id,
            cartId: order.cartId,
            menuItems: order.menuItems,
            totalPrice: order.totalPrice,
            paymentDetail: order.paymentDetail,
            userDetail: order.userDetail,
            status: {
                orderPlaced: order.status.orderPlaced,
                orderInProgress: order.status.orderInProgress,
                orderDone: order.status.orderDone,
                orderReady: order.status.orderReady,
                orderCancelled: order.status.orderCancelled
            },
            vendorDetail: order.vendorDetail,
            uiOrderNumber: order.uiOrderNumber,
            isFastCancelButton: null,
            counter: null,
            createdDate: order.createdDate,
            orderCancelledReason: order.orderCancelledReason,
            currentOrderStatus: order.currentOrderStatus,
            currentStatusDate: currentOrderPlacedDate
        };

        return orderMap;
    }

    public getOrderDisplayModelListList(orders:OrderModel[]) : OrderDisplayModel[] {
        return orders.map(order=> {
            let {orderStatus,currentOrderPlacedDate} = this.getCurrentStatusAndDate(order.status);

            let orderMap:OrderDisplayModel = {
                id: order.id,
                cartId: order.cartId,
                menuItems: order.menuItems,
                totalPrice: order.totalPrice,
                paymentDetail: order.paymentDetail,
                userDetail: order.userDetail,
                status: {
                    orderPlaced: order.status.orderPlaced,
                    orderInProgress: order.status.orderInProgress,
                    orderDone: order.status.orderDone,
                    orderReady: order.status.orderReady,
                    orderCancelled: order.status.orderCancelled
                },
                vendorDetail: order.vendorDetail,
                uiOrderNumber: order.uiOrderNumber,
                isFastCancelButton: null,
                counter: null,
                createdDate: order.createdDate,
                orderCancelledReason: order.orderCancelledReason,
                currentOrderStatus: order.currentOrderStatus,
                currentStatusDate: currentOrderPlacedDate
            };

            return orderMap;
        });
    }
}