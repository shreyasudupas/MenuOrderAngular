import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonDataSharingService } from '../../services/common-datasharing.service';
import { MenuService } from '../../services/menu.service';
import { NavigationService } from '../../services/navigation.service';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: [ './user-profile.component.scss' ]
})

export class UserProfileComponent extends BaseComponent<any> implements OnInit {

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public broadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router: Router,
        messageService:MessageService,
        public navigation:NavigationService
    ){
        super(menuService,httpclient,broadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();
    }
}