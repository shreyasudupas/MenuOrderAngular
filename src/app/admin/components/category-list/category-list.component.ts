import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../categories/category';

@Component({
    selector:'category-list',
    templateUrl:'./category-list.component.html'
})

export class CategoryListComponent implements OnInit{
@Input() categories: Category[]=[];
@Input() vendorId:string='';

    constructor(private router:Router){
    }

    ngOnInit(): void {
        
    }

    goToCategory = (id:string) => {
        this.router.navigateByUrl('/admin/category/' + id,
        {
            state: { vendorId: this.vendorId }
        });
    }
    
}