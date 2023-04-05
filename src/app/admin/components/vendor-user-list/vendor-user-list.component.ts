import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { VendorUserIdMapping } from './vendor-user-mapping';
import { WelcomeVendorModel } from 'src/app/common/models/welcomeVendorModel';
import { EmailTypeEnum } from 'src/app/common/enums/emailenum';

@Component({
    selector: 'vendor-user-list',
    templateUrl: './vendor-user-list.component.html',
    providers: [ MessageService ]
})

export class VendorUserListComponent extends BaseComponent<VendorUserIdMapping> implements OnInit{
    @Input() vendorId:string;
    @Input() vendorName:string;
    vendorMapping: VendorUserIdMapping[]=[];

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        private fb: FormBuilder,
        messageService: MessageService){
            super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {

        if(this.vendorId !== undefined){
            this.listAllVendorUserMapping();
        }
    }

    listAllVendorUserMapping(){
        this.baseUrl = environment.idsConfig.vendorUserMapping;
        this.action = "all";
        let param = new HttpParams().append('vendorId',this.vendorId);

        this.ListItems(param).subscribe({
            next: result=>{
                //console.log(result);
                if(result != null)
                    this.vendorMapping = result;
            },
            error: err => {
                console.log(err);
            }
        });
    }

    updateVendorUserIdMapping(vendorMapping:VendorUserIdMapping){
        vendorMapping.enabled = true;

        var body = {
            updateVendorUserMapping : vendorMapping
        };
        this.baseUrl = environment.idsConfig.vendorUserMapping;
        this.action = null;
        
        this.UpdateItem(body).subscribe({
            next: result=>{
                if(result != null){
                    this.showInfo('Update successful');

                    this.emailNotification(vendorMapping);
                }
            },
            error: err => {
                console.log(err);
            }
        })
    }

    emailNotification(vendorMapping:VendorUserIdMapping){
        let url = environment.idsConfig.vendormail + "send-welcome-vendor";

        let vendorBody : WelcomeVendorModel = {
            body:'',subject:'Verification Successfuly',templateType: EmailTypeEnum.WelcomeVendor,toAddress:'',
            username: vendorMapping.username, vendorEmail: vendorMapping.emailId,vendorName: this.vendorName
        };

        this.httpclient.post(url,vendorBody).subscribe({
            next: result=>{
                if(result == true){
                    this.showInfo('Mail sent successfully');
                }else{
                    this.showError('Mail sending unsucessfully');
                }
            },
            error: err => {
                console.log('Error when sending Verfication mail API, error: '+  err);
            }
        })
    }
    
}