import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { FoodType } from './food-type';

@Component({
    selector: 'food-type-details',
    templateUrl: './food-type-details.component.html',
    providers:[MessageService]
})

export class FoodTypeDetailsComponent extends BaseComponent<FoodType> implements OnInit {
foodTypeDetail:FoodType = { id:'',typeName:'',active:true };
foodTypeForm!:FormGroup;
header:string='';
foodTypeId:string='';

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public broadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        messageService:MessageService
    ){
        super(menuService,httpclient,broadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();   
        
        this.foodTypeForm = this.fb.group({
            id: [''],
            typeName: ['',Validators.required],
            active: [true]
        });

        this.foodTypeId = this.activatedRoute.snapshot.params['foodtypeId'];
        if(this.foodTypeId === '0'){
            this.header = "Add New Food Type";
        }else{
            this.header = "Edit Food Type";

            this.baseUrl = environment.inventory.foodtype;
            this.action = this.foodTypeId;
            this.GetItem(new HttpParams()).subscribe({
                next: result => {
                    if(result !== null){
                        this.foodTypeDetail = result;

                        this.foodTypeForm.setValue({
                            id: result.id,
                            typeName: result.typeName,
                            active: result.active
                        });

                        this.showInfo('Updated Food Type');
                    }
                },
                error: error => {
                    console.log(error);
                }
            });
        }
    }

    goBack = () => {
        this.router.navigateByUrl('/admin/food-type-list');
    }

    formControlValidation(name:string){
        return (this.foodTypeForm.get(name)?.invalid && (this.foodTypeForm.get(name)?.dirty || this.foodTypeForm.get(name)?.touched))
    }

    submitForm = (forms:FormGroup) => {
        if(forms.valid){
            let body = {
                FoodType: forms.value
            };
            this.baseUrl = environment.inventory.foodtype;
            this.action = null;
            this.Create(body).subscribe({
                next: result => {
                    if(result !== null){
                        if(result.id !== ""){
                            this.router.navigateByUrl('/admin/food-type-list');
                        }else{
                            this.showError('Change the Type Name since it already exists');
                        }
                    }
                },
                error: error=>{
                    console.log(error);
                }
            })
        }else{
            this.showError('Enter Required Fields');
        }
    }

}