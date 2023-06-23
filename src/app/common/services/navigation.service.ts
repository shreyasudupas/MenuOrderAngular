import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'

@Injectable({
    providedIn:'root'
})

export class NavigationService{
    public history:string[] = [];

    constructor(private router:Router,private location:Location) { }

    public startSaveHistory(route:string){
        this.history.push(route);
        console.log(this.history);
    }

    public goBack() {
        this.history.pop();

        if(this.history.length > 0) {
            //this.location.back();
            let url = this.history[this.history.length - 1];
            this.router.navigateByUrl(url);
        }else{
            this.router.navigateByUrl("/")
        }
    }

    public removeHistory(){
        this.history.pop();
    }
}
