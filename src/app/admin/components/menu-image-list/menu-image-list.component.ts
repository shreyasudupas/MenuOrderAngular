import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { ImageResponse } from '../menu-image-details/image-response';

@Component({
    selector:'menu-image-list',
    templateUrl: './menu-image-list.component.html',
    providers: [MessageService,ConfirmationService]
})

export class MenuImageListComponent extends BaseComponent<ImageResponse> implements OnInit{

    imageList:ImageResponse= { totalRecord:0,imageData:[] };
    loading: boolean=true;
    totalRecords:number=0;

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        messageService: MessageService,
        private confirmationService: ConfirmationService){
            super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        
    }

    loadImages = (event: LazyLoadEvent) => {
        this.loading = true;
        console.log(event);

        setTimeout(()=>{
            this.baseUrl = environment.inventory.imageMenu;
            this.action = 'list';
            let url = this.baseUrl + '/' + this.action;

            let params = new HttpParams()
            .set('Size',event.rows?.toString()!)
            .set('Skip',event.first?.toString()!);

            this.httpclient.get<ImageResponse>(url,{params: params}).subscribe({
                next: result => {
                    this.imageList.imageData = result.imageData;
                    this.totalRecords = result.totalRecord;

                    this.loading=false;
                }
            });
            
        },1000);
        
    }

    goToDetailPage = (menuImageId:string) => {
        this.router.navigate(['admin/image-menu-details',menuImageId]);
    }
    
}