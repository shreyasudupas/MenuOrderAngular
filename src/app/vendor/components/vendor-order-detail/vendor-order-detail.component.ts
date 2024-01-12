import { Component, Input, OnInit } from '@angular/core'
import { OrderModel } from 'src/app/user/components/order-details/order-model'

@Component({
    selector: 'vendor-order-detail',
    templateUrl: './vendor-order-detail.component.html',
    styleUrls: ['./vendor-order-detail.component.scss']
})

export class VendorOrderDetailComponent implements OnInit {

    @Input()
    orderData:OrderModel;

    ngOnInit(): void {
            
    }
    
}