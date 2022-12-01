import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment as env} from 'src/environments/environment';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { User } from 'oidc-client';
import { UserInfo } from '../../models/userInfo';
import { CommonDataSharingService } from '../../services/common-datasharing.service';
import { AuthService } from '../../services/auth.service';

const GET_USER_INFO = gql`
query GetUserInformation($userId:String!){
  userInformation (userId:$userId){
    id
    userName
    email
    cartAmount
    points
    isAdmin
    imagePath
    address {
      id
      fullAddress
      city
      area
      state
      stateId
      isActive
      city
      cityId
      area
      areaId
    }
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
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit, OnDestroy {
  private querySubscription!: Subscription
  user!:UserInfo;
  loading:boolean = true;
  userRole!:string;
  userProfile!:User;

  constructor(
    private apollo:Apollo,
    private authService:AuthService
    ,private _broadcastService:CommonDataSharingService) { }
  
  ngOnInit(): void {
    debugger
    this.userProfile = this.authService.getUserInformation()!;

    this.querySubscription = this.apollo
    .watchQuery<UserInfoResponse,UserInfoVariable>({
      query: GET_USER_INFO,
      variables:{
        userId: this.userProfile.profile["userId"]
      }
    })
    .valueChanges.subscribe(({data,loading}) => {
      //debugger
        this.user = data.userInformation
        this.loading = loading;

        //set image location
        let serverPath = env.auth.idpAuthority + "/images/";
        let imageName = this.user.imagePath;
        if(this.user.imagePath !== null){
          //this.user.imagePath = serverPath + this.user.imagePath;
          this.user = {...this.user, imagePath: serverPath + imageName}
        }else{
          this.user.imagePath = serverPath + "/profile-default.jpg";
        }

        //set user Role
        this.userRole = this.userProfile.profile["role"];

        if(this.userRole == "user"){
          //update in data sharing
          this._broadcastService.updateUserInfo(this.user);
        }
        

    })
  }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }
}
