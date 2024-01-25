import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderModel } from 'src/app/user/components/order-details/order-model';

@Component({
    selector: 'vendor-order-card',
    templateUrl: './vendor-order-card.component.html',
    styleUrls: ['./vendor-order-card.component.scss']
})

export class VendorOrderCardComponent implements OnInit {

    @Input()
    data:OrderModel[]=[];

    @Output()
    sendOrderDetail = new EventEmitter<OrderModel>();

    ngOnInit(): void {
        console.log(this.data);
    }

    //function to call view order component
    viewOrderFnCall(data:OrderModel) {
        this.sendOrderDetail.emit(data);
    }
    
}