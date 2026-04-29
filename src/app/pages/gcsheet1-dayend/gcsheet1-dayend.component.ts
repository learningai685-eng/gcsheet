import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { GcsheetSaleinvService } from '../../services/gcsheet-saleinv.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { AppGlobalsService } from '../../services/app-globals.service';
import { PocketbaseService } from '../../services/pocketbase.service';

type GstReportType = 'invoice';

@Component({
  selector: 'app-gcsheet1-dayend',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" (click)="goToDashboard()" style="cursor: pointer;">
          <i class="bi bi-shield-check me-2"></i>GCSheet
        </a>
        <button class="navbar-toggler" type="button" (click)="isCollapsed = !isCollapsed">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" [class.show]="!isCollapsed">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" (click)="goToDashboard()">
                <i class="bi bi-speedometer2 me-1"></i> Dashboard
              </a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" style="cursor: pointer;" (click)="toggleGcsheetMenu()">
                <i class="bi bi-grid-3x3-gap me-1"></i> Gcsheet
              </a>
              <ul class="dropdown-menu" [class.show]="showGcsheetMenu">
                <li><a class="dropdown-item" (click)="navigateToGcsheetCompany()"><i class="bi bi-building me-2"></i>Company</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetFit()"><i class="bi bi-rulers me-2"></i>Fit</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetMm()"><i class="bi bi-box me-2"></i>MM</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetGrade()"><i class="bi bi-bar-chart me-2"></i>Grade</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetItem()"><i class="bi bi-box-seam me-2"></i>Item</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetNali()"><i class="bi bi-geo-alt me-2"></i>Nali</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetPktmaster()"><i class="bi bi-collection me-2"></i>Packet Master</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetSaleinv()"><i class="bi bi-receipt me-2"></i>Sale Invoice</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetSalereport()"><i class="bi bi-file-earmark-bar-graph me-2"></i>Sale Report</a></li>
                <li><a class="dropdown-item active" style="color: #0d6efd; font-weight: 500;"><i class="bi bi-calendar-check me-2"></i>Day End</a></li>
              </ul>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm" (click)="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid mt-3">
      <div class="card">
        <div class="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 class="mb-0"><i class="bi bi-calendar-check me-2"></i>Day End</h5>
          <div class="d-flex gap-2 align-items-center flex-wrap">
            <div class="d-flex align-items-center gap-1">
              <label class="form-label mb-0 small text-muted">Date:</label>
              <input type="date" class="form-control form-control-sm" style="width: 130px;" readonly
                     [ngModel]="gstStartDate()">
            </div>
            <button class="btn btn-danger btn-sm" (click)="confirmDayEnd()" [disabled]="gstLoading() || gstInvoices().length === 0">
              <i class="bi bi-calendar-check me-1"></i>Day End
            </button>
          </div>
        </div>

        <div class="card-body p-0">
          @if (gstLoading()) {
            <div class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2">Loading...</p>
            </div>
          } @else {
            <ag-grid-angular
              class="ag-theme-quartz"
              style="height: 450px; width: 100%;"
              [rowData]="gstInvoices()"
              [columnDefs]="columnDefs"
              [defaultColDef]="defaultColDef"
              [pagination]="true"
              [paginationPageSize]="20"
              [alwaysShowVerticalScroll]="true">
            </ag-grid-angular>
            @if (gstInvoices().length > 0) {
              <div class="alert alert-info mb-0 mt-2">
                <i class="bi bi-info-circle me-1"></i> {{ gstInvoices().length }} invoice(s) found for the selected date range
              </div>
            }
          }
        </div>
      </div>
    </div>

    @if (showDayEndModal()) {
      <div class="modal show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title"><i class="bi bi-exclamation-triangle me-2"></i>Day End Confirmation</h5>
              <button type="button" class="btn-close btn-close-white" (click)="closeDayEndModal()"></button>
            </div>
            <div class="modal-body text-center">
              <p class="fs-5">Are you sure you want to perform Day End?</p>
              <p class="text-muted">This will permanently delete all GCSheet sales records for</p>
              <p class="fw-bold">{{ gstStartDate() }}</p>
              <p class="text-danger"><i class="bi bi-exclamation-octagon me-1"></i>This action cannot be undone!</p>
            </div>
            <div class="modal-footer justify-content-center">
              <button type="button" class="btn btn-secondary" (click)="closeDayEndModal()">Cancel</button>
              <button type="button" class="btn btn-danger" (click)="executeDayEnd()" [disabled]="gstLoading()">
                @if (gstLoading()) {
                  <span class="spinner-border spinner-border-sm me-1"></span>
                } @else {
                  <i class="bi bi-calendar-check me-1"></i>
                }
                Confirm Day End
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .navbar .dropdown-menu { position: absolute; }
    .dropdown-item.active { background-color: #f8f9fa; font-weight: 500; }
  `]
})
export class Gcsheet1DayendComponent implements OnInit {
  private service = inject(GcsheetSaleinvService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private globals = inject(AppGlobalsService);
  private pbService = inject(PocketbaseService);
  protected toastService = inject(ToastService);

  isCollapsed = true;
  showMasterMenu = false;
  showGcsheetMenu = false;

  gstLoading = signal(false);
  gstStartDate = signal('');
  gstInvoices = signal<any[]>([]);
  gstHeadersAll = signal<any[]>([]);
  gstDetailsAll = signal<any[]>([]);
  pktmasterList = signal<any[]>([]);
  showDayEndModal = signal(false);

  readonly defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };

  readonly columnDefs: ColDef[] = [
    { field: 'billno', headerName: 'Bill No', width: 100 },
    { field: 'billdate', headerName: 'Date', width: 120 },
    { field: 'customername', headerName: 'Customer', width: 220, valueFormatter: (params: any) => params.value || '-' },
    { field: 'billamt', headerName: 'Bill Amt', width: 120, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) },
    { field: 'gstamt', headerName: 'GST Amt', width: 110, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) },
    { field: 'nettamount', headerName: 'Net Amt', width: 120, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) }
  ];

  pktmasterMap = computed(() => {
    const map = new Map<string, any>();
    this.pktmasterList().forEach(pkt => {
      if (pkt?.id) map.set(pkt.id, pkt);
    });
    return map;
  });

  ngOnInit() {
    this.initDates();
  }

  async initDates() {
    this.gstLoading.set(true);
    try {
      const todayDate = await this.service.getLogfileTodayDate();
      console.log('Logfile todaydate:', todayDate);
      if (todayDate) {
        const normalized = this.normalizeDate(todayDate);
        this.gstStartDate.set(normalized);
      } else {
        const today = new Date().toISOString().split('T')[0];
        this.gstStartDate.set(today);
      }
    } catch (e) {
      console.error('Error getting logfile date:', e);
      const today = new Date().toISOString().split('T')[0];
      this.gstStartDate.set(today);
    }
    await this.loadGstData();
    this.gstLoading.set(false);
  }

  private invoiceDetailsCache = new Map<string, any[]>();

  async loadGstData() {
    this.gstLoading.set(true);
    try {
      const [headers, details, pktmaster] = await Promise.all([
        this.service.getSalesHeaderAll(),
        this.service.getSalesDetailAll(),
        this.service.getPktmasterAll()
      ]);

      const startDate = this.gstStartDate();
      const startTs = startDate ? new Date(startDate).getTime() : 0;
      
      const filteredHeaders: any[] = [];
      const invoiceIds = new Set<string>();
      
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (!header?.id) continue;
        const billDate = this.normalizeDate(header['billdate']);
        const billTs = billDate ? new Date(billDate).getTime() : 0;
        if (billTs === startTs) {
          filteredHeaders.push(header);
          invoiceIds.add(header.id);
        }
      }

      const filteredDetails = details.filter(detail => invoiceIds.has(String(detail['billno'])));

      this.gstHeadersAll.set(filteredHeaders);
      this.gstDetailsAll.set(filteredDetails);
      this.pktmasterList.set(pktmaster);
      this.invoiceDetailsCache.clear();
      this.processGstData();
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to load GST data');
    } finally {
      this.gstLoading.set(false);
    }
  }

  processGstData() {
    const headers = this.gstHeadersAll();
    const sortedHeaders = [...headers].sort((a, b) => (Number(a['billno']) || 0) - (Number(b['billno']) || 0));
    this.gstInvoices.set(sortedHeaders);
  }

  confirmDayEnd() {
    this.showDayEndModal.set(true);
  }

  closeDayEndModal() {
    this.showDayEndModal.set(false);
  }

  async executeDayEnd() {
    const startDate = this.gstStartDate();
    if (!startDate) {
      this.toastService.error('Date not selected');
      return;
    }

    this.gstLoading.set(true);
    try {
      const headersToDelete = this.gstHeadersAll();
      for (const header of headersToDelete) {
        await this.service.deleteSalesDetailsByBillno(header.id);
        await this.service.deleteSalesHeader(header.id);
      }

      await this.service.updateLogfileStatus(startDate);
      await this.service.createLogfileNextDay(startDate);

      const newLogfile = await this.service.getActiveLogfile();
      if (newLogfile) {
        const nextDate = this.normalizeDate(newLogfile['todaydate']);
        this.globals.setMtodaydate(nextDate);
      }

      this.pbService.clearAuth();
      this.service.clearCache();
      this.toastService.success(`Day End completed. ${headersToDelete.length} invoice(s) deleted.`);
      this.closeDayEndModal();
      
      // Wait a moment for toast to display, then logout and redirect to login
      setTimeout(() => {
        this.authService.logout();
      }, 1000);
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to complete Day End');
    } finally {
      this.gstLoading.set(false);
    }
  }

  private normalizeDate(value: any): string {
    if (!value) return '';
    const text = String(value);
    if (text.includes('T')) return text.split('T')[0];
    if (text.includes(' ')) return text.split(' ')[0];
    return text;
  }

  private formatGridNumber(value: any): string {
    return (Number(value) || 0).toFixed(2);
  }

  goToDashboard() { this.router.navigate(['/dashboard']); }
  logout() { this.router.navigate(['/login']); }
  navigateToUsers() { this.router.navigate(['/users']); }
  navigateToGroupmaster() { this.router.navigate(['/groupmaster']); }
  navigateToGcsheetCompany() { this.router.navigate(['/gcsheet-company']); }
  navigateToGcsheetFit() { this.router.navigate(['/gcsheet-fit']); }
  navigateToGcsheetMm() { this.router.navigate(['/gcsheet-mm']); }
  navigateToGcsheetGrade() { this.router.navigate(['/gcsheet-grade']); }
  navigateToGcsheetItem() { this.router.navigate(['/gcsheet-item']); }
  navigateToGcsheetNali() { this.router.navigate(['/gcsheet-nali']); }
  navigateToGcsheetPktmaster() { this.router.navigate(['/gcsheet-pktmaster']); }
  navigateToGcsheetSaleinv() { this.router.navigate(['/gcsheet-saleinv']); }
  navigateToGcsheetSalereport() { this.router.navigate(['/gcsheet1-salereport']); }
  toggleMasterMenu() { this.showMasterMenu = !this.showMasterMenu; }
  toggleGcsheetMenu() { this.showGcsheetMenu = !this.showGcsheetMenu; }
}