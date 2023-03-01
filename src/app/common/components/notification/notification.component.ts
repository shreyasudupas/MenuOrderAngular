import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Notification } from 'src/app/common/components/notification/notification';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { SignalrService } from '../../services/signalr.service';

@Component({
    selector: 'notification',
    templateUrl:'./notification.component.html',
    styleUrls:['./notification.component.css'],
    providers: [MessageService]
})

export class NotificationComponent implements OnInit{
    notificationsList:Notification[] = [];
    selectedNotification:Notification[]=[];
    loading:boolean=false;
    userId:string='';
    @ViewChild('op') overlayId;

    constructor(private notificationService:NotificationService,
        private authService:AuthService
        ,private router:Router
        ,private messageService:MessageService
        ,public signalRService: SignalrService){  
    }

    ngOnInit(): void {

        this.signalRService.startConnection();
        this.signalRService.addNotificationCountListener();

        let user = this.authService.getUserInformation();
        if(user !== null){
            this.userId = user.profile['userId'];

            this.notificationsList = Array.from({length:1000});

            this.notificationService.getNotificationCount(this.userId).subscribe({
                next: result => {
                    //this.newNotificationCount = result.toString();
                    this.signalRService.data = result;
                    //console.log(result);
                },
                error: err => {
                    console.log('error in fetching notification count');
                }
            });
        }

        
        
    }

    loadNotifcationLazy = ( event: LazyLoadEvent ) => {
        this.loading = true;

        setTimeout(()=>{

            if(event != undefined){
                //this.loading=false;
                this.notificationService.getAllNotifications(this.userId,event.first!,event.rows!).then((result)=>{
                    this.loading = false;
                    //this.notificationsList = result;

                    //populate page of virtual notifcations
                    Array.prototype.splice.apply(this.notificationsList, [
                        ...[event.first!, event.rows],
                         ...result
                    ]);

                    console.log(this.notificationsList);

                    this.selectedNotification = result.filter(n=>n.read == false);

                    //trigger change detection
                    event.forceUpdate!();
                }).catch(err=>console.log(err));
            }
        },750);
    }

    //when user clicks on the row then it means its read , hence update the notification
    onNotificationUnselect = ($event) => {
        let selectedNotification = $event.data;
        
        this.updateNotification(selectedNotification);
        
    }

    goToPage = (notification:Notification) => {
        if(notification.link != ""){
            this.updateNotification(notification);
            this.overlayId.hide();
            this.router.navigateByUrl(notification.link);

        }
    }

    updateNotification = (update_value:Notification) => {
        this.notificationService.updateNotification(update_value).subscribe({
            next: result => {
                if(result == null){
                    this.messageService.add({severity:'error',summary:'Error',detail:'Error in Notification'});
                }else{
                    //console.log('updated notification')
                    this.notificationsList.map((notification,i)=>{
                        if(notification !== undefined){
                            if(notification.id == update_value.id){
                                notification.read = true;
                            }
                        }
                    });
                    //console.log(this.notificationsList);
                }
            },
            error: error => {
                console.log(error);
            }
        })
    }

    ngOnDestroy(){
        this.signalRService.disconnectHubConnection();
    }
}