import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { prettyPrintJson, FormatOptions } from 'pretty-print-json';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'vendor-menu-schema-display',
    templateUrl: './vendor-menu-schema-display.component.html'
})

export class VendroMenuSchemaDisplayComponent implements OnInit {
    constructor(private http:HttpClient) {
    }
 
      ngOnInit(): void {
          this.getSchemaFromAPI();        
      }

      getSchemaFromAPI() {
        let url = environment.inventory.vendorMenu.concat('/schema');
        this.http.get(url).subscribe({
          next: (result:any) => {
            const elem = document.getElementById('account');
            const options: FormatOptions = { linkUrls: true,trailingCommas:true };
            elem.innerHTML = prettyPrintJson.toHtml(result);
          },
          error: (err:any) => console.log(err)
        });
      }
}