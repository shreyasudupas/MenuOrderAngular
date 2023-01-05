import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { FoodType } from '../food-type-details/food-type';

@Component({
    selector:'food-types-list',
    templateUrl:'./food-type-list.component.html',
    providers:[MessageService]
})

export class FoodTypeListComponent extends BaseComponent<FoodType> implements OnInit{
foodtypeList:FoodType[]=[];

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public broadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router: Router,
        messageService:MessageService
    ){
        super(menuService,httpclient,broadcastService,messageService)
    }

    ngOnInit(): void {

        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        let httpParams = new HttpParams();
        httpParams.append('isActive',false);

        this.baseUrl = environment.inventory.foodtype;
        this.action = "list";

        this.ListItems(httpParams).subscribe({
            next: result => {
                //console.log(result);
                if(result !== null){
                    this.foodtypeList = result;

                }else{
                    this.showError('Error in getting the Food type Details')
                }
            },
            error: error => {
                console.log(error);
                this.showError('Error in getting the Food type Details')
            }
        });
    }

    goToDetailPage = (id:string) => {
        this.router.navigateByUrl('/admin/food-type-details/' + id);
    }
    
}