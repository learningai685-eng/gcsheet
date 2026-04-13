import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';
import { ToastService } from './shared/toast/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast #toast></app-toast>
  `,
  styles: [':host { display: block; }']
})
export class App implements AfterViewInit {
  @ViewChild('toast') toastComponent!: ToastComponent;
  private toastService = inject(ToastService);

  ngAfterViewInit() {
    this.toastService.registerToast(this.toastComponent);
  }
}
