import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { GET_USER_INFO, UserInfoResponse, UserInfoVariable } from '../../graphQl/querries/getUserInformationsQuery';
import { SAVE_USERINFO, SaveUserInfoVariables, SaveUserInformationResponse } from '../../graphQl/mutations/saveUserInformationMutation';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: [ './user-profile.component.scss' ]
})

export class UserProfileComponent extends BaseComponent<any> implements OnInit , OnDestroy {
graphQlQuerySub: Subscription;
userInfo:UserProfileInfo;
profileForm: FormGroup;
mutationGraphQLSub:Subscription;
imageUrl:string;

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

        let user = this.authService.getUserInformation();
        if(user !== null){

            this.profileForm = this.fb.group({
                id: [''],
                userName: [{value:'',disabled:true}],
                userType: [{value:'',disabled:true}],
                cartAmount: [{ value:0,disabled: (user.profile['role'] === 'user')? false:true }],
                points: [{ value:0,disabled: (user.profile['role'] === 'user')? false:true }],
                email: ['',Validators.required],
                emailConfirmed: [false,Validators.required],
                phoneNumber: ['',Validators.required],
                phoneNumberConfirmed: [false],
                enabled: [{value:false,disabled:true}]
            });

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

                    this.imageUrl = environment.idsConfig.imageUrl + this.userInfo.imagePath;

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
        });

    }

    submitUserInfo() {
        if(this.profileForm.valid) {

            let user = {
                id: this.profileForm.controls['id'].value,
                userName: this.profileForm.controls['userName'].value,
                userType: this.profileForm.controls['userType'].value,
                cartAmount: this.profileForm.controls['cartAmount'].value,
                points: this.profileForm.controls['points'].value,
                email: this.profileForm.controls['email'].value,
                emailConfirmed: this.profileForm.controls['emailConfirmed'].value,
                phoneNumber: this.profileForm.controls['phoneNumber'].value,
                phoneNumberConfirmed: this.profileForm.controls['phoneNumberConfirmed'].value,
                enabled: this.profileForm.controls['enabled'].value
            };

        //console.log(this.profileForm.value)
        this.saveUserInformation(user);

        } else {
            alert('Add Necessary Fields and then click on ')
        }
    }

    saveUserInformation(userProfile:any) {
        this.mutationGraphQLSub = this.apollo.mutate<SaveUserInformationResponse,SaveUserInfoVariables>({
            mutation: SAVE_USERINFO,
            variables: {
                saveUser: {
                    id: userProfile.id,
                    userName: userProfile.userName,
                    email: userProfile.email,
                    cartAmount: userProfile.cartAmount,
                    points: userProfile.points,
                    emailConfirmed: userProfile.emailConfirmed,
                    phoneNumber: userProfile.phoneNumber,
                    phoneNumberConfirmed: userProfile.phoneNumberConfirmed,
                    enabled: userProfile.enabled,
                    userType: userProfile.userType
                }
            }
        }).subscribe({
            next: result => {
                if(result.data.modifyUserInformation.result === true) {
                    this.showInfo('Saved Successfully');
                } else {
                    this.showError('Error has occured in saving the information');
                }
            },
            error: err => {
                console.log('Error occured in modifyUserInformation GraphQl mutation ',err);
            }
        });
    }

    uploadImage(event:any) {
        //console.log(event);
        
        if(this.userInfo.id !== undefined) {
            let url = environment.idsConfig.utility + '/v2/UploadPhoto'
            
            let body = {
                userId: this.userInfo.id,
                imageUrl: event.imageData,
                type: event.imageType
            };

            this.addImage(url,body);
        }
    }

    addImage(url:string,body:any) {
        
        this.httpclient.post(url,body).subscribe({
            next: result => {
                if(result !== null) {
                    this.showInfo('Image added successfully');
                } else {
                    this.showError('Something went wrong');
                }
            },
            error: err => {
                console.log('Error adding the image in IDS Server ',err);
            }
        })
    }

    deleteProfileImage(event:true) {
        console.log(event);
    }

    ngOnDestroy(): void {
        if(this.graphQlQuerySub !== undefined)
            this.graphQlQuerySub.unsubscribe();
        
        if(this.mutationGraphQLSub !== undefined)
            this.mutationGraphQLSub.unsubscribe();
    }
}