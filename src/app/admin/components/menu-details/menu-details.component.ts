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
import { ImageData } from 'src/app/admin/components/menu-image-details/image-response';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { VendorMenuDetails } from './vendor-menu-details';

@Component({
    selector:'menu-details',
    templateUrl: './menu-details.component.html',
    styleUrls:['./menu-details.component.css']
})

export class MenuDetailsComponent extends BaseComponent<VendorMenuDetails> implements OnInit{
vendorId:string='';
menuDetailsId:string='';
menuDetailForm!:FormGroup;
categoryDropdownList:Category[]=[];
foodTypeDropDownList:FoodType[]=[];
forkRequest: ResourceServiceForkRequest = new ResourceServiceForkRequest();
breadItems: MenuItem[]=[];
imageUploadDialog:boolean= false;
showPreviewImage:boolean = false;
imageUrl:string = '';
itemName:string= "";
currentImageId:string='';
role:string;
vendorUrl:string;


    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        private fb: FormBuilder,
        messageService: MessageService,
        public navigation:NavigationService,
        public authService:AuthService){
            super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.vendorId = this.activatedRoute.snapshot.params['vendorId'];
        this.menuDetailsId = this.activatedRoute.snapshot.params['menuDetailsId'];

        this.navigation.startSaveHistory('/menu-details');
        //console.log(this.navigation.history);

        this.role = this.authService.GetUserRole();
        this.vendorUrl = "/" + this.role + '/vendor-detail/';

        this.breadItems = [
            {label: 'Vendor Detail' , command: (event) => {
                if(this.vendorId !== '0' || this.vendorId !== undefined)
                    this.router.navigate([this.vendorUrl + this.vendorId])
                else{
                    console.log('No VendorId is present');
                }
            }},
            {label: 'Menu Detail'}
        ];

        this.menuDetailForm = this.fb.group({
            id:[''],
            vendorId:[this.vendorId],
            itemName: ['',Validators.required],
            imageId:[''],
            imageFilename:[''],
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

    callMenuDetailForm = (name:string) => {
        return this.menuDetailForm.controls['name'].value;
    }
    
    goBack = () => {
        this.navigation.goBack();
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
                if(result != null){
                    this.menuDetailForm.setValue({
                        id: result.id,
                        vendorId: this.vendorId,
                        itemName: result.itemName,
                        imageId: result.imageData,
                        imageFilename: result.imageFilename,
                        foodType: result.foodType,
                        category: result.category,
                        price: result.price,
                        discount: result.discount,
                        active: result.active
                    });
    
                    if(result.imageData !== ''){
                        this.showPreviewImage = true;

                        this.imageUrl = 'data:image/png;base64, ' + result.imageData;

                        this.currentImageId = result.imageId;
                    }
                    this.showInfo('Item retrival success');

                    this.itemName = result.itemName;
                }
                
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
            let body = {
                id: forms.value.id,
                vendorId: forms.value.vendorId,
                itemName: forms.value.itemName,
                image:{
                    imageId: forms.value.imageId,
                    imageFileName: forms.value.imageFilename
                },
                foodType: forms.value.foodTypes,
                category: forms.value.category,
                price: forms.value.price,
                discount: forms.value.discount,
                rating: forms.value.rating,
                active: forms.value.active
            };

            this.Create(body).subscribe({
                next: result => {
                    if(result!=null && result.id != ''){
                        this.showInfo('form updated success');

                        window.history.replaceState({}, '', `${this.vendorUrl}${this.vendorId}/menu-details/${result.id}`);
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
                UpdateVendorMenu : {
                    id: forms.value.id,
                    vendorId: forms.value.vendorId,
                    itemName: forms.value.itemName,
                    image:{
                        imageId: forms.value.imageId,
                        imageFileName: forms.value.imageFilename
                    },
                    foodType: forms.value.foodTypes,
                    category: forms.value.category,
                    price: forms.value.price,
                    discount: forms.value.discount,
                    rating: forms.value.rating,
                    active: forms.value.active
                }
            };

            this.UpdateItem(body).subscribe({
                next: result => {
                    if(result!=null && result.id != ''){
                        this.showInfo('form updated success');
                    }else {
                        this.showError('Error in submitting the form');
                    }
                }
            });

        }else{
            this.showError('Enter Required details in the form');
        }
    }

    getImageSelection = ($event:ImageData) => {
        //console.log('Item gor From Parent' + JSON.stringify($event));
        if($event !== null){

            this.menuDetailForm.patchValue({
                imageId: $event.id,
                imageFilename: $event.fileName
            });

            //update preview image
            this.imageUrl = 'data:image/png;base64, ' + $event.data;
            this.showPreviewImage = true;
        }else{
            
            this.menuDetailForm.patchValue({
                imageId: '',
                imageFilename: ''
            });

            this.showPreviewImage = false;
        }
    }
    
    callImageUploaderDialog = () => {
        this.imageUploadDialog=true
    }

    closeImageDialog = ($event:boolean) => {
        this.imageUploadDialog = $event;
    }
}