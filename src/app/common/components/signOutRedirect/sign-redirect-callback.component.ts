import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-signout-redirect-callback',
    template:'<div></div>'
})

export class SignoutRedirectComponent implements OnInit {

    constructor(private authService: AuthService,private router:Router){}

    ngOnInit(){
        this.authService.finishLogout().then(()=>{
            this.router.navigate(['/']);
        });
    }
}