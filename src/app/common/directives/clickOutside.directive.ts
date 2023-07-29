import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector:'[appclickOutside]'
})

export class ClickOutsideDirective {
    @Output() clickedOutside = new EventEmitter();

    constructor(private element: ElementRef) {}

    @HostListener('document:click',['$event.target'])
    public onClick(target:any) {
        const clickedInside = this.element.nativeElement.contains(target);

        if(!clickedInside){
            this.clickedOutside.emit(target);
        }
    }
}