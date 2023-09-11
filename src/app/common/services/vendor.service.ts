import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor } from 'src/app/admin/components/vendor/vendor';
import { environment } from 'src/environments/environment';

@Injectable()

export class VendorService {

    constructor(private httpClient:HttpClient) {}

    getVendorById(vendorId:string) : Observable<Vendor> {
        let url = environment.inventory.vendor;
        url = url + '/' + vendorId;

        return this.httpClient.get<Vendor>(url);
    }

    addVendor(vendor:Vendor) : Observable<Vendor> {
        let url = environment.inventory.vendor;

        let body = {
            VendorDetail: vendor
        };

        return this.httpClient.post<Vendor>(url,body);
    }

    editVendor(vendor:Vendor) : Observable<Vendor> {
        let url = environment.inventory.vendor;

        let body = {
            VendorDetail: vendor
        };

        return this.httpClient.put<Vendor>(url,body);
    }
}