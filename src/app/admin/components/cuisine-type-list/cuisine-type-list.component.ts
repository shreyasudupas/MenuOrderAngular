import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { CuisineType } from '../cuisine-type-details/cuisine-type';

@Component({
    selector: 'cuisine-list',
    templateUrl: './cuisine-type-list.component.html',
    providers:[MessageService]
})

export class CuisineListDetails extends BaseComponent<CuisineType> implements OnInit {
cuisineList:CuisineType[]=[];

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

        this.baseUrl = environment.inventory.cuisineType;
        this.action = "list";

        this.ListItems(httpParams).subscribe({
            next: result => {
                //console.log(result);
                if(result !== null){
                    this.cuisineList = result;

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
        this.router.navigateByUrl('/admin/cuisine-details/' + id);
    }
    
}