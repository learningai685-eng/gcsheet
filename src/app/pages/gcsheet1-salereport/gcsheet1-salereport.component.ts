import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { GcsheetSaleinvService } from '../../services/gcsheet-saleinv.service';
import { DmsLogfileService } from '../../services/dms-logfile.service';
import { ToastService } from '../../shared/toast/toast.service';

type GstReportType = 'invoice' | 'saleregister' | 'productsales';

@Component({
  selector: 'app-gcsheet1-salereport',
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
                <li><a class="dropdown-item active" style="color: #0d6efd; font-weight: 500;"><i class="bi bi-file-earmark-bar-graph me-2"></i>Sale Report</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetDayend()"><i class="bi bi-calendar-check me-2"></i>Day End</a></li>
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
          <h5 class="mb-0"><i class="bi bi-percent me-2"></i>{{ currentGstConfig().title }}</h5>
          <div class="d-flex gap-2 align-items-center flex-wrap">
            <div class="d-flex align-items-center gap-1">
              <label class="form-label mb-0 small text-muted">Start:</label>
              <input type="date" class="form-control form-control-sm" style="width: 130px;"
                     [ngModel]="gstStartDate()" (ngModelChange)="gstStartDate.set($event)">
            </div>
            <div class="d-flex align-items-center gap-1">
              <label class="form-label mb-0 small text-muted">End:</label>
              <input type="date" class="form-control form-control-sm" style="width: 130px;"
                     [ngModel]="gstEndDate()" (ngModelChange)="gstEndDate.set($event)">
            </div>
            <label class="form-label mb-0 small text-muted">Report Type:</label>
            <select class="form-select form-select-sm" style="width: 160px;"
                    [ngModel]="gstReportType()" (ngModelChange)="onGstReportTypeChange($event)">
              <option value="invoice">Print Invoice</option>
              <option value="saleregister">Sale Register</option>
              <option value="productsales">Product Summary</option>
            </select>
            <button class="btn btn-primary btn-sm" (click)="loadGstData()">
              <i class="bi bi-check-circle me-1"></i>Load
            </button>
            <button class="btn btn-outline-success btn-sm" (click)="exportGstReport()" [disabled]="gstInvoices().length === 0">
              <i class="bi bi-file-earmark-excel me-1"></i>Export
            </button>
            @if (gstReportType() === 'invoice') {
              <button class="btn btn-warning btn-sm" (click)="printAllInvoices()" [disabled]="gstInvoices().length === 0 || gstLoading()">
                <i class="bi bi-printer me-1"></i>Print All
              </button>
            } @else {
              <button class="btn btn-outline-primary btn-sm" (click)="printGstReport()" [disabled]="gstInvoices().length === 0">
                <i class="bi bi-printer me-1"></i>Print
              </button>
            }
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
              [columnDefs]="currentGstConfig().columns"
              [defaultColDef]="defaultColDef"
              [pagination]="true"
              [paginationPageSize]="20"
              [pinnedBottomRowData]="gstReportType() !== 'invoice' ? gstPinnedBottomRow() : []"
              [alwaysShowVerticalScroll]="true"
              (rowClicked)="onGstRowClicked($event)"
              [rowSelection]="gstReportType() === 'invoice' ? 'single' : undefined">
            </ag-grid-angular>
            @if (gstReportType() === 'invoice' && gstInvoices().length > 0) {
              <div class="alert alert-warning mb-0 mt-2">
                <i class="bi bi-info-circle me-1"></i> Click on a row to print that invoice | Or use "Print All" to print all invoices
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
              <p class="text-muted">This will permanently delete all GCSheet sales records from</p>
              <p class="fw-bold">{{ gstStartDate() }} to {{ gstEndDate() }}</p>
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
export class Gcsheet1SalereportComponent implements OnInit {
  private service = inject(GcsheetSaleinvService);
  private router = inject(Router);
  private pbService = inject(DmsLogfileService);
  protected toastService = inject(ToastService);

  isCollapsed = true;
  showMasterMenu = false;
  showGcsheetMenu = false;

  gstLoading = signal(false);
  gstStartDate = signal('');
  gstEndDate = signal('');
  gstReportType = signal<GstReportType>('invoice');
  gstInvoices = signal<any[]>([]);
  gstHeadersAll = signal<any[]>([]);
  gstDetailsAll = signal<any[]>([]);
  pktmasterList = signal<any[]>([]);
  showDayEndModal = signal(false);

  readonly defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };

  readonly invoiceReportConfig = {
    title: 'Invoice List',
    columns: [
      { field: 'billno', headerName: 'Bill No', width: 100 },
      { field: 'billdate', headerName: 'Date', width: 120 },
      { field: 'customername', headerName: 'Customer', width: 220, valueFormatter: (params: any) => params.value || '-' },
      { field: 'billamt', headerName: 'Bill Amt', width: 120, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) },
      { field: 'gstamt', headerName: 'GST Amt', width: 110, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) },
      { field: 'nettamount', headerName: 'Net Amt', width: 120, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) }
    ] as ColDef[]
  };

  readonly saleRegisterConfig = {
    title: 'Sale Register',
    columns: [
      { field: 'billno', headerName: 'Bill No', width: 90 },
      { field: 'billdate', headerName: 'Date', width: 110 },
      { field: 'customername', headerName: 'Customer', width: 200 },
      { field: 'totalpcs', headerName: 'Pcs', width: 80, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) },
      { field: 'totalwgt', headerName: 'Weight', width: 100, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) },
      { field: 'nettamount', headerName: 'Net Amount', width: 120, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) }
    ] as ColDef[]
  };

  readonly productSummaryConfig = {
    title: 'Product Summary',
    columns: [
      { field: 'productname', headerName: 'Product', width: 300 },
      { field: 'totalpcs', headerName: 'Total Pcs', width: 100, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) },
      { field: 'totalwgt', headerName: 'Total Weight', width: 120, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) },
      { field: 'totalamt', headerName: 'Total Amount', width: 130, type: 'numericColumn', valueFormatter: (params: any) => this.formatGridNumber(params.value) }
    ] as ColDef[]
  };

  

  currentGstConfig = computed(() => {
    switch (this.gstReportType()) {
      case 'invoice': return this.invoiceReportConfig;
      case 'saleregister': return this.saleRegisterConfig;
      case 'productsales': return this.productSummaryConfig;
      default: return this.invoiceReportConfig;
    }
  });

  pktmasterMap = computed(() => {
    const map = new Map<string, any>();
    this.pktmasterList().forEach(pkt => {
      if (pkt?.id) map.set(pkt.id, pkt);
    });
    return map;
  });

  headerMap = computed(() => {
    const map = new Map<string, any>();
    this.gstHeadersAll().forEach(header => {
      if (header?.id) map.set(header.id, header);
    });
    return map;
  });

  gstPinnedBottomRow = computed(() => {
    const type = this.gstReportType();
    const data = this.gstInvoices();
    if (data.length === 0) return [];
    
    if (type === 'productsales') {
      let totalpcs = 0, totalwgt = 0, totalamt = 0;
      for (const row of data) {
        totalpcs += Number(row.totalpcs) || 0;
        totalwgt += Number(row.totalwgt) || 0;
        totalamt += Number(row.totalamt) || 0;
      }
      return [{ productname: 'Total', totalpcs, totalwgt, totalamt }];
    }

    // if (type === 'salesregister') {
    //   let totalpcs = 0, totalwgt = 0, totalamt = 0;
    //   for (const row of data) {
    //     totalpcs += Number(row.qty) || 0;
    //     totalwgt += Number(row.weight) || 0;
    //     totalamt += Number(row.amount) || 0;
    //   }
    //   return [{ billno: 'Total', productname: '', qty: totalpcs, weight: totalwgt, amount: totalamt }];
    // }
    
    let totalpcs = 0, totalwgt = 0, totalnet = 0;
    for (const row of data) {
      totalpcs += Number(row.totalpcs) || 0;
      totalwgt += Number(row.totalwgt) || 0;
      totalnet += Number(row.nettamount) || 0;
    }
    const totals: any = { billno: 'Total', billdate: '', customername: '' };
    totals.totalpcs = totalpcs;
    totals.totalwgt = totalwgt;
    totals.nettamount = totalnet;
    return [totals];
  });

  ngOnInit() {
    this.initDates().then(() => this.loadGstData());
  }

  async initDates() {
    const todaydate = await this.pbService.getLogfileTodayDate();
    if (todaydate) {
      this.gstStartDate.set(todaydate);
      this.gstEndDate.set(todaydate);
    } else {
      const today = new Date().toISOString().split('T')[0];
      this.gstStartDate.set(today);
      this.gstEndDate.set(today);
    }
  }

  onGstReportTypeChange(type: GstReportType) {
    this.gstReportType.set(type);
    this.processGstData();
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
      const endDate = this.gstEndDate();
      const startTs = startDate ? new Date(startDate).getTime() : 0;
      const endTs = endDate ? new Date(endDate).getTime() : Number.MAX_SAFE_INTEGER;
      
      const filteredHeaders: any[] = [];
      const invoiceIds = new Set<string>();
      
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (!header?.id) continue;
        const billDate = this.normalizeDate(header['billdate']);
        const billTs = billDate ? new Date(billDate).getTime() : 0;
        if (billTs >= startTs && billTs <= endTs) {
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
    const type = this.gstReportType();
    const headers = this.gstHeadersAll();
    const details = this.gstDetailsAll();
    
    if (type === 'productsales') {
      const productMap = new Map<string, any>();
      for (const det of details) {
        const productName = det['particulars'] || det['pktname'] || 'Unknown';
        const existing = productMap.get(productName);
        if (existing) {
          existing.totalpcs += Number(det.qty) || 0;
          existing.totalwgt += Number(det.weight) || 0;
          existing.totalamt += Number(det.amount) || 0;
        } else {
          productMap.set(productName, {
            productname: productName,
            totalpcs: Number(det.qty) || 0,
            totalwgt: Number(det.weight) || 0,
            totalamt: Number(det.amount) || 0
          });
        }
      }
      const sortedProducts = Array.from(productMap.values()).sort((a, b) => 
        (a.productname || '').localeCompare(b.productname || '')
      );
      this.gstInvoices.set(sortedProducts);
      return;
    }
    
    const sortedHeaders = [...headers].sort((a, b) => (Number(a['billno']) || 0) - (Number(b['billno']) || 0));
    this.gstInvoices.set(sortedHeaders);
  }

  async onGstRowClicked(event: any) {
    if (this.gstReportType() === 'invoice' && event.data) {
      await this.printInvoiceFromList(event.data);
    }
  }

  exportGstReport() {
    const data = this.gstInvoices();
    const type = this.gstReportType();
    if (data.length === 0) return;

    let headers: string[], rows: string[];

    if (type === 'productsales') {
      headers = ['Product', 'Total Pcs', 'Total Weight', 'Total Amount'];
      rows = data.map((row: any) => 
        `"${row.productname || ''}","${row.totalpcs || 0}","${row.totalwgt || 0}","${row.totalamt || 0}"`
      );
      const totals = this.gstPinnedBottomRow()[0] || {};
      rows.push(`"Total","${totals.totalpcs || 0}","${totals.totalwgt || 0}","${totals.totalamt || 0}"`);
    } else {
      const config = this.currentGstConfig();
      headers = config.columns.map(col => col.headerName || col.field || '');
      rows = data.map((row: any) => {
        if (type === 'invoice') {
          return `"${row.billno || ''}","${this.formatPrintDate(row.billdate)}","${row.customername || ''}","${row.billamt || 0}","${row.gstamt || 0}","${row.nettamount || 0}"`;
        } else {
          return `"${row.billno || ''}","${this.formatPrintDate(row.billdate)}","${row.customername || ''}","${row.totalpcs || 0}","${row.totalwgt || 0}","${row.nettamount || 0}"`;
        }
      });
      const totals = this.gstPinnedBottomRow()[0] || {};
      rows.push(`"Total","","","${type === 'invoice' ? (totals.billamt || 0) : (totals.totalpcs || 0)}","${type === 'invoice' ? (totals.gstamt || 0) : (totals.totalwgt || 0)}","${totals.nettamount || 0}"`);
    }

    const csv = `\uFEFF${headers.join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${this.currentGstConfig().title}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  printGstReport() {
    const data = this.gstInvoices();
    const type = this.gstReportType();
    if (data.length === 0) return;

    const config = this.currentGstConfig();
    const rowsHtml: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (type === 'productsales') {
        rowsHtml.push(`<tr>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(row.productname || '')}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(row.totalpcs)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(row.totalwgt)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(row.totalamt)}</td>
        </tr>`);
      } else {
        rowsHtml.push(`<tr>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(String(row.billno || ''))}</td>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(this.formatPrintDate(row.billdate))}</td>
          <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(row.customername || '')}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${type === 'invoice' ? this.formatGridNumber(row.billamt) : this.formatGridNumber(row.totalpcs)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${type === 'invoice' ? this.formatGridNumber(row.gstamt) : this.formatGridNumber(row.totalwgt)}</td>
          <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(row.nettamount)}</td>
        </tr>`);
      }
    }

    const totals = this.gstPinnedBottomRow()[0] || {};
    let totalRow = '';

    if (type === 'productsales') {
      totalRow = `<tr style="background:#e7f1ff;font-weight:bold;">
        <td style="border:1px solid #000;padding:4px;">Total</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(totals.totalpcs)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(totals.totalwgt)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(totals.totalamt)}</td>
      </tr>`;
    } else {
      totalRow = `<tr style="background:#e7f1ff;font-weight:bold;">
        <td style="border:1px solid #000;padding:4px;">Total</td>
        <td style="border:1px solid #000;padding:4px;"></td>
        <td style="border:1px solid #000;padding:4px;"></td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${type === 'invoice' ? this.formatGridNumber(totals.billamt || 0) : this.formatGridNumber(totals.totalpcs)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${type === 'invoice' ? this.formatGridNumber(totals.gstamt || 0) : this.formatGridNumber(totals.totalwgt)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatGridNumber(totals.nettamount)}</td>
      </tr>`;
    }

    let theadHtml = '';
    if (type === 'productsales') {
      theadHtml = `<th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Product</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Total Pcs</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Total Wgt</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Total Amt</th>`;
    } else {
      theadHtml = `<th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Bill No</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Date</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Customer</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">${type === 'invoice' ? 'Bill Amt' : 'Pcs'}</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">${type === 'invoice' ? 'GST Amt' : 'Weight'}</th><th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Net Amt</th>`;
    }

    const html = `
      <html>
        <head>
          <title>${this.escapeHtml(config.title)}</title>
          <style>
            @page { size: A4 portrait; margin: 8mm; }
            body { margin: 0; font-family: 'Times New Roman', serif; font-size: 10px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding: 8px 0; margin-bottom: 10px; }
            .header h2 { margin: 0 0 4px 0; font-size: 16px; }
            .header p { margin: 0; font-size: 10px; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; }
            th, td { border: 1px solid #000; padding: 3px 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>GCSheet - ${this.escapeHtml(config.title)}</h2>
            <p>From: ${this.escapeHtml(this.gstStartDate() || 'All')} | To: ${this.escapeHtml(this.gstEndDate() || 'All')}</p>
            <p>Generated: ${this.escapeHtml(new Date().toLocaleString())}</p>
          </div>
          <table>
            <thead><tr>${theadHtml}</tr></thead>
            <tbody>${rowsHtml.join('')}${totalRow}</tbody>
          </table>
        </body>
      </html>
    `;
    this.openPrintWindow(html, config.title);
  }
  async printAllInvoices() {
    const invoices = this.gstInvoices();
    if (invoices.length === 0) return;

    this.gstLoading.set(true);
    try {
      const sections: string[] = [];
      const detailsPromises = invoices.map(invoice => this.getInvoiceDetailsWithPktname(invoice.id));
      const allDetails = await Promise.all(detailsPromises);
      
      for (let i = 0; i < invoices.length; i++) {
        sections.push(this.buildInvoiceHtml(invoices[i], allDetails[i], true));
      }
      this.openPrintWindow(`<html><head><title>GCSheet Invoices</title></head><body style="margin:0;">${sections.join('')}</body></html>`, 'GCSheet Invoices');
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to print invoices');
    } finally {
      this.gstLoading.set(false);
    }
  }

  async printInvoiceFromList(invoice: any) {
    if (!invoice?.id) return;
    this.gstLoading.set(true);
    try {
      const details = await this.getInvoiceDetailsWithPktname(invoice.id);
      this.openPrintWindow(
        `<html><head><title>Invoice ${this.escapeHtml(String(invoice['billno'] || ''))}</title></head><body style="margin:0;">${this.buildInvoiceHtml(invoice, details, false)}</body></html>`,
        `Invoice ${invoice['billno']}`
      );
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to print invoice');
    } finally {
      this.gstLoading.set(false);
    }
  }

  confirmDayEnd() {
    this.showDayEndModal.set(true);
  }

  closeDayEndModal() {
    this.showDayEndModal.set(false);
  }

  async executeDayEnd() {
    const startDate = this.gstStartDate();
    const endDate = this.gstEndDate();
    if (!startDate || !endDate) {
      this.toastService.error('Please select start and end dates');
      return;
    }

    this.gstLoading.set(true);
    try {
      const headersToDelete = this.gstHeadersAll();
      for (const header of headersToDelete) {
        await this.service.deleteSalesDetailsByBillno(header.id);
        await this.service.deleteSalesHeader(header.id);
      }
      this.toastService.success(`Day End completed. ${headersToDelete.length} invoice(s) deleted.`);
      this.closeDayEndModal();
      await this.loadGstData();
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to complete Day End');
    } finally {
      this.gstLoading.set(false);
    }
  }

  private async getInvoiceDetailsWithPktname(headerId: string): Promise<any[]> {
    const cached = this.invoiceDetailsCache.get(headerId);
    if (cached) return cached;
    
    const allDetails = this.gstDetailsAll();
    const invoiceDetails = allDetails.filter(d => String(d['billno']) === String(headerId));
    const pktmasterMap = this.pktmasterMap();
    const result = invoiceDetails.map(detail => {
      const pkt = pktmasterMap.get(detail['pktno']);
      return { ...detail, pktname: pkt?.['pktname'] || detail['pktname'] || '', particulars: detail['particulars'] || pkt?.['pktname'] || '' };
    });
    this.invoiceDetailsCache.set(headerId, result);
    return result;
  }

  private buildInvoiceHtml(invoice: any, details: any[], pageBreak: boolean): string {
    const totalWgt = Number(invoice['totalwgt']) || 0;
    const billAmt = Number(invoice['billamt']) || 0;
    const netAmt = Number(invoice['nettamount']) || 0;
    const other1Amt = Number(invoice['other1_amt']) || 0;
    const other2Amt = Number(invoice['other2_amt']) || 0;
    const loadAmt = Number(invoice['loadamt']) || 0;
    const gstPer = Number(invoice['gstper']) || 0;
    const gstAmt = Number(invoice['gstamt']) || 0;
    const totalAmtBeforeGst = billAmt + loadAmt + other1Amt + other2Amt;
    const customerLines = String(invoice['customername'] || '').split(/\r?\n|,/).map((x: string) => x.trim()).filter((x: string) => x);
    const itemsHtml = details.map((detail: any, idx: number) => {
      const weight = Number(detail.weight) || 0;
      const amount = Number(detail.amount) || 0;
      return `
        <tr>
          <td class="c">${idx + 1}</td>
          <td>${this.escapeHtml(detail.particulars || detail.pktname || '')}</td>
          <td class="r">${this.formatQty(detail.qty)}</td>
          <td class="r">${this.formatIndianNumber(weight, 2)}</td>
          <td class="r">${this.formatIndianNumber(detail.rate, 2)}</td>
          <td class="r">${this.formatIndianNumber(amount, 2)}</td>
        </tr>
      `;
    }).join('');
    const minRows = 16;
    const blankRows = Math.max(0, minRows - details.length);
    const blankRowsHtml = Array.from({ length: blankRows }).map(() => `
      <tr class="blank-row">
        <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td>
      </tr>
    `).join('');

    return `
      <div style="page-break-after:${pageBreak ? 'always' : 'auto'};">
        <style>
          @page { size: A4; margin: 8mm; }
          body { font-family: 'Times New Roman', serif; font-size: 13px; color: #000; margin: 0; }
          .sheet { width: 100%; border: 1px solid #000; }
          .title-grid { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .title-grid td { border: 1px solid #000; padding: 3px 6px; }
          .title { text-align: center; font-size: 30px; }
          .page { text-align: right; width: 220px; }
          .head-grid { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .head-grid td { border: 1px solid #000; vertical-align: top; }
          .left-box { height: 142px; padding: 6px; }
          .left-lines { line-height: 1.3; margin-top: 4px; }
          .left-lines .name { margin-left: 42px; }
          .left-lines .line { margin-left: 42px; }
          .right-box table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .right-box td { border: 1px solid #000; padding: 2px 6px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 2px 4px; }
          th { font-weight: 400; text-align: center; }
          .c { text-align: center; }
          .r { text-align: right; }
          .items {
            table-layout: fixed;
            border-collapse: separate;
            border-spacing: 0;
            border-left: 1px solid #000;
            border-top: 1px solid #000;
          }
          .items th, .items td {
            border: 0 !important;
            border-right: 1px solid #000 !important;
            border-bottom: 1px solid #000 !important;
          }
          .items th:nth-child(1), .items td:nth-child(1) { width: 5%; }
          .items th:nth-child(2), .items td:nth-child(2) { width: 52%; }
          .items th:nth-child(3), .items td:nth-child(3) { width: 10%; }
          .items th:nth-child(4), .items td:nth-child(4) { width: 12%; }
          .items th:nth-child(5), .items td:nth-child(5) { width: 10%; }
          .items th:nth-child(6), .items td:nth-child(6) { width: 11%; }
          .blank-row td { height: 22px; }
          .totals-row { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .totals-row td { border: 1px solid #000; padding: 6px 8px; font-size: 13px; }
          .totals-row .label { text-align: left; }
          .totals-row .value { text-align: right; font-weight: 600; }
          .bottom-wrap { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .bottom-wrap > tbody > tr > td { border: 1px solid #000; vertical-align: top; }
          .left-bottom { height: 180px; padding: 6px; }
          .left-bottom .narration { margin-bottom: 8px; }
          .left-bottom .rupees { margin-top: 72px; font-size: 13px; }
          .right-bottom table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .right-bottom td { border: 1px solid #000; padding: 6px; font-size: 13px; }
          .right-bottom .slabel { text-align: left; }
          .right-bottom .sval { text-align: right; font-weight: 600; }
          .thanks { text-align: center; border-top: 1px solid #000; border-bottom: 1px solid #000; font-size: 13px; }
          .sign-row { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .sign-row td { padding: 8px 12px; font-size: 13px; }
          .sign-row td:last-child { text-align: right; }
        </style>
        <div class="sheet">
          <table class="title-grid">
            <tr>
              <td class="title">Estimate -new</td>
              <td class="page">Page 1 of 1</td>
            </tr>
          </table>

          <table class="head-grid">
            <tr>
              <td style="width:62%">
                <div class="left-box">
                  <div><strong>M/s :</strong></div>
                  <div class="left-lines">
                    <div class="name"><strong>${this.escapeHtml(customerLines[0] || invoice['customername'] || '')}</strong></div>
                    ${(customerLines.slice(1).map((line: string) => `<div class="line">${this.escapeHtml(line)}</div>`).join('')) || '<div class="line">&nbsp;</div><div class="line">&nbsp;</div>'}
                  </div>
                </div>
              </td>
              <td style="width:38%" class="right-box">
                <table>
                  <tr><td colspan="2" class="r"><strong>Date : ${this.escapeHtml(this.formatPrintDate(invoice['billdate']))}</strong></td></tr>
                  <tr><td style="width:45%">Truck No.</td><td><strong>${this.escapeHtml(invoice['truckno'] || '')}</strong></td></tr>
                  <tr><td>Transport :</td><td>${this.escapeHtml(invoice['transportation'] || '')}</td></tr>
                  <tr><td>Weight Slipno:</td><td>${this.escapeHtml(invoice['wgtslipno'] || '')}</td></tr>
                  <tr><td>Load Slipno:</td><td>${this.escapeHtml(invoice['loadslipno'] || '')}</td></tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="items">
            <thead>
              <tr>
                <th>no</th>
                <th>Particulars</th>
                <th>Pieces</th>
                <th>Weight</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              ${blankRowsHtml}
            </tbody>
          </table>
          <table class="totals-row">
            <tr>
              <td class="label">Total  Pcs</td>
              <td class="value">${this.formatQty(invoice['totalpcs'])}</td>
              <td class="label">Total  Kgs</td>
              <td class="value">${this.formatIndianNumber(totalWgt, 2)}</td>
              <td class="value">${this.formatIndianNumber(billAmt, 2)}</td>
            </tr>
          </table>
          <table class="bottom-wrap">
            <tr>
              <td style="width:62%" class="left-bottom">
                <div class="narration"><strong>Narration : ${this.escapeHtml(invoice['narration'] || '')}</strong></div>
                <div class="rupees"><strong>Rs:</strong> ${this.escapeHtml(this.amountInWords(netAmt).toLowerCase())} only</div>
              </td>
              <td style="width:38%" class="right-bottom">
                <table>
                  <tr><td class="slabel">Load Amt :</td><td class="sval">${this.formatIndianNumber(loadAmt, 2)}</td></tr>
                  <tr><td class="slabel">${this.escapeHtml(invoice['other1_desp'] || 'Other 1')} :</td><td class="sval">${this.formatIndianNumber(other1Amt, 2)}</td></tr>
                  <tr><td class="slabel">${this.escapeHtml(invoice['other2_desp'] || 'Other 2')} :</td><td class="sval">${this.formatIndianNumber(other2Amt, 2)}</td></tr>
                  <tr><td class="slabel">&nbsp;</td><td class="sval">&nbsp;</td></tr>
                  <tr><td class="slabel">Total Amount :</td><td class="sval">${this.formatIndianNumber(totalAmtBeforeGst, 2)}</td></tr>
                  <tr><td class="slabel">GST @ ${this.formatIndianNumber(gstPer, 2)} % :</td><td class="sval">${this.formatIndianNumber(gstAmt, 2)}</td></tr>
                  <tr><td class="slabel"><strong>Nett Amount :</strong></td><td class="sval"><strong>${this.formatIndianNumber(netAmt, 2)}</strong></td></tr>
                </table>
              </td>
            </tr>
          </table>
          <div class="thanks">Thank you Visit Again</div>
          <table class="sign-row">
            <tr>
              <td>Checked By</td>
              <td>Authorised Sign</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  }

  private openPrintWindow(html: string, title: string) {
    const printWindow = window.open('', '_blank', 'width=1100,height=700');
    if (!printWindow) {
      this.toastService.error('Please allow popups to print');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.document.title = title;
      printWindow.print();
      setTimeout(() => printWindow.close(), 200);
    }, 250);
  }

  private getFormattedColumnValue(row: any, col: ColDef): string {
    let value = row[col.field || ''];
    if (col.valueFormatter && typeof col.valueFormatter === 'function') {
      value = (col.valueFormatter as Function)({ value, data: row, node: null, column: null, colDef: col });
    } else if (col.type === 'numericColumn') {
      value = this.formatGridNumber(value);
    }
    return String(value ?? '');
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

  private formatPrintDate(value: any): string {
    const normalized = this.normalizeDate(value);
    if (!normalized) return '';
    const parts = normalized.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : normalized;
  }

  private formatIndianNumber(value: any, decimals = 2): string {
    const num = Number(value) || 0;
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  private formatQty(value: any): string {
    const num = Number(value) || 0;
    return Number.isInteger(num) ? String(num) : num.toFixed(2);
  }

  private roundTo2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private splitPacketText(pktname: string): { grade: string; particulars: string } {
    const clean = String(pktname || '').trim().replace(/\s+/g, ' ');
    if (!clean) return { grade: '', particulars: '' };
    const [first, ...rest] = clean.split(' ');
    const looksLikeGrade = /[=]/.test(first) || /^[A-Za-z]+\d/.test(first);
    return looksLikeGrade ? { grade: first, particulars: rest.join(' ') } : { grade: '', particulars: clean };
  }

  private amountInWords(num: number): string {
    if (!num) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const convertChunk = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ` ${ones[n % 10]}` : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ` ${convertChunk(n % 100)}` : '');
      if (n < 100000) return convertChunk(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ` ${convertChunk(n % 1000)}` : '');
      if (n < 10000000) return convertChunk(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ` ${convertChunk(n % 100000)}` : '');
      return convertChunk(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ` ${convertChunk(n % 10000000)}` : '');
    };
    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);
    const rupeesWord = convertChunk(rupees);
    const paiseWord = paise > 0 ? convertChunk(paise) : '';
    return paiseWord ? `${rupeesWord} Rupees and ${paiseWord} Paise` : `${rupeesWord} Rupees`;
  }

  private escapeHtml(value: any): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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
  navigateToGcsheetDayend() { this.router.navigate(['/gcsheet1-dayend']); }
  toggleMasterMenu() { this.showMasterMenu = !this.showMasterMenu; }
  toggleGcsheetMenu() { this.showGcsheetMenu = !this.showGcsheetMenu; }
}
