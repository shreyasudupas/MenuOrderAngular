import { Component, OnInit  } from '@angular/core'

@Component({
    selector: 'admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: [ './admin-dashboard.component.scss' ]
})

export class AdminDashboardComponent {
    sidebarVisible:boolean=false;

    displaySideMenuBar(){
        this.sidebarVisible = true;
    } 
    
}