import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { CategoryMenuItem, VendorCategoryMenu } from './category-menu-item';


@Component({
    selector:'category-detail',
    templateUrl:'./category-detail.component.html',
    styleUrls: ['./category-detail.component.scss'],
    providers: [ConfirmationService]
})

export class CategoryDetailComponent extends BaseComponent<VendorCategoryMenu> implements OnInit{
categoryDetailForm!:FormGroup;
categoryId:string='';
vendorId:string='';
disableCategoryName:boolean = false;
breadItems: MenuItem[]=[];
role:string;
vendorUrl:string;
vendorCategory:VendorCategoryMenu;
selectedMenuItems: CategoryMenuItem[] | null;
userRole:string;

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private route:Router,
        private fb:FormBuilder,
        messageService:MessageService,
        public navigation:NavigationService,
        public authService:AuthService,
        private confirmationService: ConfirmationService
    ){
        super(menuService,httpclient,commonBroadcastService,messageService)   
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        
        this.categoryDetailForm = this.fb.group({
            id: [''],
            name: ['',Validators.required],
            description: [''],
            openTime: [new Date(),Validators.required],
            closeTime: [new Date(),Validators.required],
            active: [false],
            releaseDateTime:[new Date(),Validators.required]
        });

        this.categoryId = this.activatedRoute.snapshot.params['categoryId'];

        this.vendorId = this.activatedRoute.snapshot.params['vendorId'];

        this.role = this.authService.GetUserRole();
        this.vendorUrl = "/".concat(this.role,'/vendor-detail/',this.vendorId);

        this.userRole = this.authService.GetUserRole();

        this.breadItems = [
            {label: 'Vendor Detail' , command: (event) => {
                if(this.vendorId !== '0' || this.vendorId !== undefined)
                    this.route.navigate([this.vendorUrl])
                else{
                    console.log('No Vendor ID Present in category detail page')
                }
            }},
            {label: 'Category Detail'}
        ];

        if(this.categoryId !== '0'){
            this.getCategoryById(this.categoryId);
        }
        
    }

    getCategoryById = (id:string) => {
        this.baseUrl = environment.inventory.vendor;
        this.action = this.vendorId + '/category/'+id;
        this.GetItem(new HttpParams()).subscribe({
            next: result => {
                //console.log(result);
                this.vendorCategory = result;

                this.categoryDetailForm.setValue({
                    id: result.categories.id,
                    name: result.categories.name,
                    description: result.categories.description,
                    active: result.categories.active,
                    openTime: new Date(result.categories.openTime),
                    closeTime: new Date(result.categories.closeTime),
                    releaseDateTime: new Date(result.categories.releaseDate)
                });

                //this.showInfo('Category Updated');
                this.categoryDetailForm.controls['name'].disable()
            },
            error: error => {
                this.showError('Unable to get category detail');
                console.log(error);
            }
        });
    }

    goBack = () => {
        if(this.vendorId !== undefined){
            this.route.navigate([this.vendorUrl]);
        }else
        {
            console.log('unable to go back since no Vendor Id')
        }
    }

    submitCategoryDetailForm = (forms:FormGroup) => {
        if(forms.valid){
            if(this.vendorId === undefined){
                this.showInfo('Please go back to the vendor list page');
            }else if(forms.get('id').value === ''){
                this.addCatgoryVendor(forms);
            }else {
                this.updateCatgoryVendor(forms);
            }
            
        }else{
            this.showError('Enter Required Form values');
        }
    }

    addCatgoryVendor = (forms:FormGroup) => {
        this.baseUrl = environment.inventory.vendor + '/add/category';
        this.action = null;
        let formValue = forms.value;
        formValue = {...formValue, 
            openTime: formValue.openTime.toTimeString().split(' ')[0],
            closeTime: formValue.closeTime.toTimeString().split(' ')[0]
        }

        let body = {
            VendorId: this.vendorId,
            newCategory: formValue
        };

        this.Create(body).subscribe({
            next: result=>{
                if(result != null){
                    this.navigation.removeHistory();
                    this.route.navigateByUrl(this.vendorUrl);
                }else{
                    this.showError('Error in saving the category detail');
                }
            },
            error: error => {
                console.log(error);
                this.showError('Error in Posting the details');
            }
        });
    }

    updateCatgoryVendor = (forms:FormGroup) => {
        this.baseUrl = environment.inventory.vendor + '/update/category';
        this.action = null;
        let formValue = forms.getRawValue();
        formValue = {...formValue,
             openTime: formValue.openTime.toTimeString().split(' ')[0],
             closeTime: formValue.closeTime.toTimeString().split(' ')[0]
        };


        let body = {
            VendorId: this.vendorId,
            Category: formValue
        };

        this.UpdateItem(body).subscribe({
            next: result=>{
                if(result != null){
                    this.showInfo('Item Updated succesfully');
                }else{
                    this.showError('Error in saving the category detail');
                }
            },
            error: error => {
                console.log(error);
                this.showError('Error in Posting the details');
            }
        });
    }

    formControlValidation(name:string){
        return (this.categoryDetailForm.get(name)?.invalid && (this.categoryDetailForm.get(name)?.dirty || this.categoryDetailForm.get(name)?.touched));
    }

    openNew() {
        let menuUrl = '/'.concat(this.userRole,'/vendor-detail/',this.vendorId,'/category/',this.categoryId,'/menu-details/','0');
        this.route.navigate([menuUrl]);
    }

    deleteSeletedMenuItems() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected menu items?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                console.log(this.selectedMenuItems);
                this.selectedMenuItems = null;
            }
        });
    }
}