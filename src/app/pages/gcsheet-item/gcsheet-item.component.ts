import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { GcsheetItemService } from '../../services/gcsheet-item.service';
import { ToastService } from '../../shared/toast/toast.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-gcsheet-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PaginationComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" (click)="goToDashboard()" style="cursor: pointer;"><i class="bi bi-shield-check me-2"></i>SuperAdmin</a>
        <button class="navbar-toggler" type="button" (click)="isCollapsed = !isCollapsed"><span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse" [class.show]="!isCollapsed">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><a class="nav-link" (click)="goToDashboard()"><i class="bi bi-speedometer2 me-1"></i> Dashboard</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" style="cursor: pointer;" (click)="toggleGcsheetMenu()"><i class="bi bi-grid-3x3-gap me-1"></i> Gcsheet</a>
              <ul class="dropdown-menu" [class.show]="showGcsheetMenu">
                <li><a class="dropdown-item" (click)="navigateToGcsheetCompany()"><i class="bi bi-building me-2"></i>Company</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetFit()"><i class="bi bi-rulers me-2"></i>Fit</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetMm()"><i class="bi bi-box me-2"></i>MM</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetGrade()"><i class="bi bi-bar-chart me-2"></i>Grade</a></li>
                <li><a class="dropdown-item active" style="color: #0d6efd; font-weight: 500;"><i class="bi bi-box-seam me-2"></i>Item</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetNali()"><i class="bi bi-geo-alt me-2"></i>Nali</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetPktmaster()"><i class="bi bi-collection me-2"></i>Packet Master</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetSaleinv()"><i class="bi bi-receipt me-2"></i>Sale Invoice</a></li>
              </ul>
            </li>
          </ul>
          <ul class="navbar-nav"><li class="nav-item"><button class="btn btn-outline-light btn-sm" (click)="logout()"><i class="bi bi-box-arrow-right me-1"></i>Logout</button></li></ul>
        </div>
      </div>
    </nav>

    <div class="container mt-5">
      <div class="card">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 class="mb-0"><i class="bi bi-box-seam me-2"></i>Gcsheet Item Master</h4>
          <div class="d-flex gap-2">
            <button class="btn btn-light btn-sm" (click)="exportToExcel()" [disabled]="isImporting()"><i class="bi bi-file-earmark-excel me-1"></i>Export</button>
            <label class="btn btn-light btn-sm mb-0" [class.disabled]="isImporting()">
              @if (isImporting()) { <span class="spinner-border spinner-border-sm me-1"></span>Importing... } @else { <i class="bi bi-file-earmark-arrow-up me-1"></i>Import }
              <input type="file" accept=".xlsx,.xls,.csv" (change)="importFromExcel($event)" [disabled]="isImporting()" hidden>
            </label>
            <button class="btn btn-light btn-sm" (click)="openAddModal()"><i class="bi bi-plus-circle me-1"></i>Add Item</button>
          </div>
        </div>
        @if (isImporting()) { <div class="card-body pb-0"><div class="progress mb-3" style="height: 20px;"><div class="progress-bar progress-bar-striped progress-bar-animated" [style.width.%]="importProgress()">{{ importProgress() }}%</div></div></div> }
        <div class="card-body">
          <div class="mb-3"><div class="input-group"><span class="input-group-text"><i class="bi bi-search"></i></span><input type="text" class="form-control" placeholder="Search..." [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)"></div></div>
          @if (loading()) { <div class="text-center py-4"><div class="spinner-border text-primary"></div></div> }
          @else {
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light"><tr><th class="sortable-header" (click)="toggleSort('name')">Name @if (sortField() === 'name') { <i class="bi" [class.bi-caret-up-fill]="sortDirection() === 'asc'" [class.bi-caret-down-fill]="sortDirection() === 'desc'"></i> }</th><th>Actions</th></tr></thead>
                <tbody>
                  @for (item of paginatedData(); track item.id) {
                    <tr><td>{{ item['name'] }}</td><td><button class="btn btn-sm btn-outline-primary me-1" (click)="openEditModal(item)"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-outline-danger" (click)="openDeleteModal(item)"><i class="bi bi-trash"></i></button></td></tr>
                  } @empty { <tr><td colspan="2" class="text-center text-muted">No records found</td></tr> }
                </tbody>
              </table>
              <app-pagination 
                [totalItems]="totalFilteredItems()"
                [pageSize]="pageSize()"
                (pageSizeChange)="onPageSizeChange($event)"
                (currentPageChange)="onPageChange($event)">
              </app-pagination>
            </div>
          }
        </div>
      </div>
    </div>

    @if (showModal()) {
      <div class="modal show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog"><div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">{{ isEditMode() ? 'Edit' : 'Add' }} Item</h5><button type="button" class="btn-close" (click)="closeModal()"></button></div>
          <div class="modal-body"><form [formGroup]="form"><div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" formControlName="name" (blur)="checkDuplicateName()">@if (duplicateError()) { <div class="text-danger small">Name already exists</div> }</div></form></div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button><button type="button" class="btn btn-primary" (click)="saveData()" [disabled]="saving() || duplicateError()">{{ saving() ? 'Saving...' : 'Save' }}</button></div>
        </div></div>
      </div>
    }
    @if (showDeleteModal()) {
      <div class="modal show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);"><div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Confirm Delete</h5><button type="button" class="btn-close" (click)="closeDeleteModal()"></button></div>
        <div class="modal-body"><p>Are you sure?</p></div>
        <div class="modal-footer"><button type="button" class="btn btn-secondary" (click)="closeDeleteModal()">Cancel</button><button type="button" class="btn btn-danger" (click)="confirmDelete()">Delete</button></div>
      </div></div></div>
    }
  `,
  styles: [`.navbar .dropdown-menu { position: absolute; } .dropdown-item.active { background-color: #f8f9fa; font-weight: 500; } .sortable-header { cursor: pointer; }`]
})
export class GcsheetItemComponent implements OnDestroy {
  private service = inject(GcsheetItemService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isCollapsed = true;
  showGcsheetMenu = false;
  showModal = signal(false);
  showDeleteModal = signal(false);
  isEditMode = signal(false);
  saving = signal(false);
  loading = signal(false);
  searchTerm = signal('');
  data = signal<any[]>([]);
  currentItem = signal<any>(null);
  itemToDelete = signal<any>(null);
  sortField = signal<string>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  importProgress = signal(0);
  isImporting = signal(false);
  duplicateError = signal(false);
  pageSize = signal(50);
  currentPage = signal(1);

  paginatedData = signal<any[]>([]);
  totalFilteredItems = signal(0);

  private searchDebounce: any;

  form = this.fb.group({ name: ['', [Validators.required]] });

  constructor() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.currentPage.set(1);
      this.loadData();
    }, 300);
  }

  async loadData() {
    this.loading.set(true);
    try {
      const result = await this.service.getPaginated(
        this.currentPage(),
        this.pageSize(),
        this.searchTerm(),
        this.sortField(),
        this.sortDirection()
      );
      this.paginatedData.set(result.items);
      this.totalFilteredItems.set(result.totalItems);
      this.data.set(result.items);
    } catch (err: any) { 
      this.toastService.error(err.message); 
    } finally { 
      this.loading.set(false); 
    }
  }

  async checkDuplicateName(): Promise<void> {
    const name = this.form.get('name')?.value?.trim().toLowerCase();
    if (!name) { this.duplicateError.set(false); return; }
    const isDuplicate = await this.service.checkDuplicateName(
      name,
      this.isEditMode() ? this.currentItem()?.id : undefined
    );
    this.duplicateError.set(isDuplicate);
  }

  toggleSort(field: string): void {
    if (this.sortField() === field) this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    else { this.sortField.set(field); this.sortDirection.set('asc'); }
    this.loadData();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadData();
  }

  openAddModal() { this.isEditMode.set(false); this.currentItem.set(null); this.duplicateError.set(false); this.form.reset(); this.showModal.set(true); }
  openEditModal(item: any) { this.isEditMode.set(true); this.currentItem.set(item); this.duplicateError.set(false); this.form.patchValue({ name: item['name'] }); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); this.form.reset(); this.duplicateError.set(false); }
  openDeleteModal(item: any) { this.itemToDelete.set(item); this.showDeleteModal.set(true); }
  closeDeleteModal() { this.showDeleteModal.set(false); this.itemToDelete.set(null); }

  async saveData() {
    if (this.form.invalid || this.duplicateError()) return;
    this.saving.set(true);
    try {
      const result = this.isEditMode() ? await this.service.update(this.currentItem().id, { name: this.form.value.name! }) : await this.service.create({ name: this.form.value.name! });
      if (result.success) { this.toastService.success(`Item ${this.isEditMode() ? 'updated' : 'created'} successfully`); this.closeModal(); await this.loadData(); } else { this.toastService.error(result.error); }
    } catch (err: any) { this.toastService.error(err.message); } finally { this.saving.set(false); }
  }

  async confirmDelete() {
    const item = this.itemToDelete();
    if (!item?.id) return;
    this.saving.set(true);
    try {
      if (await this.service.delete(item.id)) { this.toastService.success('Deleted'); this.closeDeleteModal(); await this.loadData(); } else { this.toastService.error('Failed'); }
    } catch (err: any) { this.toastService.error(err.message); } finally { this.saving.set(false); }
  }

  exportToExcel(): void {
    this.isImporting.set(true);
    setTimeout(() => { 
      const ws = XLSX.utils.json_to_sheet(this.data().map(item => ({ 'Name': item['name'] }))); 
      const wb = XLSX.utils.book_new(); 
      XLSX.utils.book_append_sheet(wb, ws, 'Item Master'); 
      XLSX.writeFile(wb, `gcsheet_item_export_${new Date().toISOString().split('T')[0]}.xlsx`); 
      this.isImporting.set(false); 
    }, 100);
  }

  async importFromExcel(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(new Uint8Array(e.target?.result as ArrayBuffer), { type: 'array' });
        const jsonData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        if (!jsonData.length) { this.toastService.error('No data'); return; }
        
        const newRecords: { name: string }[] = [];
        for (const row of jsonData) {
          const name = row['Name'] || row['name'];
          if (name) {
            newRecords.push({ name: String(name).trim() });
          }
        }

        if (newRecords.length === 0) {
          this.toastService.error('No valid data found');
          this.isImporting.set(false);
          input.value = '';
          return;
        }

        this.isImporting.set(true); 
        this.importProgress.set(0);
        const result = await this.service.batchCreate(newRecords, (done, total) => {
          this.importProgress.set(Math.round((done / total) * 100));
        });
        await this.loadData();
        this.toastService.success(result.imported > 0 ? `Imported ${result.imported}, Failed ${result.failed}` : `Import completed. ${result.failed} failed.`);
      } catch (err: any) { this.toastService.error(err.message); } 
      finally { this.isImporting.set(false); this.importProgress.set(0); input.value = ''; }
    };
    reader.readAsArrayBuffer(input.files[0]);
  }

  goToDashboard() { this.router.navigate(['/dashboard']); }
  logout() { this.router.navigate(['/login']); }
  navigateToGcsheetCompany() { this.router.navigate(['/gcsheet-company']); }
  navigateToGcsheetFit() { this.router.navigate(['/gcsheet-fit']); }
  navigateToGcsheetMm() { this.router.navigate(['/gcsheet-mm']); }
  navigateToGcsheetGrade() { this.router.navigate(['/gcsheet-grade']); }
  navigateToGcsheetNali() { this.router.navigate(['/gcsheet-nali']); }
  navigateToGcsheetPktmaster() { this.router.navigate(['/gcsheet-pktmaster']); }
  navigateToGcsheetSaleinv() { this.router.navigate(['/gcsheet-saleinv']); }
  toggleGcsheetMenu() { this.showGcsheetMenu = !this.showGcsheetMenu; }
}