import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { CommonDataSharingService } from "src/app/common/services/common-datasharing.service";
import { MenuService } from "src/app/common/services/menu.service";
import { environment } from "src/environments/environment";
import { CuisineType } from "./cuisine-type";

@Component({
    selector:'cuisine-details',
    templateUrl:'./cuisine-details.component.html',
    providers:[MessageService]
})

export class CuisineDetailsComponent extends BaseComponent<CuisineType> implements OnInit {

    cuisineTypeDetail:CuisineType = { id:'',cuisineName:'',active:true };
    cuisineTypeForm!:FormGroup;
    header:string='';
    cuisineTypeId:string='';

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

        this.cuisineTypeForm = this.fb.group({
            id: [''],
            cuisineName: ['',Validators.required],
            active: [true]
        });

        this.cuisineTypeId = this.activatedRoute.snapshot.params['cuisineId'];
        if(this.cuisineTypeId === '0'){
            this.header = "Add New Cuisine Type";
        }else{
            this.header = "Edit Cuisine Type";

            this.baseUrl = environment.inventory.cuisineType;
            this.action = this.cuisineTypeId;
            this.GetItem(new HttpParams()).subscribe({
                next: result => {
                    if(result !== null){
                        this.cuisineTypeDetail = result;

                        this.cuisineTypeForm.setValue({
                            id: result.id,
                            cuisineName: result.cuisineName,
                            active: result.active
                        });

                        this.showInfo('Updated Cuisine Type');
                    }
                },
                error: error => {
                    console.log(error);
                }
            });
        }
    }

    goBack = () => {
        this.router.navigateByUrl('/admin/cuisine-list');
    }

    formControlValidation(name:string){
        return (this.cuisineTypeForm.get(name)?.invalid && (this.cuisineTypeForm.get(name)?.dirty || this.cuisineTypeForm.get(name)?.touched))
    }

    submitForm = (forms:FormGroup) => {
        if(forms.valid){
            if(forms.value.id === ''){
                this.addNewCuisineForm(forms);
            }
        }else{
            this.showError('Enter Required Fields');
        }
    }

    addNewCuisineForm = (forms:FormGroup) => {
        let body = {
            CuisineType: forms.value
        };
        this.baseUrl = environment.inventory.cuisineType;
        this.action = null;
        this.Create(body).subscribe({
            next: result => {
                if(result !== null){
                    if(result.id !== ""){
                        this.router.navigateByUrl('/admin/cuisine-list');
                    }else{
                        this.showError('Change the Cuisine Name since it already exists');
                    }
                }
            },
            error: error=>{
                console.log(error);
            }
        });
    }
}