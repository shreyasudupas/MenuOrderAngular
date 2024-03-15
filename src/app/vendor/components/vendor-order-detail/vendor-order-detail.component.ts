import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { OrderService } from 'src/app/common/services/order.service';
import { OrderModel } from 'src/app/user/components/order-details/order-model'

@Component({
    selector: 'vendor-order-detail',
    templateUrl: './vendor-order-detail.component.html',
    styleUrls: ['./vendor-order-detail.component.scss']
})

export class VendorOrderDetailComponent implements OnInit,OnChanges {

    @Input()
    orderData:OrderModel;

    orderModel:OrderModel;

    constructor(private orderSerice:OrderService) {}

    ngOnInit(): void {
         if(this.orderData !== null) {
            this.orderModel = this.orderSerice.getOrderDisplayModel(this.orderData);
         }   
    }

    ngOnChanges(changes: SimpleChanges): void {
        //console.log(changes);
        if(!changes['orderData'].firstChange) {
            this.orderModel = changes['orderData'].currentValue;
        }
        
    }
    
}