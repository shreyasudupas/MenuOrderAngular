import { Component } from '@angular/core';

@Component({
    selector: 'user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.scss','../../../../styles.scss']
})

export class UserDashboardComponent {
    sidebarVisible:boolean=false;

    displaySideMenuBar(){
        this.sidebarVisible = true;
    }  
}