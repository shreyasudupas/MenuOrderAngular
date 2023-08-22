import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/common/module/primeng.module';
import { MenuBarComponent } from '../components/menu/menu-bar.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { NotificationComponent } from '../components/notification/notification.component';
import { VendorDetailComponent } from 'src/app/admin/components/vendor-details/vendor-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorUserListComponent } from 'src/app/admin/components/vendor-user-list/vendor-user-list.component';
import { CategoryListComponent } from 'src/app/admin/components/category-list/category-list.component';
import { VendorMenuList } from 'src/app/admin/components/vendor-menu-list/vendor-menu-list.component';
import { CategoryDetailComponent } from 'src/app/admin/components/categories/category-detail.component';
import { MenuDetailsComponent } from 'src/app/admin/components/menu-details/menu-details.component';
import { ImmageSelectionListComponent } from 'src/app/admin/components/image-selection-list/image-selection-list.component';
import { VendorImageUploadComponent } from 'src/app/admin/components/vendor-image/vendor-image-upload.component';
import { ScrollBottomToTopComponent } from '../components/scroll-botton-top/scroll-buttom-top.component';
import { VendorMapComponent } from '../components/vendor-map/vendor-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NotificationProfileComponent } from '../components/notification-profile/notification-profile.component';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({
  declarations: [
    MenuBarComponent,
    ProfileComponent,
    NotificationComponent,
    VendorDetailComponent,
    VendorUserListComponent,
    CategoryListComponent,
    CategoryDetailComponent,
    MenuDetailsComponent,
    ImmageSelectionListComponent,
    VendorMenuList,
    VendorImageUploadComponent,
    ScrollBottomToTopComponent,
    VendorMapComponent,
    NotificationProfileComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    LeafletModule,
    InfiniteScrollModule 
  ],
  exports:[
    MenuBarComponent,
    ProfileComponent,
    NotificationComponent,
    VendorDetailComponent,
    VendorUserListComponent,
    CategoryListComponent,
    VendorMenuList,
    ScrollBottomToTopComponent,
    VendorMapComponent,
    NotificationProfileComponent,
    UserProfileComponent
  ]
})
export class SharedModule { }
