import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserInfo } from '../../models/userInfo';
import { AuthService } from '../../services/auth.service';

const GET_USER_INFO = gql`
query GetUserInformation($userId:String!){
  userInformation (userId:$userId){
    id
    userName
    cartAmount
    points
    userType
    imagePath
  }
}
`

interface UserInfoResponse{
  userInformation:UserInfo;
}

interface UserInfoVariable{
  userId: string;
}

@Component({
    selector: 'notification-profile',
    templateUrl: './notification-profile.component.html',
    styleUrls: [ './notification-profile.component.scss' ]
})

export class NotificationProfileComponent implements OnInit,OnDestroy {
    private querySubscription!: Subscription;
    loading:boolean = true;
    points:bigint;
    username:string;
    userProfileImageLocation:string;
    userProfileLink:string;

    @Input()
    userId:string;
    
    constructor(private apollo:Apollo,
      private authService:AuthService) 
    {}
    ngOnInit(): void {
        
        if(this.userId === undefined) {
            console.log('Notification Profile Component requires UserId');
        }
        else{
            this.getUserProfile();
        }
    }

    getUserProfile() {
        this.querySubscription = this.apollo
        .watchQuery<UserInfoResponse,UserInfoVariable>({
          query: GET_USER_INFO,
          variables:{
            userId: this.userId
          }
        })
        .valueChanges.subscribe(({data,loading}) => {
          if(loading){
            this.loading = true;
          }else {

            if(data.userInformation != null){
              this.loading = false;

              this.username = data.userInformation.userName;
              this.points = data.userInformation.points;
              this.userProfileImageLocation = environment.idsConfig.imageServerPath +  data.userInformation.imagePath;

              let role = this.authService.GetUserRole();
              this.userProfileLink = role + '/profile';
            }
          }
        })
    }

    ngOnDestroy(): void {
        this.querySubscription.unsubscribe();
    }
}