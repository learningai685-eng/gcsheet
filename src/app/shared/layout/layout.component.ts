import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <app-header>
      <div class="container mt-4">
        <ng-content></ng-content>
      </div>
    </app-header>
  `
})
export class LayoutComponent {}
