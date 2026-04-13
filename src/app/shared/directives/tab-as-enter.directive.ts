import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appTabAsEnter]',
  standalone: true
})
export class TabAsEnterDirective {
  @Output() appTabAsEnter = new EventEmitter<void>();

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: Event) {
    event.preventDefault();
    
    const target = event.target as HTMLElement;
    const form = target.closest('form');
    
    if (form) {
      const inputs = Array.from(form.querySelectorAll<HTMLElement>(
        'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      const currentIndex = inputs.indexOf(target);
      
      if (currentIndex === -1 || currentIndex === inputs.length - 1) {
        this.appTabAsEnter.emit();
      } else {
        const nextInput = inputs[currentIndex + 1];
        if (nextInput) {
          nextInput.focus();
          if (nextInput.tagName === 'INPUT' || nextInput.tagName === 'TEXTAREA') {
            const inputEl = nextInput as HTMLInputElement;
            inputEl.select();
          }
        }
      }
    }
  }

  @HostListener('keydown.tab', ['$event'])
  onTab(event: Event) {
    const target = event.target as HTMLElement;
    const form = target.closest('form');
    
    if (form) {
      const inputs = Array.from(form.querySelectorAll<HTMLElement>(
        'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      const currentIndex = inputs.indexOf(target);
      
      if (currentIndex === -1 || currentIndex === inputs.length - 1) {
        event.preventDefault();
        this.appTabAsEnter.emit();
      }
    }
  }
}
