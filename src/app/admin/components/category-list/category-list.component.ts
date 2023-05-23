import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../categories/category';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
    selector:'category-list',
    templateUrl:'./category-list.component.html'
})

export class CategoryListComponent implements OnInit{
@Input() categories: Category[]=[];
@Input() vendorId:string='';

    constructor(private router:Router,
        public authService:AuthService) {}

    ngOnInit(): void {
        
    }

    goToCategory = (id:string) => {
        let role = this.authService.GetUserRole();
        let url =  '/' + role + '/category/';
        this.router.navigateByUrl( url + id,
        {
            state: { vendorId: this.vendorId }
        });
    }
    
}