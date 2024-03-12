import { Component, Input, OnInit } from '@angular/core'
import { OrderService } from 'src/app/common/services/order.service';
import { OrderDisplayModel, OrderModel } from 'src/app/user/components/order-details/order-model'

@Component({
    selector: 'vendor-order-detail',
    templateUrl: './vendor-order-detail.component.html',
    styleUrls: ['./vendor-order-detail.component.scss']
})

export class VendorOrderDetailComponent implements OnInit {

    @Input()
    orderData:OrderModel;

    orderModel:OrderDisplayModel;

    constructor(private orderSerice:OrderService) {}

    ngOnInit(): void {
         if(this.orderData !== null) {
            this.orderModel = this.orderSerice.getOrderDisplayModelList(this.orderData);
         }   
    }
    
}