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

            let role = this._authService.GetUserRole();
            let url = '/' + role;

            this._router.navigate([url],{ replaceUrl: true});
        });

        
    }
}