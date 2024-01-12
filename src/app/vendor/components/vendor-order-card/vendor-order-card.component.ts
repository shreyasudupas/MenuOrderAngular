import { Component, Input, OnInit } from '@angular/core';
import { OrderModel } from 'src/app/user/components/order-details/order-model';

@Component({
    selector: 'vendor-order-card',
    templateUrl: './vendor-order-card.component.html',
    styleUrls: ['./vendor-order-card.component.scss']
})

export class VendorOrderCardComponent implements OnInit {

    @Input()
    data:OrderModel[]=[];

    ngOnInit(): void {
        console.log(this.data);
    }
    
}