import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { Category } from './category';

@Component({
    selector:'category-list',
    templateUrl:'./category-detail.component.html'
})

export class CategoryDetailComponent extends BaseComponent<Category[]> implements OnInit{
categoryDetailForm!:FormGroup;
id:string='';
vendorId:string='';

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private route:Router,
        private fb:FormBuilder
    ){
        super(menuService,httpclient,commonBroadcastService)   
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.id = this.activatedRoute.snapshot.params['categoryId'];

        this.vendorId = history.state.vendorId;
        

        this.categoryDetailForm = this.fb.group({
            id: [''],
            name: ['',Validators.required],
            description: [''],
            active: [false]
        })
    }

    goBack = () => {
        if(this.vendorId !== undefined){
            this.route.navigateByUrl('/admin/vendor-detail/'+ this.vendorId);
        }else{
            this.route.navigateByUrl('/admin/vendor');
        }
        
    }

}