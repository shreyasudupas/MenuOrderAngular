import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { RequestResource, ResourceServiceForkRequest } from 'src/app/common/models/resourceServiceForkRequest';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { Category } from '../categories/category';
import { FoodType } from '../food-type-details/food-type';
import { MenuDetails } from './menu-details';

@Component({
    selector:'menu-details',
    templateUrl: './menu-details.component.html',
    providers: [MessageService]
})

export class MenuDetailsComponent extends BaseComponent<MenuDetails> implements OnInit{
vendorId:string='';
menuDetailsId:string='';
menuDetailForm!:FormGroup;
categoryDropdownList:Category[]=[];
foodTypeDropDownList:FoodType[]=[];
forkRequest: ResourceServiceForkRequest = new ResourceServiceForkRequest();
breadItems: MenuItem[]=[];

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
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.vendorId = this.activatedRoute.snapshot.params['vendorId'];
        this.menuDetailsId = this.activatedRoute.snapshot.params['menuDetailsId'];

        this.breadItems = [
            {label: 'Vendor Detail' , command: (event) => {
                if(this.vendorId !== '0' || this.vendorId !== undefined)
                    this.router.navigate(['admin/vendor-detail/' + this.vendorId])
                else
                this.router.navigate(['admin/vendor']);
            }},
            {label: 'Menu Detail'}
        ];

        this.menuDetailForm = this.fb.group({
            id:[''],
            vendorId:[this.vendorId],
            itemName: ['',Validators.required],
            imageLocation:[''],
            foodType: ['',Validators.required],
            category: ['',Validators.required],
            price: [0,Validators.required],
            discount:[0],
            active:[true]
        });

        this.callMultipleApis();

        if(this.menuDetailsId !== '0'){
            this.callVendorMenuItemDetail(this.menuDetailsId);
        }
    }
    
    goBack = () => {
        if(this.vendorId !== '0' || this.vendorId !== undefined)
            this.router.navigate(['admin/vendor-detail/' + this.vendorId]);
        else    
            this.router.navigate(['admin/vendor']);
    }

    callMultipleApis = () => {
        let request1:RequestResource = {
            httpMethod:'get',
            requestUrl:environment.inventory.foodtype + '/list?isActive=true',
            body:null
        };
        this.forkRequest.requestParamter.push(request1);

        let request2:RequestResource = {
            httpMethod:'get',
            requestUrl:environment.inventory.vendor + '/categories/'+ this.vendorId,
            body:null
        };
        this.forkRequest.requestParamter.push(request2);

        this.getForkItems(this.forkRequest).subscribe(([foodTypeResponse,categoryResponse])=>{
            let error = 'Error occurred';

            if(foodTypeResponse !== error){
                this.foodTypeDropDownList = foodTypeResponse;
            }else{
                this.showError('Error has occured while fetching Food Type');
            }

            if(categoryResponse !== error){
                this.categoryDropdownList = categoryResponse;
            }else{
                this.showError('Error has occured while fetching Category Type');
            }
        });
    }

    callVendorMenuItemDetail = (menuItemId:string) => {
        this.baseUrl = environment.inventory.vendorMenu;
        this.action = menuItemId;

        this.GetItem(new HttpParams()).subscribe({
            next: result => {
                this.menuDetailForm.setValue({
                    id: result.id,
                    vendorId: this.vendorId,
                    itemName: result.itemName,
                    imageLocation: result.imageLocation,
                    foodType: result.foodType,
                    category: result.category,
                    price: result.price,
                    discount: result.discount,
                    active: result.active
                });

                this.showInfo('Item retrival success');
            },
            error: error => {
                console.log(error);
                this.showError('Error in retriving the menu Item');
            }
        });
    }

    submitVendorMenuItem = (forms:FormGroup) => {
        if(this.menuDetailsId === '0'){
            this.addVendorMenuItem(forms);
        }else{
            this.updateVendorMenuItem(forms);
        }
    }

    addVendorMenuItem = (forms:FormGroup) => {
        if(forms.valid){
            this.baseUrl = environment.inventory.vendorMenu;
            this.action = null;
            let body = forms.value;

            this.Create(body).subscribe({
                next: result => {
                    if(result!=null && result.id != ''){
                        this.showInfo('form updated success');

                        window.history.replaceState({}, '', `admin/vendor-detail/${this.vendorId}/menu-details/${result.id}`);
                    }else {
                        this.showError('Error in submitting the form');
                    }
                }
            })
        }else{
            this.showError('Enter Required details in the form');
        }
    }

    updateVendorMenuItem = (forms:FormGroup) => {
        if(forms.valid){
            this.baseUrl = environment.inventory.vendorMenu;
            this.action = null;
            let body = {
                UpdateVendorMenu : forms.value
            };

            this.UpdateItem(body).subscribe({
                next: result => {
                    if(result!=null && result.id != ''){
                        this.showInfo('form updated success');
                    }else {
                        this.showError('Error in submitting the form');
                    }
                }
            })
        }else{
            this.showError('Enter Required details in the form');
        }
    }
}