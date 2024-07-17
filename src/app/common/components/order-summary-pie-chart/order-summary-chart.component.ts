import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { CommonDataSharingService } from '../../services/common-datasharing.service';
import { MenuService } from '../../services/menu.service';
import { NavigationService } from '../../services/navigation.service';
import { BaseComponent } from '../base/base.component';
import { OrderSummary } from './order-summary';

@Component({
    selector: 'order-summary-chart-pie',
    templateUrl: './order-summary-chart.component.html',
})

export class OrderSummaryPieChartComponent extends BaseComponent<OrderSummary> implements OnInit {
orderSummaryData:OrderSummary[];
data: any;
options: any;

constructor(
    private menuService:MenuService,
    public override httpclient:HttpClient,
    public broadcastService:CommonDataSharingService,
    private activatedRoute:ActivatedRoute,
    private router: Router,
    messageService:MessageService,
    public navigation:NavigationService
){
    super(menuService,httpclient,broadcastService,messageService)
}

    ngOnInit(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.getVendorOrderSummary(textColor);
    }

    getVendorOrderSummary(textColor) {
        this.baseUrl = environment.orderService.vendorOrder.concat('/summary');
        this.action = null;

        this.ListItems(null).subscribe({
            next: (result:OrderSummary[]) => {
                this.orderSummaryData = result;

                let vendorNames = this.orderSummaryData.map((order)=>{
                    return order.vendorName;
                });
                
                let orderCounts = this.orderSummaryData.map((order)=>{
                    return order.orderCount;
                });
                
                this.data = {
                    labels: vendorNames,
                    datasets: [
                        { 
                            data: orderCounts
                        }
                    ]
                };

                this.options = {
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true,
                                color: textColor
                            }
                        }
                    }
                };
            },
            error: (error) => {
                console.log('Error occured during order summary');
            }
        });
    }
    
}