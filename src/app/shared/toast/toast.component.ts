import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible()) {
      <div [class]="'toast show align-items-center border-0 text-bg-' + type()" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            {{ message() }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="close()"></button>
        </div>
      </div>
    }
  `,
  styles: [`
    .toast { position: fixed; top: 20px; right: 20px; z-index: 9999; }
  `]
})
export class ToastComponent {
  message = signal('');
  type = signal<'success' | 'danger' | 'warning'>('success');
  visible = signal(false);
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  show(msg: string, toastType: 'success' | 'danger' | 'warning' = 'success') {
    this.message.set(msg);
    this.type.set(toastType);
    this.visible.set(true);
    
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    this.hideTimer = setTimeout(() => this.visible.set(false), 3000);
  }

  close() {
    this.visible.set(false);
  }
}
