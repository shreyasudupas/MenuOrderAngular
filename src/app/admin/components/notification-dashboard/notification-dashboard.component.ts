import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { environment as env } from 'src/environments/environment';
import { Notification } from 'src/app/common/components/notification/notification';

@Component({
    selector: 'notification-dashboard',
    templateUrl: './notification-dashboard.component.html',
    styleUrls: ['./notification-dashboard.component.scss']
})

export class NotificationDashboardComponent extends BaseComponent<Notification> implements OnInit {
notifications:Notification[];

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
        
        this.getAllNotifications();
    }

    getAllNotifications() {
        this.baseUrl = env.notification;
        this.action = 'list'

        this.ListItems(null).subscribe({
            next: result => {
                if(result !== null)
                    this.notifications = result;
            },
            error: err => {
                console.log('Error Occured in Notification Dashboard ',err);
            }
        });
    }

    goToDetailPage(id:string) {
        this.router.navigateByUrl('/admin/notification-detail/'+ id);
    }

    editPage(id:string) {
        this.router.navigateByUrl('/admin/notification-detail/'+ id);
    }
}