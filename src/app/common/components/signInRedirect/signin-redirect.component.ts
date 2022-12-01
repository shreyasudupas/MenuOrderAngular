import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-signin-redirect-callback',
    template: ''
})

export class SigninRedirectCallbackComponent implements OnInit {

    constructor(private _authService: AuthService, private _router: Router) { }
    
    ngOnInit(): void {
        //console.log('SigninRedirectCallbackComponent loaded');

        this._authService.finishLogin().then(() => {
            //debugger
            this._authService.CheckIfUserIsAppUser()
            .then( res => {
                if(res){
                    this._router.navigate(['/user'],{ replaceUrl:true });
                }
            });

            this._authService.CheckIfAdmin()
            .then( res => {
                if(res){
                    this._router.navigate(['/admin'],{ replaceUrl:true });
                }
            });
        })
    }
}