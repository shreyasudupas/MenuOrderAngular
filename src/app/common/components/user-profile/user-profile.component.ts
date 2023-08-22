import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { User } from 'oidc-client';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonDataSharingService } from '../../services/common-datasharing.service';
import { MenuService } from '../../services/menu.service';
import { NavigationService } from '../../services/navigation.service';
import { BaseComponent } from '../base/base.component';
import { UserProfileInfo } from './userProfile';

const GET_USER_INFO = gql`
query GetUserInformation($userId:String!){
  userInformation (userId:$userId){
    id
    userName
    imagePath
    imagePath
    userType
    cartAmount
    points
    email
    emailConfirmed
    phoneNumber
    phoneNumberConfirmed
    enabled
  }
}
`

interface UserInfoResponse{
  userInformation:UserProfileInfo;
}

interface UserInfoVariable{
  userId: string;
}

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: [ './user-profile.component.scss' ]
})

export class UserProfileComponent extends BaseComponent<any> implements OnInit , OnDestroy {
graphQlQuerySub: Subscription;
userInfo:UserProfileInfo;
profileForm: FormGroup;

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public broadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router: Router,
        messageService:MessageService,
        public navigation:NavigationService,
        private apollo:Apollo,
        private authService:AuthService,
        private fb:FormBuilder
    ){
        super(menuService,httpclient,broadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.profileForm = this.fb.group({
            id: [''],
            userName: [''],
            userType: [''],
            cartAmount: [0],
            points: [0],
            email: ['',Validators.required],
            emailConfirmed: [false,Validators.required],
            phoneNumber: ['',Validators.required],
            phoneNumberConfirmed: [false],
            enabled: [false]
        });

        let user = this.authService.getUserInformation();
        if(user !== null){
            this.getUserInfoByQraphQL(user);
        }
    }

    getUserInfoByQraphQL(user:User) {
        this.graphQlQuerySub =  this.apollo.watchQuery<UserInfoResponse,UserInfoVariable>({
            query: GET_USER_INFO,
            variables: {
                userId: user.profile["userId"]
            }
        }).valueChanges.subscribe({
            next: result => {
                if(result.data !== null) {
                    this.userInfo = {...this.userInfo,...result.data.userInformation};

                    //console.log(this.userInfo);
                    this.updateForm()
                }
            },
            error: error => console.log('Error Fetching the graph QL query',error)
        });
    }

    updateForm() {
        this.profileForm.setValue({
            id: this.userInfo.id,
            userName: this.userInfo.userName,
            userType: this.userInfo.userType,
            cartAmount: this.userInfo.cartAmount,
            points: this.userInfo.points,
            email: this.userInfo.email,
            emailConfirmed: this.userInfo.emailConfirmed,
            phoneNumber: this.userInfo.phoneNumber,
            phoneNumberConfirmed: this.userInfo.phoneNumberConfirmed,
            enabled: this.userInfo.enabled
        })
    }

    ngOnDestroy(): void {
        this.graphQlQuerySub.unsubscribe();
    }
}