import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { Category } from './category';

@Component({
    selector:'category-list',
    templateUrl:'./category-detail.component.html',
    providers: [ MessageService ]
})

export class CategoryDetailComponent extends BaseComponent<Category> implements OnInit{
categoryDetailForm!:FormGroup;
id:string='';
vendorId:string='';

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private route:Router,
        private fb:FormBuilder,
        private messageService:MessageService
    ){
        super(menuService,httpclient,commonBroadcastService)   
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.categoryDetailForm = this.fb.group({
            id: [''],
            name: ['',Validators.required],
            description: [''],
            active: [false]
        });

        this.id = this.activatedRoute.snapshot.params['categoryId'];

        this.vendorId = history.state.vendorId;

        if(this.id !== '0'){
            this.getCategoryById(this.id);
        }
        
    }

    getCategoryById = (id:string) => {
        this.baseUrl = environment.inventory.vendor;
        this.action = this.vendorId + '/category/'+id;
        this.GetItem(new HttpParams()).subscribe({
            next: result => {
                //console.log(result);

                this.categoryDetailForm.setValue({
                    id: result.id,
                    name: result.name,
                    description: result.description,
                    active: result.active
                });

                this.showInfo('Category Updated');
            },
            error: error => {
                this.showError('Unable to get category detail');
                console.log(error);
            }
        });
    }

    goBack = () => {
        if(this.vendorId !== undefined){
            this.route.navigateByUrl('/admin/vendor-detail/'+ this.vendorId);
        }else{
            this.route.navigateByUrl('/admin/vendor');
        } 
    }

    submitCategoryDetailForm = (forms:FormGroup) => {
        if(forms.valid){

            this.baseUrl = environment.inventory.vendor + '/add/category';
            this.action = null;
            let body = {
                VendorId: this.vendorId,
                newCategory: forms.value
            };

            this.Create(body).subscribe({
                next: result=>{
                    if(result != null){
                        this.route.navigateByUrl('admin/vendor-detail/'+this.vendorId);
                    }else{
                        this.showError('Error in saving the category detail');
                    }
                },
                error: error => {
                    console.log(error);
                    this.showError('Error in Posting the details');
                }
            });
        }else{
            this.showError('Enter Required Form values');
        }
    }

    formControlValidation(name:string){
        return (this.categoryDetailForm.get(name)?.invalid && (this.categoryDetailForm.get(name)?.dirty || this.categoryDetailForm.get(name)?.touched));
    }

    showInfo(message:string) {
        this.messageService.add({severity:'info', summary: 'Info', detail: message });
    }

    showError(message:string) {
        this.messageService.add({severity:'error', summary: 'Error', detail: message });
    }
}