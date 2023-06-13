import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { Role } from 'src/app/common/models/role';
import { AuthService } from 'src/app/common/services/auth.service';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'invite-user-to-vendor',
    templateUrl: './invite-user-vendor.component.html'
})

export class InviteUserToVendorComponent  extends BaseComponent<any> implements OnInit{
emailId:string;
vendors: any[];
selectedVendor:any;
role:string;
registerUserForm:FormGroup;


    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public broadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router: Router,
        messageService:MessageService,
        public authService:AuthService,
        public fb:FormBuilder
    ){
        super(menuService,httpclient,broadcastService,messageService)
        
    }
    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;
        this.InitilizeMenu();

        this.role = this.authService.GetUserRole();

        if(this.role == Role.Admin){
            this.getAllVendorsList();

            this.registerUserForm = this.fb.group({
                vendorName:[[],Validators.required],
                email: ['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
            });
        }
        
    }

    formControlValidation(name:string){
        return (this.registerUserForm.get(name)?.invalid && this.registerUserForm.get(name)?.dirty || this.registerUserForm.get(name)?.touched )
    }

    getAllVendorsList() {
        this.baseUrl = environment.inventory.vendors;
        this.action = null;
        this.ListItems(null).subscribe({
            next: result => {
                if(result != null){
                    this.vendors = [];
                    result.forEach(item=>{
                        this.vendors.push({
                            label: item.vendorName ,value: item.vendorName,id: item.id
                        });
                    });
                }
            },
            error: error => {
                console.log('error in Vendors API:'  + error);
            }
        });
    }

    onSubmitAdmin(form:FormGroup){
        if(form.valid){

        }else{
            alert('Enter All the fields');
        }
    }
}