import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { User } from 'oidc-client';
import { MessageService, SelectItem, SelectItemGroup } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { Notification } from 'src/app/common/components/notification/notification';
import { UserProfileInfo } from 'src/app/common/components/user-profile/userProfile';
import { GET_USER_LIST_INFO, UserListInfoResponse } from 'src/app/common/graphQl/querries/getUserListQuery';
import { AuthService } from 'src/app/common/services/auth.service';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'notification-detail',
    templateUrl: './notification-detail.component.html',
    styleUrls: ['./notification-detail.component.scss']
})

export class NotificationDetailComponent extends BaseComponent<Notification> implements OnInit {
notificationForm: FormGroup;
userListDropDown: SelectItemGroup[];
notificationId:string;
users:UserProfileInfo[];
currentUser:User;
visible:boolean = false;

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public broadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router: Router,
        messageService:MessageService,
        public navigation:NavigationService,
        private fb:FormBuilder,
        private apollo:Apollo,
        private authService:AuthService
    ){
        super(menuService,httpclient,broadcastService,messageService)
    }
    
    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.navigation.startSaveHistory('admin/notification-detail');

        this.currentUser = this.authService.getUserInformation();
        //console.log(this.navigation.history);

        this.notificationForm = this.fb.group({
            id: [''],
            title: ['',Validators.required],
            description: ['',Validators.required],
            //fromUserId: ['',Validators.required],
            toUserId:[''],
            recordedTimeStamp: [{value:'',disabled:true}],
            link: [''],
            sendAll:[false],
            read: [{value:false,disabled:true}]
        });

        this.notificationId = this.activatedRoute.snapshot.params['id'];
        if(this.notificationId !== undefined){
            if(this.notificationId !== '0') {
                this.getNotificationById();
            }
        }

        this.getUserList();
        this.sendAllChanges();
    }

    sendAllChanges() {
        this.notificationForm.get('sendAll').valueChanges.subscribe({
            next: result => {
                //console.log('sendAll: '+ result)
                if(result === true) {
                    this.visible = true;
                } else {
                    this.visible = false;
                }
            }
        });
    }

    getUserList() {
        this.apollo.watchQuery<UserListInfoResponse>({
            query: GET_USER_LIST_INFO
        }).valueChanges.subscribe({
            next: result => {
                if(result !== null) {
                    this.users = result.data.userList;

                    this.userDropdownCalculate(this.users);

                }
            },
            error: err => {
                console.log('User List GraphQl Error ',err);
            }
        });
    }

    userDropdownCalculate(users:UserProfileInfo[]) {
        this.userListDropDown = [];

        //group by admin
        let adminUsers = users.filter(u=>u.userType == "Admin");
        this.userListDropDown.push({
            label: 'Admin',
            value: 'admin',
            items: []
        });

        this.userListDropDown[0].items = adminUsers.map(admin => {
            let item:SelectItem = {
                label: admin.fullname,
                value: admin.id
            };

            return item;
        });

        let userUsers  = users.filter(u=>u.userType == "User");
        this.userListDropDown.push({
            label: 'User',
            value: 'user',
            items: []
        });

        this.userListDropDown[1].items = userUsers.map(user => {
            let item:SelectItem = {
                label: user.fullname,
                value: user.id
            };

            return item;
        });

        let vendorUsers = users.filter(u=>u.userType == "Vendor");
        this.userListDropDown.push({
            label: 'Vendor',
            value: 'vendor',
            items: []
        });

        this.userListDropDown[2].items = vendorUsers.map(vendor => {
            let item:SelectItem = {
                label: vendor.fullname,
                value: vendor.id
            };

            return item;
        });
    }

    submit() {
        if(this.notificationForm.valid){
            //console.log(this.notificationForm.value);
            let sendAllValue = this.notificationForm.controls['sendAll'].value;

            let body:Notification = {
                id:this.notificationForm.controls['id'].value,
                title: this.notificationForm.controls['title'].value,
                description: this.notificationForm.controls['description'].value,
                fromUserId: (sendAllValue === true)? '': this.currentUser.profile['userId'],
                toUserId: this.notificationForm.controls['toUserId'].value,
                role: this.currentUser.profile['role'],
                link:'',
                recordedTimeStamp: (this.notificationForm.controls['recordedTimeStamp'].value === ''?new Date():this.notificationForm.controls['recordedTimeStamp'].value),
                read: this.notificationForm.controls['read'].value,
                sendAll: sendAllValue
            };
            //console.log(body);

            if(body.id === ''){
                this.addNotification(body);
            } else {
                this.editNotification(body);
            }

        }
    }

    addNotification(body:Notification) {
        this.baseUrl = environment.notification;
        this.action = null;

        this.Create(body).subscribe({
            next: result => {
                if(result !== null) {
                    setTimeout(()=>{
                        this.showInfo('Successfully Updated');

                        this.router.navigateByUrl('admin/notification-dashboard');
                    },1000);
                } else {
                    this.showError('Error occured in the server');
                }
            },
            error: err => {
                console.log('Error occured in Add Notification ',err);
                this.showError('Error occured in the server');
            }
        });
    }

    editNotification(body:Notification) {
        this.baseUrl = environment.notification;
        this.action = null;

        this.UpdateItem(body).subscribe({
            next: result => {
                if(result !== null) {
                    this.showInfo('Saved Successfully');
                } else {
                    this.showError('Error occured in the server');
                }
            },
            error: err => {
                console.log('Error occured in Add Notification ',err);
                this.showError('Error occured in the server');
            }
        });
    }

    getNotificationById() {
        this.baseUrl = environment.notification;
        this.action = null;
        let params = new HttpParams().set('id',this.notificationId);

        this.GetItem(params).subscribe({
           next: result => {
                if(result != null) {
                    this.setNotificationForm(result);
                }
           } 
        });
    }

    setNotificationForm(body:any) {
        this.notificationForm.patchValue({
            id: body.id,
            title: body.title,
            description: body.description,
            userId: body.userId,
            recordedTimeStamp: body.recordedTimeStamp,
            link: body.link,
            sendAll:body.sendAll,
            read: body.read
        });
    }

    goBack() {
        this.navigation.goBack();
    }
}