import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn:'root'
})

export class VendorAuthGaurd implements CanActivate{
    
    constructor(public authService:AuthService,
        private router: Router,){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        
        const roles = route.data['roles'];

        if(this.checkIfUserIsAuthenticated()){
            if(this.checkIfUserIsvendor(roles)){
                return true;
            }else{
                return false;
            }           
        }
        else{
            return false;
        }
    }

    async checkIfUserIsAuthenticated(){
        const isAuthenticated = await this.authService.isAuthenticated();

        if(isAuthenticated){
            return true;
        }

        this.router.navigate(['/']);
        return false;
    }

    checkIfUserIsvendor(role:string){

        const userRole = this.authService.GetUserRole();
        if( role && role.indexOf(userRole) === -1){
            this.router.navigate(['forbidden']);
            return false;
        }else{
            return true;
        }
    }

}