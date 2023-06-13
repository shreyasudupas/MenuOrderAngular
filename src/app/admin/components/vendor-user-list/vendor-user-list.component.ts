import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { VendorUserIdMapping } from './vendor-user-mapping';
import { WelcomeVendorModel } from 'src/app/common/models/welcomeVendorModel';
import { EmailTypeEnum } from 'src/app/common/enums/emailenum';
import { EncryptDecryptService } from 'src/app/common/services/encryptDecrypt.service';

@Component({
    selector: 'vendor-user-list',
    templateUrl: './vendor-user-list.component.html'
})

export class VendorUserListComponent extends BaseComponent<VendorUserIdMapping> implements OnInit{
    @Input() vendorId:string;
    @Input() vendorName:string;
    vendorMapping: VendorUserIdMapping[]=[];
    displayAddUserToVendor:boolean;
    inviteForm:FormGroup;
    runProgressSpinner:boolean;

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        private fb: FormBuilder,
        messageService: MessageService,
        private encryptDecryptService:EncryptDecryptService){
            super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {

        if(this.vendorId !== undefined){
            this.listAllVendorUserMapping();

            this.inviteForm = this.fb.group({
                email: ['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
            });
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

    addUserDialog(){
        this.displayAddUserToVendor = true;
    }

    inviteUser(inviteForm:FormGroup){
    this.runProgressSpinner = true;

        if(this.inviteForm.valid)
        {
            let url = environment.idsConfig.vendormail + 'send-register-vendor';
            let body = {
                subject:'Registeration for Vendor MenuApp',
                templateType: EmailTypeEnum.RegisterVendor,
                vendorName: this.vendorName,
                vendorId: this.encryptDecryptService.encryptUsingAES256(this.vendorId),
                toAddress:this.inviteForm.controls['email'].value
            };

            this.httpclient.post(url,body).subscribe({
                next: result => {
                    if(result == true){
                        this.showInfo('Mail sent successfully');

                        this.displayAddUserToVendor=false;
                        this.runProgressSpinner= false;
                        this.inviteForm.setValue({
                            email:''
                        });
                    }else{
                        this.showError('Error is sending the mail');
                        this.runProgressSpinner= false;
                    }
                }
            });
        }
    }

    callHide(){
        //console.log('Hide called');
        this.inviteForm.setValue({
            email:''
        });
    }
    
}