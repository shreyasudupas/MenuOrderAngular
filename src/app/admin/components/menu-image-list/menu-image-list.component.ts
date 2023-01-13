import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { ImageResponse } from '../menu-image-details/image-response';
import { MenuImage } from '../menu-image-details/menu-image';

@Component({
    selector:'menu-image-list',
    templateUrl: './menu-image-list.component.html',
    providers: [MessageService,ConfirmationService]
})

export class MenuImageListComponent extends BaseComponent<ImageResponse> implements OnInit{

    imageList:ImageResponse[]=[];

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

        this.baseUrl = environment.inventory.imageMenu;
        this.action = 'list';

        this.ListItems(new HttpParams()).subscribe({
            next: result => {
                this.imageList = result;
            }
        })
    }
    
}