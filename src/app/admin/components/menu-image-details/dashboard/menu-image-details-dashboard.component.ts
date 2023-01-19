import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { MenuImage } from '../menu-image';

@Component({
    selector: 'menu-image-dashboard',
    templateUrl: './menu-image-details-dashboard.component.html',
    providers: [MessageService,ConfirmationService]
})

export class MenuImageDetailsDashboardComponent extends BaseComponent<any> implements OnInit {
    menuImageId:string = '';
    items: MenuItem[]=[];
    activeIndex:number=0;
    activeDetails:boolean = true;
    menuFormDetails!:FormGroup;

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        messageService: MessageService,
        private fb:FormBuilder,
        private confirmationService: ConfirmationService){
            super(menuService,httpclient,commonBroadcastService,messageService)

            this.menuFormDetails = fb.group({
                id: [''],
                itemName: ['',Validators.required],
                data: [''],
                description:[''],
                active: [true]
            });
    }

    ngOnInit(): void {
        
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.menuImageId = this.activatedRoute.snapshot.params['menuImageId'];

        this.items = [
            {label: 'Image Menu List' , routerLink: ['/admin/image-menu-list']},
            {label: 'Image Menu Details'},
            {label: 'Enter Image'}
        ];
        this.activeIndex = 1;

        if(this.menuImageId != undefined)
        {
            if(this.menuImageId != '0'){
                
            }else{
                
            }
            
        }
    }

    updateActiveIndex = ($event:any) => {
        this.activeIndex = $event;
        this.activeDetails = !this.activeDetails;
    }

    updateForms = ($event:any) => {
        this.menuFormDetails.setValue({
            id: $event.id,
            itemName: $event.itemName,
            active: $event.active,
            description: $event.description,
            data: $event.data
        });
    }

}