import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';

@Component({
    selector: 'scroll-to-top',
    templateUrl: './scroll-buttom-top.component.html',
    styleUrls: [ './scroll-buttom-top.component.scss' ]
})

export class ScrollBottomToTopComponent {
    windowScrolled: boolean;

    constructor(@Inject(DOCUMENT) private document: Document) {}

    @HostListener("window:scroll", [])
    onWindowScroll() {
        if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
            this.windowScrolled = true;
        } 
       else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
            this.windowScrolled = false;
        }
    }

    scrollToTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}