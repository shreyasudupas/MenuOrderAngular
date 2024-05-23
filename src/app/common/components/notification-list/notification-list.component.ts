import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification, NotificationDataRequestType } from 'src/app/common/components/notification/notification';
import { ApiClientManager } from '../base/api-client-manager';
import { HttpClient } from '@angular/common/http';
import { mergeMap, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss']
})

export class NotificationListComponent extends ApiClientManager<any> implements OnInit {
    notifications:Notification[]=[];
    @Input() 
    userId:string;
    loading:boolean=false;
    skip:number = 0;
    totalRecordsToDisplay:number = 5;

    constructor(private notificationService:NotificationService,
        private httpClient:HttpClient
    ) {
        super(httpClient)
    }

    ngOnInit(): void {
        this.getNotifications(this.skip,this.totalRecordsToDisplay);
    }

    getNotifications = (skip:number,take:number) => {
        this.notificationService.getAllNotifications(this.userId,skip,take).then(result => {
            this.loading = false;
            this.notifications = [...this.notifications, ...result];
        }).catch(err => console.log('Error Occured in recieving the Notification list ',err));
    }

    onScroll = () => {
        this.loading = true;
        this.skip = this.skip + this.totalRecordsToDisplay;

        this.getNotifications(this.skip,this.totalRecordsToDisplay);

    }

    acceptNotification = (notification:Notification) => {
        this.notifications = this.notifications.map(notify=> notify.id === notification.id? {...notify,read:true}:{...notification});
    }

    acceptNotificationAction = (currentNotification:Notification) => {
        let body = JSON.parse(currentNotification.data.body);
        this.requestUri = currentNotification.data.uri;
        
        this.callApiWithBody(currentNotification.data.requestType,body).pipe(
            mergeMap( (result:any) => {
                let url = environment.notification.concat('/',currentNotification.id,'/updateRead');
                let notificationUpdate = this.httpClient.post(url,null);
                return notificationUpdate;
            })
        ).subscribe({
            next: (result:any) => {
                this.notifications = this.notifications.map((notification:Notification)=> notification.id === currentNotification.id? 
                {...notification,read:true}
                : {...notification});
            },
            error: (err:any) => console.log(`Error occured when executing url: ${err}`)
        });
    }

    @HostListener('unloaded')
    ngOnDestroy() {
        console.log('Notification list Component destroyed');
    }
    
}