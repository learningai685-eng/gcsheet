import { Injectable, signal } from '@angular/core';
import { ToastComponent } from './toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastComponent: ToastComponent | null = null;

  registerToast(toast: ToastComponent) {
    this.toastComponent = toast;
  }

  success(message: string) {
    this.toastComponent?.show(message, 'success');
  }

  error(message: string) {
    this.toastComponent?.show(message, 'danger');
  }

  warning(message: string) {
    this.toastComponent?.show(message, 'warning');
  }
}
