import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})

export class AdminAuthGaurd implements CanActivate{

    constructor(public authService:AuthService,
        private router: Router,){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        //debugger;
        const roles = route.data['roles'];

        if(this.checkIfUserIsAuthenticated()){
            if(this.checkIfUserIsAdmin(roles)){
                return true;
            }else{
                return false;
            }
        }
        return false;
    }

    async checkIfUserIsAuthenticated(){
        const isAuthenticated = await this.authService.isAuthenticated();

        if(isAuthenticated){
            return true;
        }

        this.router.navigate(['/']);
        return false;
    }

    checkIfUserIsAdmin(role:string){
        const userRole = this.authService.GetUserRole();
        if( role && role.indexOf(userRole) === -1){
            this.router.navigate(['forbidden']);
            return false;
        }else{
            return true;
        }
    }
}