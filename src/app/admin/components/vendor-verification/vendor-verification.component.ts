import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'vendor-verification',
    templateUrl: './vendor-verification.component.html',
    styleUrls: ['./vendor-verification.component.scss']
})

export class VendorVerificationComponent implements OnInit {

    @Input()
    vendorStatus:string;

    @Input()
    vendorId:string;

    @Input()
    enable:boolean;


    constructor(private httpClient:HttpClient,
        private authService:AuthService) {
        if(this.enable === undefined) {
            this.enable = false;
        }
    }

    ngOnInit(): void {
        //console.log(this.vendorStatus);
    }

    updateStatus(status:string) {
        let url = environment.inventory.vendor + '/updateVendorStatus';
        let body = {
            vendorId: this.vendorId,
            vendorStatus: status
        }

        this.httpClient.put<boolean>(url,body).subscribe({
            next: result => {
                if(result === false) {
                    console.log('Something went wrong in the server');
                } else {
                    this.vendorStatus = status;
                }
            },
            error: err => {
                console.log('Error is Vendor Status ',err);
            }
        });
    }

    updateEnableUser(event:any) {
        //console.log(event);
        let value = event.checked;

        let body = {
            vendorId: this.vendorId,
            enable: value
        };
        let url = environment.idsConfig.vendor + 'update/enable';

        this.httpClient.put<boolean>(url,body).subscribe({
            next: result => {
                if(result === false) {
                    this.enable = !this.enable;
                } 
            },
            error: err => {
                console.log('Error occured in update user enable API ',err)
                this.enable = !this.enable;
            }
        });
    }
}