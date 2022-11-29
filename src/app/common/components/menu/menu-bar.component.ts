import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CommonDataSharingService } from '../../services/common-datasharing.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html'
})
export class MenuBarComponent implements OnInit {

  items: MenuItem[]=[];
  activeItem!: MenuItem;
  subscription!: Subscription;

  constructor(private commonBroadcastService:CommonDataSharingService) { }

  ngOnInit(): void {

    this.subscription = this.commonBroadcastService.getActiveMenuList().subscribe((result)=>{
        if(result !== null){
            this.items = result.itemList;
            this.activeItem = result.activeMenu;
        }
    });

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
