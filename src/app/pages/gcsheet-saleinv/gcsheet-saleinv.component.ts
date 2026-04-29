import { Component, inject, signal, computed, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GcsheetSaleinvService } from '../../services/gcsheet-saleinv.service';
import { ToastService } from '../../shared/toast/toast.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { AppGlobalsService } from '../../services/app-globals.service';

@Component({
  selector: 'app-gcsheet-saleinvcopy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PaginationComponent, DatePipe, DecimalPipe],
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
                <li><a class="dropdown-item active" style="color: #0d6efd; font-weight: 500;"><i class="bi bi-receipt me-2"></i>Sale Invoice</a></li>
                <li><a class="dropdown-item" (click)="navigateToGcsheetSalereport()"><i class="bi bi-file-earmark-bar-graph me-2"></i>Sale Report</a></li>
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

    <div class="container mt-4">
      @if (!showForm()) {
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0"><i class="bi bi-receipt me-2"></i>Gcsheet Sale Invoice</h4>
          </div>
          <div class="card-body pt-2">
            <div class="d-flex justify-content-between align-items-center mt-2">
              <button class="btn btn-primary btn-sm" (click)="openAddModal()">
                <i class="bi bi-plus-circle me-1"></i>New Invoice
              </button>
              <div class="input-group" style="width: 300px;">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" placeholder="Search..." 
                       [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)">
              </div>
            </div>

            @if (loading()) {
              <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Loading invoices...</p>
              </div>
            } @else {
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Bill No</th>
                      <th>Bill Date</th>
                      <th>Customer</th>
                      <th>Truck No</th>
                      <th>Total Pcs</th>
                      <th>Total Wgt</th>
                      <th>Net Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (inv of paginatedInvoices(); track inv.id) {
                      <tr>
                        <td>{{ inv['billno'] }}</td>
                        <td>{{ formatDateForInput(inv['billdate']) | date:'dd-MM-yyyy' }}</td>
                        <td>{{ inv['customername'] }}</td>
                        <td>{{ inv['truckno'] }}</td>
                        <td class="text-end">{{ inv['totalpcs'] }}</td>
                        <td class="text-end">{{ inv['totalwgt'] | number:'1.2-2' }}</td>
                        <td>{{ inv['nettamount'] | number:'1.2-2' }}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary me-1" (click)="openEditModal(inv)">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-secondary me-1" (click)="printInvoiceFromList(inv)">
                            <i class="bi bi-printer"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" (click)="openDeleteModal(inv)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    } @empty {
                      <tr><td colspan="8" class="text-center text-muted">No invoices found</td></tr>
                    }
                  </tbody>
                </table>
                <app-pagination 
                  [totalItems]="totalFilteredInvoices()"
                  [pageSize]="invoicePageSize()"
                  (pageSizeChange)="onInvoicePageSizeChange($event)"
                  (currentPageChange)="onInvoicePageChange($event)">
                </app-pagination>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="card">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0"><i class="bi bi-receipt me-2"></i>{{ isEditMode() ? 'Edit' : 'New' }} Sale Invoice</h4>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-light btn-sm" (click)="cancelForm()">
                <i class="bi bi-x-circle me-1"></i>Cancel
              </button>
              <button type="button" class="btn btn-light btn-sm" (click)="saveAndPrint()" [disabled]="saving()">
                <i class="bi bi-printer me-1"></i>Save & Print
              </button>
              <button type="button" class="btn btn-light btn-sm" (click)="saveInvoice()" [disabled]="saving()">
                <i class="bi bi-check-circle me-1"></i>Save
              </button>
            </div>
          </div>
          @if (saveProgress()) {
            <div class="card-header bg-info text-white py-1">
              <div class="d-flex align-items-center">
                <span class="me-2">Saving details...</span>
                <div class="progress flex-grow-1" style="height: 8px;">
                  <div class="progress-bar bg-white" 
                       [style.width.%]="(saveProgress()!.current / saveProgress()!.total) * 100">
                  </div>
                </div>
                <span class="ms-2">{{ saveProgress()!.current }}/{{ saveProgress()!.total }}</span>
              </div>
            </div>
          }
          <div class="card-body">
            @if (formError()) {
              <div class="alert alert-danger">{{ formError() }}</div>
            }
            <form [formGroup]="headerForm">
              <div class="row g-2">
                <div class="col-md-1">
                  <div class="form-floating">
                    <input type="number" class="form-control" formControlName="billno" id="billno" readonly placeholder=" ">
                    <label for="billno">Bill No</label>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-floating">
                    <input type="date" class="form-control" formControlName="billdate" id="billdate" placeholder=" "
                           (keydown.enter)="focusFieldById('customername', $event)">
                    <label for="billdate">Bill Date</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" formControlName="customername" id="customername" placeholder=" "
                           (keydown.enter)="focusFieldById('deliverylocation', $event)">
                    <label for="customername">Customer Name</label>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating">
                    <input type="text" class="form-control" formControlName="deliverylocation" id="deliverylocation" placeholder=" "
                           (keydown.enter)="focusFieldById('truckno', $event)">
                    <label for="deliverylocation">Delivery Location</label>
                  </div>
                </div>
              </div>
              <hr class="my-1">
              <div class="row g-2">
                <div class="col-md-4">
                  <div class="form-floating" style="height: 45px;">
                    <input type="text" class="form-control" id="productSearch" placeholder=" " style="height: 45px;"
                           [value]="productQuery()" (input)="onProductSearch($any($event.target).value)"
                           (keydown.arrowdown)="moveProductSelection(1, $event)" (keydown.arrowup)="moveProductSelection(-1, $event)"
                           (keydown.enter)="onProductEnter($event)" (keydown.escape)="closeProductDropdown()"
                           (focus)="openProductDropdown()" 
                           (blur)="closeProductDropdownDelayed()" (click)="$event.stopPropagation()"
                           #productSearchInput>
                    <label for="productSearch">Search Product</label>
                    @if (showProductDropdown() && filteredProductList().length > 0) {
                      <ul class="list-group autocomplete-dropdown">
                        @for (pkt of filteredProductList(); track pkt.id; let i = $index) {
                          <li class="list-group-item list-group-item-action" 
                              [class.top-match]="i === highlightedProductIndex()"
                              (mousedown)="selectProduct(pkt)">
                            {{ pkt['pktname'] }}
                          </li>
                        }
                      </ul>
                    }
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-floating">
                    <input type="text" class="form-control" formControlName="truckno" id="truckno" placeholder=" "
                           (keydown.enter)="focusFieldById('transportation', $event)">
                    <label for="truckno">Truck No</label>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-floating">
                    <input type="text" class="form-control" formControlName="transportation" id="transportation" placeholder=" "
                           (keydown.enter)="focusFieldById('narration', $event)">
                    <label for="transportation">Transportation</label>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating">
                    <input type="text" class="form-control" formControlName="narration" id="narration" placeholder=" "
                           (keydown.enter)="focusFieldById('other1Desp', $event)">
                    <label for="narration">Narration</label>
                  </div>
                </div>
              </div>
              <div formArrayName="details" class="mt-1">
                <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
                  <table class="table table-sm table-bordered">
                    <thead class="table-light">
<tr>
                        <th style="width: 50px">Sr No</th>
                        <th style="width: 300px">Particulars</th>
                        <th style="width: 100px; text-align: right;">
                          <div class="d-flex flex-column">
                            <span class="small text-muted">Total: {{ totalPcs() }}</span>
                            <span>Qty</span>
                          </div>
                        </th>
                        <th style="width: 100px; text-align: right;">
                          <div class="d-flex flex-column">
                            <span class="small text-muted">Total: {{ totalWeight() | number:'1.2-2' }}</span>
                            <span>Weight</span>
                          </div>
                        </th>
                        <th style="width: 100px; text-align: right;">Rate</th>
                        <th style="width: 120px; text-align: right;">
                          <div class="d-flex flex-column">
                            <span class="small text-muted">Total: {{ billAmount() | number:'1.2-2' }}</span>
                            <span>Amount</span>
                          </div>
                        </th>
                        <th style="width: 80px">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (detail of detailsArray.controls; track detail; let i = $index) {
                        <tr [formGroupName]="i">
                          <td>{{ i + 1 }}</td>
<td>
                            <input type="text" class="form-control form-control-sm" formControlName="particulars" 
                                   placeholder="Particulars">
                          </td>
                          <td>
                            <input type="number" class="form-control form-control-sm text-end" formControlName="qty" 
                                   (input)="calculateAmount(i)" (keydown.enter)="focusWeight(i, $event)"
                                   (focus)="$any($event.target).select()"
                                   [attr.data-qty-index]="i">
                          </td>
                          <td>
                            <input type="number" class="form-control form-control-sm text-end" formControlName="weight"
                                   (input)="calculateAmount(i)" (keydown.enter)="focusRate(i, $event)"
                                   (focus)="$any($event.target).select()"
                                   [attr.data-weight-index]="i">
                          </td>
                          <td>
                            <input type="number" class="form-control form-control-sm text-end" formControlName="rate"
                                   (input)="calculateAmount(i)" (keydown.enter)="focusProductSearch($event)"
                                   (focus)="$any($event.target).select()"
                                   [attr.data-rate-index]="i">
                          </td>
                          <td>
                            <input type="number" class="form-control form-control-sm text-end" formControlName="amount" readonly>
                          </td>
                          <td>
                            <button class="btn btn-sm btn-outline-danger" (click)="removeDetail(i)">
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="row g-2 mt-0 align-items-end compact-summary-row">
                <div class="col-md-3">
                  <div class="form-floating compact-floating">
                    <input type="text" class="form-control" formControlName="other1_desp" id="other1Desp" placeholder=" "
                           (keydown.enter)="focusFieldById('other1Amount', $event)">
                    <label for="other1Desp">Other 1 Description</label>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-floating compact-floating">
                    <input type="number" class="form-control" [ngModel]="other1Amt()" 
                           (ngModelChange)="other1Amt.set(toNumber($event)); detailsTrigger.update(v => v + 1)" 
                           [ngModelOptions]="{standalone: true}" id="other1Amount"
                           (keydown.enter)="focusFieldById('loadAmt', $event)">
                    <label for="other1Amount">Other 1 Amount</label>
                  </div>
                </div>
                <div class="col-md-1">
                  <div class="form-floating compact-floating">
                    <input type="number" class="form-control" [ngModel]="loadAmt()" 
                           (ngModelChange)="loadAmt.set(toNumber($event)); detailsTrigger.update(v => v + 1)" 
                           [ngModelOptions]="{standalone: true}" id="loadAmt"
                           (keydown.enter)="focusFieldById('gstPer', $event)">
                    <label for="loadAmt">Load Amt</label>
                  </div>
                </div>
                <div class="col-md-1">
                  <div class="form-floating compact-floating">
                    <input type="number" class="form-control" [ngModel]="gstPer()" 
                           (ngModelChange)="gstPer.set(toNumber($event)); detailsTrigger.update(v => v + 1)" 
                           [ngModelOptions]="{standalone: true}" id="gstPer"
                           (keydown.enter)="focusFieldById('other2Desp', $event)">
                    <label for="gstPer">GST %</label>
                  </div>
                </div>
                <div class="col-md-1">
                  <div class="form-floating compact-floating">
                    <input type="text" class="form-control text-end" [value]="gstAmt() | number:'1.2-2'" readonly id="gstAmt">
                    <label for="gstAmt">GST Amount</label>
                  </div>
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-2">
                  <div class="form-floating compact-floating">
                    <input type="text" class="form-control text-end" [value]="netAmount() | number:'1.2-2'" readonly id="netAmount">
                    <label for="netAmount">Net Amount</label>
                  </div>
                </div>
              </div>
              <div class="row g-2 mt-1 align-items-end compact-summary-row second-compact-row">
                <div class="col-md-3">
                  <div class="form-floating compact-floating">
                    <input type="text" class="form-control" formControlName="other2_desp" id="other2Desp" placeholder=" "
                           (keydown.enter)="focusFieldById('other2Amount', $event)">
                    <label for="other2Desp">Other 2 Description</label>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-floating compact-floating">
                    <input type="number" class="form-control" [ngModel]="other2Amt()" 
                           (ngModelChange)="other2Amt.set(toNumber($event)); detailsTrigger.update(v => v + 1)" 
                           [ngModelOptions]="{standalone: true}" id="other2Amount"
                           (keydown.enter)="focusProductSearch($event)">
                    <label for="other2Amount">Other 2 Amount</label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      }
    </div>

    @if (showDeleteModal()) {
      <div class="modal show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Delete</h5>
              <button type="button" class="btn-close" (click)="closeDeleteModal()"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete invoice #{{ invoiceToDelete()?.['billno'] }}?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeDeleteModal()">Cancel</button>
              <button type="button" class="btn btn-danger" (click)="confirmDelete()" [disabled]="saving()">Delete</button>
            </div>
          </div>
        </div>
      </div>
    }

  `,
  styles: [`
    .navbar .dropdown-menu { position: absolute; }
    .dropdown-item.active { background-color: #f8f9fa; font-weight: 500; }
    .autocomplete-dropdown {
      position: absolute;
      z-index: 1200;
      max-height: 200px;
      overflow-y: auto;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 0.25rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      min-width: 100%;
      width: 300px;
    }
    .autocomplete-dropdown .list-group-item {
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    .autocomplete-dropdown .list-group-item:hover,
    .autocomplete-dropdown .list-group-item.active {
      background-color: #e9ecef;
      color: #0d6efd;
    }
    .autocomplete-dropdown .top-match {
      background-color: #fff3cd;
      font-weight: 600;
    }
    .compact-floating > .form-control {
      min-height: calc(2.8rem + 2px);
      height: calc(2.8rem + 2px);
      padding-top: 1.1rem;
      padding-bottom: 0.35rem;
    }
    .compact-floating > label {
      padding-top: 0.55rem;
      padding-bottom: 0.35rem;
    }
    .compact-summary-row {
      margin-top: -0.55rem !important;
    }
    .second-compact-row {
      margin-top: -0.45rem !important;
    }
  `]
})
export class GcsheetSaleinvComponent implements OnInit {
  private service = inject(GcsheetSaleinvService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected toastService = inject(ToastService);
  private globals = inject(AppGlobalsService);

  @ViewChild('pktnameInput') pktnameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('productSearchInput') productSearchInput!: ElementRef<HTMLInputElement>;

  invoices = signal<any[]>([]);
  pktmasterList = signal<any[]>([]);
  
  loading = signal(false);
  saving = signal(false);
  searchTerm = signal('');
  invoicePageSize = signal(50);
  invoiceCurrentPage = signal(1);
  showForm = signal(false);
  showDeleteModal = signal(false);
  isEditMode = signal(false);
  currentInvoice = signal<any>(null);
  invoiceToDelete = signal<any>(null);
  formError = signal<string | null>(null);
  other1Amt = signal<number>(0);
  other2Amt = signal<number>(0);
  loadAmt = signal<number>(0);
  gstPer = signal<number>(0);
  detailsTrigger = signal(0);
  saveProgress = signal<{ current: number; total: number } | null>(null);
  
  isCollapsed = true;
  showMasterMenu = false;
  showGcsheetMenu = false;

  productQuery = signal('');
  showProductDropdown = signal(false);
  highlightedProductIndex = signal(0);

  pktQueries = signal<Map<number, string>>(new Map());
  showPktDropdowns = signal<Map<number, boolean>>(new Map());
  highlightedPktIndices = signal<Map<number, number>>(new Map());

  headerForm: FormGroup = this.fb.group({
    billno: [''],
    billdate: [''],
    customername: [''],
    deliverylocation: [''],
    truckno: [''],
    transportation: [''],
    narration: [''],
    other1_desp: [''],
    other2_desp: [''],
    details: this.fb.array([])
  });

  get detailsArray(): FormArray {
    return this.headerForm.get('details') as FormArray;
  }

  formatDateForInput(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    if (typeof dateStr === 'string') {
      if (dateStr.includes('T')) {
        return dateStr.split('T')[0];
      }
      if (dateStr.includes(' ')) {
        return dateStr.split(' ')[0];
      }
    }
    return String(dateStr);
  }

  private formatPrintDate(dateStr: string | null | undefined): string {
    const normalized = this.formatDateForInput(dateStr || '');
    if (!normalized) return '';
    const parts = normalized.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return normalized;
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
    if (Number.isInteger(num)) return String(num);
    return num.toFixed(2);
  }

  toNumber(value: any): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  onInvoicePageChange(page: number): void {
    this.invoiceCurrentPage.set(page);
  }

  onInvoicePageSizeChange(size: number): void {
    this.invoicePageSize.set(size);
    this.invoiceCurrentPage.set(1);
  }

  roundTo2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private escapeHtml(value: any): string {
    const text = String(value ?? '');
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private splitPacketText(pktname: string): { grade: string; particulars: string } {
    const clean = String(pktname || '').trim().replace(/\s+/g, ' ');
    if (!clean) return { grade: '', particulars: '' };
    const [first, ...rest] = clean.split(' ');
    const looksLikeGrade = /[=]/.test(first) || /^[A-Za-z]+\d/.test(first);
    if (looksLikeGrade) {
      return { grade: first, particulars: rest.join(' ') };
    }
    return { grade: '', particulars: clean };
  }

  private amountInWords(num: number): string {
    if (!num) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
      'Eighteen', 'Nineteen'];
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

    let result = `${rupeesWord} Rupees`;
    if (paiseWord) result += ` and ${paiseWord} Paise`;
    return result;
  }

  filteredInvoices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.invoices().filter(inv => 
      String(inv['billno'] || '').toLowerCase().includes(term) ||
      (inv['customername'] || '').toLowerCase().includes(term) ||
      (inv['truckno'] || '').toLowerCase().includes(term)
    );
  });

  totalFilteredInvoices = computed(() => this.filteredInvoices().length);

  paginatedInvoices = computed(() => {
    const start = (this.invoiceCurrentPage() - 1) * this.invoicePageSize();
    const end = start + this.invoicePageSize();
    return this.filteredInvoices().slice(start, end);
  });

  filteredProductList = computed(() => {
    const q = this.productQuery().trim().toLowerCase();
    const filtered = this.pktmasterList().filter(p => (p['pktname'] || '').toLowerCase().includes(q));
    const sorted = filtered.sort((a, b) => (a['pktname'] || '').toLowerCase().localeCompare((b['pktname'] || '').toLowerCase()));
    return sorted.slice(0, 30);
  });

  pktmasterMap = computed(() => {
    const map = new Map<string, any>();
    this.pktmasterList().forEach(pkt => {
      if (pkt?.id) map.set(pkt.id, pkt);
    });
    return map;
  });

  totalPcs = computed(() => {
    this.detailsTrigger();
    return this.detailsArray.controls.reduce((sum, ctrl) => sum + (parseFloat(ctrl.get('qty')?.value) || 0), 0);
  });

  totalWeight = computed(() => {
    this.detailsTrigger();
    return this.detailsArray.controls.reduce((sum, ctrl) => sum + (parseFloat(ctrl.get('weight')?.value) || 0), 0);
  });

  billAmount = computed(() => {
    this.detailsTrigger();
    return this.detailsArray.controls.reduce((sum, ctrl) => sum + (parseFloat(ctrl.get('amount')?.value) || 0), 0);
  });

  gstAmt = computed(() => {
    const taxableAmount =
      this.billAmount() +
      this.toNumber(this.loadAmt()) +
      this.toNumber(this.other1Amt()) +
      this.toNumber(this.other2Amt());
    const gstAmount = (taxableAmount * this.toNumber(this.gstPer())) / 100;
    return this.roundTo2(gstAmount);
  });

  netAmount = computed(() => {
    return Math.round(this.billAmount() + this.toNumber(this.other1Amt()) + this.toNumber(this.other2Amt()) + this.toNumber(this.loadAmt()) + this.toNumber(this.gstAmt()));
  });

  ngOnInit() {
    this.loadData();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToGroupmaster(): void {
    this.router.navigate(['/groupmaster']);
  }

  navigateToGcsheetCompany(): void {
    this.router.navigate(['/gcsheet-company']);
  }

  navigateToGcsheetFit(): void {
    this.router.navigate(['/gcsheet-fit']);
  }

  navigateToGcsheetMm(): void {
    this.router.navigate(['/gcsheet-mm']);
  }

  navigateToGcsheetGrade(): void {
    this.router.navigate(['/gcsheet-grade']);
  }

  navigateToGcsheetItem(): void {
    this.router.navigate(['/gcsheet-item']);
  }

  navigateToGcsheetNali(): void {
    this.router.navigate(['/gcsheet-nali']);
  }

  navigateToGcsheetPktmaster(): void {
    this.router.navigate(['/gcsheet-pktmaster']);
  }

  navigateToGcsheetSalereport(): void {
    this.router.navigate(['/gcsheet1-salereport']);
  }

  async loadData() {
    this.loading.set(true);
    try {
      const [invoices, pktmaster] = await Promise.all([
        this.service.getSalesHeaderAll(),
        this.service.getPktmasterAll()
      ]);
      this.invoices.set(invoices);
      this.pktmasterList.set(pktmaster);
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to load data');
    } finally {
      this.loading.set(false);
    }
  }

  getPktname(index: number): string {
    const pktno = this.detailsArray.at(index)?.get('pktno')?.value;
    if (!pktno) return '';
    const pkt = this.pktmasterMap().get(pktno);
    return pkt ? pkt['pktname'] || pkt['pktno'] : '';
  }

  filteredPktList(index: number): any[] {
    const q = (this.pktQueries().get(index) || '').toLowerCase();
    return this.pktmasterList()
      .filter(p => (p['pktname'] || '').toLowerCase().includes(q))
      .slice(0, 20);
  }

  showPktDropdown(index: number): boolean {
    return this.showPktDropdowns().get(index) || false;
  }

  highlightedPktIndex(index: number): number {
    return this.highlightedPktIndices().get(index) || 0;
  }

  onPktSearch(index: number, value: string) {
    const queries = new Map(this.pktQueries());
    queries.set(index, value);
    this.pktQueries.set(queries);
    
    const dropdowns = new Map(this.showPktDropdowns());
    dropdowns.set(index, true);
    this.showPktDropdowns.set(dropdowns);
    
    const indices = new Map(this.highlightedPktIndices());
    indices.set(index, 0);
    this.highlightedPktIndices.set(indices);
    
    this.detailsArray.at(index).patchValue({ pktno: '', pktno_invalid: true });
  }

  onPktEnter(index: number, event: Event) {
    event.preventDefault();
    const list = this.filteredPktList(index);
    const idx = Math.min(Math.max(this.highlightedPktIndex(index), 0), list.length - 1);
    const selected = list[idx];
    if (!selected) return;
    this.selectPkt(index, selected);
  }

  movePktSelection(index: number, step: number, event: Event) {
    event.preventDefault();
    const list = this.filteredPktList(index);
    if (!list.length) return;
    
    const dropdowns = new Map(this.showPktDropdowns());
    dropdowns.set(index, true);
    this.showPktDropdowns.set(dropdowns);
    
    const indices = new Map(this.highlightedPktIndices());
    const next = (this.highlightedPktIndex(index) + step + list.length) % list.length;
    indices.set(index, next);
    this.highlightedPktIndices.set(indices);
  }

selectPkt(index: number, pkt: any) {
    const qty = pkt['pcsperpkt'] || 0;
    this.detailsArray.at(index).patchValue({ 
      pktno: pkt.id, 
      pktname: pkt['pktname'], 
      particulars: pkt['pktname'] || '',
      pktno_invalid: false,
      qty: qty,
      weight: 0,
      rate: 0,
      amount: 0
    });
    
    const queries = new Map(this.pktQueries());
    queries.set(index, pkt['pktname']);
    this.pktQueries.set(queries);
    
    const dropdowns = new Map(this.showPktDropdowns());
    dropdowns.set(index, false);
    this.showPktDropdowns.set(dropdowns);
    
    setTimeout(() => {
      const qtyInputs = document.querySelectorAll('input[data-qty-index]');
      const qtyInput = qtyInputs[index] as HTMLInputElement;
      if (qtyInput) qtyInput.focus();
    }, 50);
  }

  onProductSearch(value: string) {
    this.productQuery.set(value);
    this.showProductDropdown.set(true);
    this.highlightedProductIndex.set(0);
  }

  onProductEnter(event: Event) {
    event.preventDefault();
    const list = this.filteredProductList();
    const idx = Math.min(Math.max(this.highlightedProductIndex(), 0), list.length - 1);
    const selected = list[idx];
    if (!selected) return;
    this.selectProduct(selected);
  }

  moveProductSelection(step: number, event: Event) {
    event.preventDefault();
    const list = this.filteredProductList();
    if (!list.length) return;
    this.showProductDropdown.set(true);
    const next = this.highlightedProductIndex() + step;
    const clamped = Math.max(0, Math.min(list.length - 1, next));
    this.highlightedProductIndex.set(clamped);
    setTimeout(() => this.scrollHighlightedItemIntoView(), 0);
  }

  scrollHighlightedItemIntoView() {
    const el = document.querySelector('.list-group-item.top-match') as HTMLElement;
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  focusProductSearch(event: Event) {
    event.preventDefault();
    this.productSearchInput?.nativeElement?.focus();
  }

  focusFieldById(fieldId: string, event: Event) {
    event.preventDefault();
    const input = document.getElementById(fieldId) as HTMLInputElement | null;
    if (input) {
      input.focus();
      if (typeof input.select === 'function' && input.type !== 'date') {
        input.select();
      }
    }
  }

  focusTruckno(event: Event) {
    event.preventDefault();
    const trucknoInput = document.getElementById('truckno') as HTMLInputElement;
    if (trucknoInput) trucknoInput.focus();
  }

  focusProductSearchFromHeader(event: Event) {
    event.preventDefault();
    this.productSearchInput?.nativeElement?.focus();
  }

  focusCustomerName() {
    setTimeout(() => {
      const customerInput = document.getElementById('customername') as HTMLInputElement;
      if (customerInput) customerInput.focus();
    }, 100);
  }

  focusWeight(index: number, event: Event) {
    event.preventDefault();
    const weightInputs = document.querySelectorAll('input[data-weight-index]');
    const weightInput = weightInputs[index] as HTMLInputElement;
    if (weightInput) weightInput.focus();
  }

  focusRate(index: number, event: Event) {
    event.preventDefault();
    const rateInputs = document.querySelectorAll('input[data-rate-index]');
    const rateInput = rateInputs[index] as HTMLInputElement;
    if (rateInput) rateInput.focus();
  }

selectProduct(pkt: any) {
    const qty = pkt['pcsperpkt'] || 0;
    let targetIndex: number;
    
    const detailGroup = this.fb.group({
      pktno: [pkt.id],
      pktname: [pkt['pktname']],
      particulars: [pkt['pktname'] || ''],
      pktno_invalid: [false],
      qty: [qty],
      weight: [0],
      rate: [0],
      amount: [0]
    });
    this.detailsArray.push(detailGroup);
    targetIndex = this.detailsArray.length - 1;
    this.detailsTrigger.update(v => v + 1);
    
    const queries = new Map(this.pktQueries());
    queries.set(targetIndex, pkt['pktname']);
    this.pktQueries.set(queries);
    
    this.productQuery.set('');
    this.showProductDropdown.set(false);
    this.highlightedProductIndex.set(0);
    
    setTimeout(() => {
      const qtyInputs = document.querySelectorAll('input[data-qty-index]');
      const qtyInput = qtyInputs[targetIndex] as HTMLInputElement;
      if (qtyInput) qtyInput.focus();
    }, 50);
  }

  openProductDropdown() {
    this.showProductDropdown.set(true);
    this.highlightedProductIndex.set(0);
  }

  closeProductDropdownDelayed() {
    setTimeout(() => this.showProductDropdown.set(false), 120);
  }

  closeProductDropdown() {
    this.showProductDropdown.set(false);
  }

  openPktDropdown(index: number) {
    const dropdowns = new Map(this.showPktDropdowns());
    dropdowns.set(index, true);
    this.showPktDropdowns.set(dropdowns);
  }

  closePktDropdownDelayed(index: number) {
    setTimeout(() => {
      const dropdowns = new Map(this.showPktDropdowns());
      dropdowns.set(index, false);
      this.showPktDropdowns.set(dropdowns);
    }, 120);
  }

  calculateAmount(index: number) {
    const qty = parseFloat(this.detailsArray.at(index).get('qty')?.value) || 0;
    const rate = parseFloat(this.detailsArray.at(index).get('rate')?.value) || 0;
    const amount = qty * rate;
    this.detailsArray.at(index).patchValue({ amount: amount });
    this.detailsTrigger.update(v => v + 1);
  }

addDetail() {
    const detailGroup = this.fb.group({
      pktno: [''],
      pktname: [''],
      particulars: [''],
      pktno_invalid: [false],
      qty: [0],
      weight: [0],
      rate: [0],
      amount: [0]
    });
    this.detailsArray.push(detailGroup);
  }

  removeDetail(index: number) {
    this.detailsArray.removeAt(index);
    this.detailsTrigger.update(v => v + 1);
  }

    async openAddModal() {
     this.isEditMode.set(false);
     this.currentInvoice.set(null);
     this.formError.set(null);
     this.other1Amt.set(0);
     this.other2Amt.set(0);
     this.loadAmt.set(0);
     this.gstPer.set(0);
     this.productQuery.set('');
     this.showProductDropdown.set(false);
     
     this.detailsArray.clear();
     this.pktQueries.set(new Map());
     this.showPktDropdowns.set(new Map());
     this.highlightedPktIndices.set(new Map());
     
     const maxBillno = await this.service.getMaxBillno();
     // Use global mtodaydate instead of current date
     const today = this.globals.mtodaydate() || new Date().toISOString().split('T')[0];
     
     this.headerForm.patchValue({
       billno: maxBillno,
       billdate: today,
       customername: '',
       deliverylocation: '',
       truckno: '',
       transportation: '',
       narration: '',
       other1_desp: '',
       other2_desp: ''
     });
     
     this.showForm.set(true);
     this.focusCustomerName();
   }

  async openEditModal(inv: any) {
    this.isEditMode.set(true);
    this.currentInvoice.set(inv);
    this.formError.set(null);
    this.productQuery.set('');
    this.showProductDropdown.set(false);
    
    this.detailsArray.clear();
    this.pktQueries.set(new Map());
    this.showPktDropdowns.set(new Map());
    this.highlightedPktIndices.set(new Map());
    
    this.headerForm.reset();
    setTimeout(() => {
      this.headerForm.patchValue({
        billno: inv['billno'],
        billdate: this.formatDateForInput(inv['billdate']),
        customername: inv['customername'] || '',
        deliverylocation: inv['deliverylocation'] || '',
        truckno: inv['truckno'] || '',
        transportation: inv['transportation'] || '',
        narration: inv['narration'] || '',
        other1_desp: inv['other1_desp'] || '',
        other2_desp: inv['other2_desp'] || ''
      });
    }, 0);
    
    this.other1Amt.set(inv['other1_amt'] || 0);
    this.other2Amt.set(inv['other2_amt'] || 0);
    this.loadAmt.set(inv['loadamt'] || 0);
    this.gstPer.set(inv['gstper'] || 0);
    
    try {
      const details = await this.service.getSalesDetails(inv.id);
      if (details.length === 0) {
        this.addDetail();
      } else {
for (const det of details) {
          const pkt = this.pktmasterMap().get(det['pktno']);
          const pktname = pkt ? pkt['pktname'] : '';
          const particulars = det['particulars'] || pktname || '';
          
          const detailGroup = this.fb.group({
            id: [det['id'] || ''],
            pktno: [det['pktno'] || ''],
            pktname: [pktname || ''],
            particulars: [particulars],
            pktno_invalid: [false],
            qty: [det['qty'] || 0],
            weight: [det['weight'] || 0],
            rate: [det['rate'] || 0],
            amount: [det['amount'] || 0]
          });
          this.detailsArray.push(detailGroup);
        }
      }
    } catch {
      this.addDetail();
    }
    
    this.showForm.set(true);
    this.focusCustomerName();
  }

  cancelForm() {
    this.showForm.set(false);
    this.detailsArray.clear();
  }

  async saveInvoice() {
    const headerData = this.headerForm.value;
    
    for (let i = 0; i < this.detailsArray.length; i++) {
      const detail = this.detailsArray.at(i);
      if (!detail.get('pktno')?.value) {
        this.formError.set(`Row ${i + 1}: Please select a valid packet`);
        return;
      }
    }
    
    this.saving.set(true);
    this.formError.set(null);
    
    try {
      const headerPayload = {
        billno: parseInt(headerData['billno']),
        billdate: headerData['billdate'],
        customername: headerData['customername'],
        deliverylocation: headerData['deliverylocation'],
        truckno: headerData['truckno'],
        transportation: headerData['transportation'],
        narration: headerData['narration'],
        other1_desp: headerData['other1_desp'],
        other2_desp: headerData['other2_desp'],
        totalpcs: this.totalPcs(),
        totalwgt: this.totalWeight(),
        billamt: this.billAmount(),
        other1_amt: this.other1Amt(),
        other2_amt: this.other2Amt(),
        loadamt: this.loadAmt(),
        gstper: this.gstPer(),
        gstamt: this.gstAmt(),
        nettamount: this.netAmount()
      };
      
      console.log('Raw form data:', headerData);
      console.log('Saving header payload:', JSON.stringify(headerPayload, null, 2));
      
      let headerResult: any;
      if (this.isEditMode()) {
        try {
          headerResult = await this.service.updateSalesHeader(this.currentInvoice().id, headerPayload);
          headerResult = { success: true, record: headerResult };
        } catch (err: any) {
          this.formError.set(err.message || 'Failed to save header');
          return;
        }
      } else {
        try {
          const createdRecord = await this.service.createSalesHeader(headerPayload);
          console.log('Created record:', JSON.stringify(createdRecord, null, 2));
          headerResult = { success: true, record: createdRecord };
        } catch (err: any) {
          this.formError.set(err.message || 'Failed to save header');
          return;
        }
      }
      
      if (!headerResult.success) {
        this.formError.set(headerResult.error || 'Failed to save header');
        return;
      }
      
      const headerId = this.isEditMode() ? this.currentInvoice().id : headerResult.record?.id;
      
await this.service.deleteSalesDetailsByBillno(headerId);
      
      const detailsToSave = [];
      for (let i = 0; i < this.detailsArray.length; i++) {
        const detail = this.detailsArray.at(i).value;
        if (detail['pktno'] && detail['qty']) {
          detailsToSave.push({
            billno: headerId,
            pktno: detail['pktno'],
            srno: i + 1,
            particulars: detail['particulars'] || detail['pktname'] || '',
            qty: parseFloat(detail['qty']) || 0,
            weight: parseFloat(detail['weight']) || 0,
            rate: parseFloat(detail['rate']) || 0,
            amount: parseFloat(detail['amount']) || 0
          });
        }
      }
      
      if (detailsToSave.length > 0) {
        try {
          await this.service.createSalesDetailsBatch(detailsToSave, (done, total) => {
            this.saveProgress.set({ current: done, total });
          });
        } catch (err: any) {
          this.formError.set(err.message || 'Failed to save details');
          this.saveProgress.set(null);
          return;
        }
      }
      
      this.saveProgress.set(null);
      this.toastService.success(`Invoice ${this.isEditMode() ? 'updated' : 'created'} successfully`);
      this.cancelForm();
      await this.loadData();
    } catch (err: any) {
      this.formError.set(err.message || 'Failed to save invoice');
    } finally {
      this.saving.set(false);
    }
  }

  async saveAndPrint() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.toastService.error('Please allow popups to print');
      return;
    }

    printWindow.document.write(`
      <html>
        <head><title>Preparing Invoice...</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">Preparing invoice for print...</body>
      </html>
    `);
    printWindow.document.close();

    this.saving.set(true);
    this.formError.set(null);
    
    const headerData = this.headerForm.value;
    
    for (let i = 0; i < this.detailsArray.length; i++) {
      const detail = this.detailsArray.at(i);
      if (!detail.get('pktno')?.value) {
        this.formError.set(`Row ${i + 1}: Please select a valid packet`);
        printWindow.close();
        this.saving.set(false);
        return;
      }
    }
    
    try {
      const headerPayload = {
        billno: parseInt(headerData['billno']),
        billdate: headerData['billdate'],
        customername: headerData['customername'],
        deliverylocation: headerData['deliverylocation'],
        truckno: headerData['truckno'],
        transportation: headerData['transportation'],
        narration: headerData['narration'],
        other1_desp: headerData['other1_desp'],
        other2_desp: headerData['other2_desp'],
        totalpcs: this.totalPcs(),
        totalwgt: this.totalWeight(),
        billamt: this.billAmount(),
        other1_amt: this.other1Amt(),
        other2_amt: this.other2Amt(),
        loadamt: this.loadAmt(),
        gstper: this.gstPer(),
        gstamt: this.gstAmt(),
        nettamount: this.netAmount()
      };
      
      let headerResult: any;
      let headerId: string;
      
      if (this.isEditMode()) {
        try {
          headerResult = await this.service.updateSalesHeader(this.currentInvoice().id, headerPayload);
          headerResult = { success: true, record: headerResult };
        } catch (err: any) {
          this.formError.set(err.message || 'Failed to save header');
          printWindow.close();
          this.saving.set(false);
          return;
        }
        headerId = this.currentInvoice().id;
      } else {
        try {
          headerResult = await this.service.createSalesHeader(headerPayload);
          headerResult = { success: true, record: headerResult };
        } catch (err: any) {
          this.formError.set(err.message || 'Failed to save header');
          printWindow.close();
          this.saving.set(false);
          return;
        }
        headerId = (headerResult as any).record?.id;
      }
      
      if (!headerResult.success) {
        this.formError.set((headerResult as any).error || 'Failed to save header');
        printWindow.close();
        this.saving.set(false);
        return;
      }

      if (!headerId) {
        this.formError.set('Invoice saved without a valid header id');
        printWindow.close();
        this.saving.set(false);
        return;
      }
      
await this.service.deleteSalesDetailsByBillno(headerId);
      
      const detailsToSave = [];
      for (let i = 0; i < this.detailsArray.length; i++) {
        const detail = this.detailsArray.at(i).value;
        if (detail['pktno'] && detail['qty']) {
          detailsToSave.push({
            billno: headerId,
            pktno: detail['pktno'],
            srno: i + 1,
            particulars: detail['particulars'] || detail['pktname'] || '',
            qty: parseFloat(detail['qty']) || 0,
            weight: parseFloat(detail['weight']) || 0,
            rate: parseFloat(detail['rate']) || 0,
            amount: parseFloat(detail['amount']) || 0
          });
        }
      }
      
      if (detailsToSave.length > 0) {
        try {
          await this.service.createSalesDetailsBatch(detailsToSave, (done, total) => {
            this.saveProgress.set({ current: done, total });
          });
        } catch (err: any) {
          this.formError.set(err.message || 'Failed to save details');
          this.saveProgress.set(null);
          printWindow.close();
          this.saving.set(false);
          return;
        }
      }
      
      this.saveProgress.set(null);
      this.toastService.success(`Invoice ${this.isEditMode() ? 'updated' : 'created'} successfully`);
      
      const printData = {
        billno: headerPayload.billno,
        billdate: headerPayload.billdate,
        customername: headerPayload.customername,
        deliverylocation: headerPayload.deliverylocation,
        truckno: headerPayload.truckno,
        transportation: headerPayload.transportation,
        narration: headerPayload.narration,
        other1_desp: headerPayload.other1_desp,
        other2_desp: headerPayload.other2_desp,
        details: this.detailsArray.controls.map((ctrl, i) => ({
          srno: i + 1,
          pktname: this.getPktname(i),
          qty: ctrl.get('qty')?.value || 0,
          weight: ctrl.get('weight')?.value || 0,
          rate: ctrl.get('rate')?.value || 0,
          amount: ctrl.get('amount')?.value || 0
        })),
        totalpcs: this.totalPcs(),
        totalwgt: this.totalWeight(),
        billamt: this.billAmount(),
        other1_amt: this.other1Amt(),
        other2_amt: this.other2Amt(),
        loadamt: this.loadAmt(),
        gstper: this.gstPer(),
        gstamt: this.gstAmt(),
        nettamount: this.netAmount()
      };
      
      this.cancelForm();
      await this.loadData();
      
      setTimeout(() => {
        this.printInvoice(printData, printWindow);
      }, 100);
    } catch (err: any) {
      this.formError.set(err.message || 'Failed to save invoice');
      printWindow.close();
    } finally {
      this.saving.set(false);
    }
  }

  printInvoice(data: any, printWindow?: Window | null) {
    const targetWindow = printWindow ?? window.open('', '_blank');
    if (!targetWindow) {
      this.toastService.error('Please allow popups to print');
      return;
    }

    const customerLines = String(data.customername || '')
      .split(/\r?\n|,/)
      .map((x: string) => x.trim())
      .filter((x: string) => x);

const itemsHtml = (data.details || []).map((d: any, idx: number) => {
      const weight = Number(d.weight) || 0;
      const qty = Number(d.qty) || 0;
      const amount = Number(d.amount) || 0;
      const pcsperpkt = Number(d.pcsperpkt) || 0;
      let rowAvg = 0;
      if (qty > 0 && weight > 0 && pcsperpkt > 0) {
        rowAvg = (weight / qty) * pcsperpkt;
      } else if (weight > 0 && amount > 0) {
        rowAvg = amount / weight;
      }
      return `
        <tr>
          <td class="c">${idx + 1}</td>
          <td class="r">${this.formatIndianNumber(rowAvg, 2)}</td>
          <td>${this.escapeHtml(d.particulars || d.pktname || '')}</td>
          <td class="r">${this.formatQty(d.qty)}</td>
          <td class="r">${this.formatIndianNumber(d.weight, 2)}</td>
          <td class="r">${this.formatIndianNumber(d.rate, 2)}</td>
          <td class="r">${this.formatIndianNumber(d.amount, 2)}</td>
        </tr>
      `;
    }).join('');

    const totalWgt = Number(data.totalwgt) || 0;
    const billAmt = Number(data.billamt) || 0;
    const netAmt = Number(data.nettamount) || 0;
    const other1Amt = Number(data.other1_amt) || 0;
    const other2Amt = Number(data.other2_amt) || 0;
    const loadAmt = Number(data.loadamt) || 0;
    const gstPer = Number(data.gstper) || 0;
    const gstAmt = Number(data.gstamt) || 0;
    const totalAmtBeforeGst = billAmt + loadAmt + other1Amt + other2Amt;
    const avgRate = totalWgt > 0 ? netAmt / totalWgt : 0;
    const totalBandl = Number(data.totalbandl) || Number(data.totalpcs) || 0;
    const minRows = 16;
    const blankRows = Math.max(0, minRows - (data.details?.length || 0));
    const blankRowsHtml = Array.from({ length: blankRows }).map(() => `
      <tr class="blank-row">
        <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      </tr>
    `).join('');

    targetWindow.document.open();
    targetWindow.document.write(`
      <html>
        <head>
          <title>Invoice Print</title>
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
            .items th:nth-child(1), .items td:nth-child(1) { width: 3%; }
            .items th:nth-child(2), .items td:nth-child(2) { width: 7%; }
            .items th:nth-child(3), .items td:nth-child(3) { width: 48%; }
            .items th:nth-child(4), .items td:nth-child(4) { width: 9%; }
            .items th:nth-child(5), .items td:nth-child(5) { width: 9%; }
            .items th:nth-child(6), .items td:nth-child(6) { width: 11%; }
            .items th:nth-child(7), .items td:nth-child(7) { width: 13%; }
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
        </head>
        <body>
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
                      <div class="name"><strong>${this.escapeHtml(customerLines[0] || data.customername || '')}</strong></div>
                      ${(customerLines.slice(1).map((line: string) => `<div class="line">${this.escapeHtml(line)}</div>`).join('')) || '<div class="line">&nbsp;</div>'}
                    </div>
                    <div class="line" style="margin-top: 4px;"><strong>Delivery :</strong> ${this.escapeHtml(data.deliverylocation || '')}</div>
                  </div>
                </td>
                <td style="width:38%" class="right-box">
                  <table>
                    <tr><td colspan="2" class="r"><strong>Date : ${this.escapeHtml(this.formatPrintDate(data.billdate))}</strong></td></tr>
                    <tr><td style="width:45%">Truck No.</td><td><strong>${this.escapeHtml(data.truckno || '')}</strong></td></tr>
                    <tr><td>Transport :</td><td>${this.escapeHtml(data.transportation || '')}</td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <table class="items">
              <thead>
                <tr>
                  <th>no</th>
                  <th>Avg.</th>
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
                <td class="label"></td>
                <td class="label"></td>
                <td class="label"></td>
                <td class="label"></td>
                <td class="label">Total  Pcs</td>
                <td class="value">${this.formatQty(data.totalpcs)}</td>
                <td class="label">Total  Kgs</td>
                <td class="value">${this.formatIndianNumber(totalWgt, 2)}</td>
                <td class="value">${this.formatIndianNumber(billAmt, 2)}</td>
              </tr>
            </table>

            <table class="bottom-wrap">
              <tr>
                <td style="width:62%" class="left-bottom">
                  <div class="narration"><strong>Narration : ${this.escapeHtml(data.narration || '')}</strong></div>
                  <div class="rupees"><strong>Rs:</strong> ${this.escapeHtml(this.amountInWords(netAmt).toLowerCase())} only</div>
                </td>
                <td style="width:38%" class="right-bottom">
                  <table>
                    <tr><td class="slabel">Load Amt :</td><td class="sval">${this.formatIndianNumber(loadAmt, 2)}</td></tr>
                    <tr><td class="slabel">${this.escapeHtml(data.other1_desp || 'Other 1')} :</td><td class="sval">${this.formatIndianNumber(other1Amt, 2)}</td></tr>
                    <tr><td class="slabel">${this.escapeHtml(data.other2_desp || 'Other 2')} :</td><td class="sval">${this.formatIndianNumber(other2Amt, 2)}</td></tr>
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
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    targetWindow.document.close();
  }

  openDeleteModal(inv: any) {
    this.invoiceToDelete.set(inv);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.invoiceToDelete.set(null);
  }

  async confirmDelete() {
    if (!this.invoiceToDelete()) return;
    
    this.saving.set(true);
    
    try {
      await this.service.deleteSalesDetailsByBillno(this.invoiceToDelete().id);
      const success = await this.service.deleteSalesHeader(this.invoiceToDelete().id);
      
      if (success) {
        this.toastService.success('Invoice deleted successfully');
        this.closeDeleteModal();
        await this.loadData();
      } else {
        this.toastService.error('Failed to delete invoice');
      }
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to delete invoice');
    } finally {
      this.saving.set(false);
    }
  }

  async printInvoiceFromList(inv: any) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.toastService.error('Please allow popups to print');
      return;
    }

    try {
      const details = await this.service.getSalesDetails(inv.id);
      
      const printData = {
        ...inv,
        details: details
      };
      
      this.printInvoice(printData, printWindow);
    } catch (err: any) {
      printWindow.close();
      this.toastService.error('Failed to load invoice details');
    }
  }

  toggleMasterMenu() { this.showMasterMenu = !this.showMasterMenu; }
  toggleGcsheetMenu() { this.showGcsheetMenu = !this.showGcsheetMenu; }
}

