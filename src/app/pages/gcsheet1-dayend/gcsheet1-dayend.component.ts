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
import { DmsLogfileService } from '../../services/dms-logfile.service';

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
            <button class="btn btn-outline-primary btn-sm" (click)="printSaleRegister()" [disabled]="gstLoading() || gstInvoices().length === 0">
              <i class="bi bi-printer me-1"></i>Sale Register
            </button>
            <button class="btn btn-warning btn-sm" (click)="printAllInvoices()" [disabled]="gstLoading() || gstInvoices().length === 0">
              <i class="bi bi-printer me-1"></i>Print All Sale Invoice
            </button>
            <button class="btn btn-danger btn-sm" (click)="confirmDayEnd()" [disabled]="gstLoading()">
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
  private pbService = inject(DmsLogfileService);
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
      const todaydate = await this.pbService.getLogfileTodayDate();
      if (todaydate) {
        this.gstStartDate.set(todaydate);
        this.globals.setMtodaydate(todaydate);
      } else {
        const globalDate = this.globals.mtodaydate();
        if (globalDate) {
          const normalized = this.normalizeDate(globalDate);
          this.gstStartDate.set(normalized);
        } else {
          const today = new Date().toISOString().split('T')[0];
          this.gstStartDate.set(today);
          this.globals.setMtodaydate(today);
        }
      }
    } catch (e) {
      console.error('Error getting logfile date:', e);
      const today = new Date().toISOString().split('T')[0];
      this.gstStartDate.set(today);
      this.globals.setMtodaydate(today);
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
      
      if (headersToDelete.length > 0) {
        for (const header of headersToDelete) {
          await this.service.deleteSalesDetailsByBillno(header.id);
          await this.service.deleteSalesHeader(header.id);
        }
      }

      await this.pbService.updateLogfileStatus(startDate);
      await this.pbService.createLogfileNextDay(startDate);

      const newLogfile = await this.pbService.getActiveLogfile();
      if (newLogfile) {
        const nextDate = this.normalizeDate(newLogfile['todaydate']);
        this.globals.setMtodaydate(nextDate);
      }

       this.authService.logout();
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

  private escapeHtml(value: any): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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

  async printSaleRegister() {
    const invoices = this.gstInvoices();
    if (invoices.length === 0) return;

    const rowsHtml = invoices.map((row: any) => `
      <tr>
        <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(String(row.billno || ''))}</td>
        <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(this.formatPrintDate(row.billdate))}</td>
        <td style="border:1px solid #000;padding:4px;">${this.escapeHtml(row.customername || '')}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${Number(row.totalpcs) || 0}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatIndianNumber(row.totalwgt)}</td>
        <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatIndianNumber(row.nettamount)}</td>
      </tr>
    `).join('');

    let totalPcs = 0, totalWgt = 0, totalNet = 0;
    for (const row of invoices) {
      totalPcs += Number(row.totalpcs) || 0;
      totalWgt += Number(row.totalwgt) || 0;
      totalNet += Number(row.nettamount) || 0;
    }

    const totalRow = `<tr style="background:#e7f1ff;font-weight:bold;">
      <td style="border:1px solid #000;padding:4px;">Total</td>
      <td style="border:1px solid #000;padding:4px;"></td>
      <td style="border:1px solid #000;padding:4px;"></td>
      <td style="border:1px solid #000;padding:4px;text-align:right;">${totalPcs}</td>
      <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatIndianNumber(totalWgt)}</td>
      <td style="border:1px solid #000;padding:4px;text-align:right;">${this.formatIndianNumber(totalNet)}</td>
    </tr>`;

    const html = `
      <html>
        <head>
          <title>Sale Register</title>
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
            <h2>GCSheet - Sale Register</h2>
            <p>Date: ${this.gstStartDate()}</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
          <table>
            <thead><tr>
              <th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Bill No</th>
              <th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Date</th>
              <th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Customer</th>
              <th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Pcs</th>
              <th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Weight</th>
              <th style="border:1px solid #000;padding:4px;background:#e7f1ff;">Net Amt</th>
            </tr></thead>
            <tbody>${rowsHtml}${totalRow}</tbody>
          </table>
        </body>
      </html>
    `;
    this.openPrintWindow(html, 'Sale Register');
  }

  private async getInvoiceDetailsWithPktname(headerId: string): Promise<any[]> {
    const allDetails = this.gstDetailsAll();
    const invoiceDetails = allDetails.filter(d => String(d['billno']) === String(headerId));
    const pktmasterMap = this.pktmasterMap();
    return invoiceDetails.map(detail => {
      const pkt = pktmasterMap.get(detail['pktno']);
      return { ...detail, pktname: pkt?.['pktname'] || detail['pktname'] || '', particulars: detail['particulars'] || pkt?.['pktname'] || '' };
    });
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
    const itemsHtml = details.map((detail: any, idx: number) => `
      <tr>
        <td class="c">${idx + 1}</td>
        <td>${this.escapeHtml(detail.particulars || detail.pktname || '')}</td>
        <td class="r">${Number(detail.qty) || 0}</td>
        <td class="r">${this.formatIndianNumber(detail.weight, 2)}</td>
        <td class="r">${this.formatIndianNumber(detail.rate, 2)}</td>
        <td class="r">${this.formatIndianNumber(detail.amount, 2)}</td>
      </tr>
    `).join('');

    const minRows = 16;
    const blankRows = Math.max(0, minRows - details.length);
    const blankRowsHtml = Array.from({ length: blankRows }).map(() => `
      <tr class="blank-row"><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
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
          .items { table-layout: fixed; border-collapse: separate; border-spacing: 0; border-left: 1px solid #000; border-top: 1px solid #000; }
          .items th, .items td { border: 0 !important; border-right: 1px solid #000 !important; border-bottom: 1px solid #000 !important; }
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
          <table class="title-grid"><tr><td class="title">Estimate -new</td><td class="page">Page 1 of 1</td></tr></table>
          <table class="head-grid"><tr>
            <td style="width:62%"><div class="left-box">
              <div><strong>M/s :</strong></div>
              <div class="left-lines">
                <div class="name"><strong>${this.escapeHtml(customerLines[0] || invoice['customername'] || '')}</strong></div>
                ${(customerLines.slice(1).map((line: string) => `<div class="line">${this.escapeHtml(line)}</div>`).join('')) || '<div class="line">&nbsp;</div><div class="line">&nbsp;</div>'}
              </div>
            </div></td>
            <td style="width:38%" class="right-box"><table>
              <tr><td colspan="2" class="r"><strong>Date : ${this.escapeHtml(this.formatPrintDate(invoice['billdate']))}</strong></td></tr>
              <tr><td style="width:45%">Truck No.</td><td><strong>${this.escapeHtml(invoice['truckno'] || '')}</strong></td></tr>
              <tr><td>Transport :</td><td>${this.escapeHtml(invoice['transportation'] || '')}</td></tr>
              <tr><td>Weight Slipno:</td><td>${this.escapeHtml(invoice['wgtslipno'] || '')}</td></tr>
              <tr><td>Load Slipno:</td><td>${this.escapeHtml(invoice['loadslipno'] || '')}</td></tr>
            </table></td>
          </tr></table>
          <table class="items"><thead><tr>
            <th>no</th><th>Particulars</th><th>Pieces</th><th>Weight</th><th>Rate</th><th>Amount</th>
          </tr></thead><tbody>${itemsHtml}${blankRowsHtml}</tbody></table>
          <table class="totals-row"><tr>
            <td class="label">Total  Pcs</td><td class="value">${Number(invoice['totalpcs']) || 0}</td>
            <td class="label">Total  Kgs</td><td class="value">${this.formatIndianNumber(totalWgt, 2)}</td>
            <td class="value">${this.formatIndianNumber(billAmt, 2)}</td>
          </tr></table>
          <table class="bottom-wrap"><tr>
            <td style="width:62%" class="left-bottom">
              <div class="narration"><strong>Narration : ${this.escapeHtml(invoice['narration'] || '')}</strong></div>
              <div class="rupees"><strong>Rs:</strong> ${this.escapeHtml(this.amountInWords(netAmt).toLowerCase())} only</div>
            </td>
            <td style="width:38%" class="right-bottom"><table>
              <tr><td class="slabel">Load Amt :</td><td class="sval">${this.formatIndianNumber(loadAmt, 2)}</td></tr>
              <tr><td class="slabel">${this.escapeHtml(invoice['other1_desp'] || 'Other 1')} :</td><td class="sval">${this.formatIndianNumber(other1Amt, 2)}</td></tr>
              <tr><td class="slabel">${this.escapeHtml(invoice['other2_desp'] || 'Other 2')} :</td><td class="sval">${this.formatIndianNumber(other2Amt, 2)}</td></tr>
              <tr><td class="slabel">&nbsp;</td><td class="sval">&nbsp;</td></tr>
              <tr><td class="slabel">Total Amount :</td><td class="sval">${this.formatIndianNumber(totalAmtBeforeGst, 2)}</td></tr>
              <tr><td class="slabel">GST @ ${this.formatIndianNumber(gstPer, 2)} % :</td><td class="sval">${this.formatIndianNumber(gstAmt, 2)}</td></tr>
              <tr><td class="slabel"><strong>Nett Amount :</strong></td><td class="sval"><strong>${this.formatIndianNumber(netAmt, 2)}</strong></td></tr>
            </table></td>
          </tr></table>
          <div class="thanks">Thank you Visit Again</div>
          <table class="sign-row"><tr><td>Checked By</td><td>Authorised Sign</td></tr></table>
        </div>
      </div>
    `;
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

  async printAllInvoices() {
    const invoices = this.gstInvoices();
    if (invoices.length === 0) return;

    this.gstLoading.set(true);
    try {
      const sections: string[] = [];
      for (let i = 0; i < invoices.length; i++) {
        const details = await this.getInvoiceDetailsWithPktname(invoices[i].id);
        sections.push(this.buildInvoiceHtml(invoices[i], details, true));
      }
      this.openPrintWindow(`<html><head><title>GCSheet Invoices</title></head><body style="margin:0;">${sections.join('')}</body></html>`, 'GCSheet Invoices');
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to print invoices');
    } finally {
      this.gstLoading.set(false);
    }
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