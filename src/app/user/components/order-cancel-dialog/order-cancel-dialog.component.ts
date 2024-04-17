import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/common/services/order.service';
import { DateUtility } from 'src/app/common/utilities/dateUtilites';
import { OrderModel } from '../order-details/order-model';
import { OrderStatusEnum } from '../payment/payment';

@Component({
    selector: 'order-cancel-dialog',
    templateUrl: 'order-cancel-dialog.component.html',
    styleUrls: ['order-cancel-dialog.component.scss']
})

export class OrderCancelDialogComponent implements OnInit {

orderInfo:OrderModel;
visible:boolean = false;
confirmCancelForm:FormGroup;
cancellationReasons:any[] = [
    { name:'Order is taking long time to prepare',code:'Order is taking long time to prepare'},
    { name:'Ordered by mistake',code:'Ordered by mistake'}
];

constructor(private fb:FormBuilder,
    private orderService:OrderService
) {
}

    ngOnInit(): void {
        this.confirmCancelForm = this.fb.group({
            cancellationReason: ['',Validators.required]
        });
    }
    
    enableDialog() {
        this.visible = !this.visible;
    }

    cancel() {
        this.visible = false;
        this.confirmCancelForm.reset();
    }

    confirmCancel() {
        if(this.confirmCancelForm.valid) {

            if(this.orderInfo !== undefined) {
                this.orderInfo.orderCancelledReason = this.confirmCancelForm.controls['cancellationReason'].value['code'];
                this.orderInfo.status.orderCancelled = DateUtility.formatDateTime(new Date());
                this.orderInfo.currentOrderStatus = OrderStatusEnum[OrderStatusEnum.OrderCancelled];
                
                this.orderService.updateOrderInformation(this.orderInfo).subscribe({
                    next: (orderResult?:OrderModel) => {
                        if(orderResult === null) {
                            console.log('Problem inside the Order Update API');
                        }
                        this.cancel();
                    },
                    error: (err) => console.log(`Error has occured in updating cancellation reason: ${err}`)
                });
            }
        } else {
            this.confirmCancelForm.controls['cancellationReason']
                .setErrors({invalid:true,message:'*cancellation reason is required.'});
        }
    }
}