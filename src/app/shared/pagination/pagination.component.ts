import { Component, Input, Output, EventEmitter, signal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div class="text-muted small">
        Showing {{ startItem }} to {{ endItem }} of {{ totalItemsValue }} records
      </div>
      <div class="d-flex gap-2 align-items-center">
        <select class="form-select form-select-sm" style="width: auto;" 
                [ngModel]="pageSizeValue" (ngModelChange)="onPageSizeChange($event)">
          <option [value]="10">10 / page</option>
          <option [value]="25">25 / page</option>
          <option [value]="50">50 / page</option>
          <option [value]="100">100 / page</option>
        </select>
        <button class="btn btn-sm btn-outline-secondary" (click)="goToPage(1)" [disabled]="currentPageValue === 1 || totalPages === 0">
          <i class="bi bi-chevron-double-left"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary" (click)="goToPage(currentPageValue - 1)" [disabled]="currentPageValue === 1 || totalPages === 0">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="px-2">Page {{ totalPages === 0 ? 0 : currentPageValue }} of {{ totalPages }}</span>
        <button class="btn btn-sm btn-outline-secondary" (click)="goToPage(currentPageValue + 1)" [disabled]="currentPageValue >= totalPages || totalPages === 0">
          <i class="bi bi-chevron-right"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary" (click)="goToPage(totalPages)" [disabled]="currentPageValue >= totalPages || totalPages === 0">
          <i class="bi bi-chevron-double-right"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .form-select-sm { padding: 0.25rem 2rem 0.25rem 0.5rem; }
  `]
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems = 0;
  @Input() pageSize = 50;
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() currentPageChange = new EventEmitter<number>();

  currentPageValue = 1;
  pageSizeValue = 50;
  totalItemsValue = 0;

  totalPages = 1;
  startItem = 1;
  endItem = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems']) {
      this.totalItemsValue = this.totalItems;
    }
    if (changes['pageSize']) {
      this.pageSizeValue = this.pageSize;
    }
    this.updateComputed();
  }

  private updateComputed(): void {
    this.totalPages = Math.ceil(this.totalItemsValue / this.pageSizeValue) || 1;
    this.startItem = Math.min((this.currentPageValue - 1) * this.pageSizeValue + 1, this.totalItemsValue);
    this.endItem = Math.min(this.currentPageValue * this.pageSizeValue, this.totalItemsValue);

    if (this.currentPageValue > this.totalPages) {
      this.currentPageValue = 1;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPageValue = page;
      this.currentPageChange.emit(page);
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSizeValue = size;
    this.currentPageValue = 1;
    this.updateComputed();
    this.pageSizeChange.emit(size);
    this.currentPageChange.emit(1);
  }
}
