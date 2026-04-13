import { Component, inject, signal, computed, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { GcsheetPktmasterService } from '../../services/gcsheet-pktmaster.service';
import { ToastService } from '../../shared/toast/toast.service';
import { TabAsEnterDirective } from '../../shared/directives/tab-as-enter.directive';

@Component({
  selector: 'app-gcsheet-pktmaster',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TabAsEnterDirective],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" (click)="goToDashboard()" style="cursor: pointer;">
          <i class="bi bi-shield-check me-2"></i>
          SuperAdmin
        </a>
        <button class="navbar-toggler" type="button" (click)="isCollapsed = !isCollapsed">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" [class.show]="!isCollapsed" (click)="isCollapsed = true">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" (click)="goToDashboard()" style="cursor: pointer;">
                <i class="bi bi-speedometer2 me-1"></i> Dashboard
              </a>
            </li>
            
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" style="cursor: pointer;" (click)="toggleMasterMenu()">
                <i class="bi bi-collection me-1"></i> Master
              </a>
              <ul class="dropdown-menu" [class.show]="showMasterMenu">
                <li>
                  <a class="dropdown-item" (click)="navigateToUsers()">
                    <i class="bi bi-people me-2"></i>User Master
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" (click)="navigateToDmsitem()">
                    <i class="bi bi-box-seam me-2"></i>Item Master
                  </a>
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" style="cursor: pointer;" (click)="toggleGcsheetMenu()">
                <i class="bi bi-grid-3x3-gap me-1"></i> Gcsheet
              </a>
              <ul class="dropdown-menu" [class.show]="showGcsheetMenu">
                <li>
                  <a class="dropdown-item" (click)="navigateToGcsheetCompany()">
                    <i class="bi bi-building me-2"></i>Company
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" (click)="navigateToGcsheetFit()">
                    <i class="bi bi-rulers me-2"></i>Fit
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" (click)="navigateToGcsheetMm()">
                    <i class="bi bi-box me-2"></i>MM
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" (click)="navigateToGcsheetGrade()">
                    <i class="bi bi-bar-chart me-2"></i>Grade
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" (click)="navigateToGcsheetItem()">
                    <i class="bi bi-box-seam me-2"></i>Item
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" (click)="navigateToGcsheetNali()">
                    <i class="bi bi-geo-alt me-2"></i>Nali
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item active" style="color: #0d6efd; font-weight: 500;">
                    <i class="bi bi-collection me-2"></i>Packet Master
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" (click)="navigateToGcsheetSaleinv()">
                    <i class="bi bi-receipt me-2"></i>Sale Invoice
                  </a>
                </li>
              </ul>
            </li>
            
            <li class="nav-item">
              <a class="nav-link" (click)="navigateToSettings()" style="cursor: pointer;">
                <i class="bi bi-gear me-1"></i> Settings
              </a>
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

    <div class="container mt-5">
      <div class="card">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 class="mb-0"><i class="bi bi-box-seam me-2"></i>GCSheet Packet Master</h4>
          <div class="d-flex gap-2">
            <button class="btn btn-light btn-sm" (click)="setAllActive()" [disabled]="loading()">
              <i class="bi bi-check-circle me-1"></i>Set All Active
            </button>
            <button class="btn btn-light btn-sm" (click)="exportToExcel()" title="Export to Excel" [disabled]="isImporting()">
              <i class="bi bi-file-earmark-excel me-1"></i>Export
            </button>
            <label class="btn btn-light btn-sm mb-0" title="Import from Excel" [class.disabled]="isImporting()">
              @if (isImporting()) {
                <span class="spinner-border spinner-border-sm me-1"></span>
                Importing...
              } @else {
                <i class="bi bi-file-earmark-arrow-up me-1"></i>Import
              }
              <input type="file" accept=".xlsx,.xls,.csv" (change)="importFromExcel($event)" [disabled]="isImporting()" hidden>
            </label>
            <button class="btn btn-light btn-sm" (click)="openAddModal()">
              <i class="bi bi-plus-circle me-1"></i>Add Packet
            </button>
          </div>
        </div>
        
        @if (isImporting()) {
          <div class="card-body pb-0">
            <div class="progress mb-3" style="height: 20px;">
              <div class="progress-bar progress-bar-striped progress-bar-animated" 
                   [style.width.%]="importProgress()" 
                   role="progressbar">
                {{ importProgress() }}%
              </div>
            </div>
          </div>
        }
        
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by packet name..." 
                  [ngModel]="searchTerm()"
                  (ngModelChange)="onSearchChange($event)"
                >
              </div>
            </div>
            <div class="col-md-4">
              <button class="btn btn-outline-secondary" (click)="searchTerm.set('')">
                <i class="bi bi-x-circle me-1"></i>Clear Filter
              </button>
            </div>
          </div>

          @if (loading()) {
            <div class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2">Loading packet records...</p>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="table table-hover table-sm">
                <thead class="table-light">
                  <tr>
                    <th class="sortable" (click)="sortBy('pktno')">
                      Pkt No <i class="bi" [class]="getSortIcon('pktno')"></i>
                    </th>
                    <th class="sortable" (click)="sortBy('pktname')">
                      Packet Name <i class="bi" [class]="getSortIcon('pktname')"></i>
                    </th>
                    <th>MM</th>
                    <th>CMP</th>
                    <th>FIT</th>
                    <th>NALI</th>
                    <th>Grade</th>
                    <th>Item</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (pkt of filteredPackets(); track pkt.id) {
                    <tr>
                      <td>{{ pkt['pktno'] }}</td>
                      <td>{{ pkt['pktname'] }}</td>
                      <td>{{ getDropdownName(pkt['mmno'], mmList(), 'mstmm') }}</td>
                      <td>{{ getDropdownName(pkt['cmpno'], cmpList(), 'mstcmp') }}</td>
                      <td>{{ getDropdownName(pkt['fitno'], fitList(), 'mstfit') }}</td>
                      <td>{{ getDropdownName(pkt['nalino'], naliList(), 'mstnali') }}</td>
                      <td>{{ getDropdownName(pkt['gradeno'], gradeList(), 'mstgrade') }}</td>
                      <td>{{ getDropdownName(pkt['itemno'], itemList(), 'mstitem') }}</td>
                      <td>
                        <span class="badge" [class.bg-success]="pkt['status'] === 'Active'" [class.bg-secondary]="pkt['status'] !== 'Active'">
                          {{ pkt['status'] || 'Active' }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary me-1" (click)="openEditModal(pkt)">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" (click)="openDeleteModal(pkt)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="10" class="text-center py-4">No packet records found</td>
                    </tr>
                  }
                </tbody>
              </table>
              
              @if (totalItems() > pageSize()) {
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <div class="text-muted small">
                    Showing {{ (currentPage() - 1) * pageSize() + 1 }} to 
                    {{ currentPage() * pageSize() > totalItems() ? totalItems() : currentPage() * pageSize() }} of {{ totalItems() }} records
                  </div>
                  <div class="d-flex gap-2 align-items-center">
                    <select class="form-select form-select-sm" style="width: auto;" 
                            [ngModel]="pageSize()" (ngModelChange)="onPageSizeChange($event)">
                      <option [value]="10">10 / page</option>
                      <option [value]="25">25 / page</option>
                      <option [value]="50">50 / page</option>
                      <option [value]="100">100 / page</option>
                    </select>
                    <button class="btn btn-sm btn-outline-secondary" (click)="goToPage(1)" [disabled]="currentPage() === 1">
                      <i class="bi bi-chevron-double-left"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 1">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                    <span class="px-2">Page {{ currentPage() }} of {{ totalPages() }}</span>
                    <button class="btn btn-sm btn-outline-secondary" (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() >= totalPages()">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" (click)="goToPage(totalPages())" [disabled]="currentPage() >= totalPages()">
                      <i class="bi bi-chevron-double-right"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>

    @if (showModal()) {
      <div class="modal show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditMode() ? 'Edit Packet' : 'Add New Packet' }}</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            
            <div class="modal-body">
              @if (formError()) {
                <div class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                  {{ formError() }}
                  <button type="button" class="btn-close" (click)="formError.set(null)"></button>
                </div>
              }
              
              <form [formGroup]="packetForm" (appTabAsEnter)="savePacket()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Packet No</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      formControlName="pktno"
                      readonly
                    >
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Packet Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      formControlName="pktname"
                    >
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3 position-relative">
                    <label class="form-label">MM</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder=" "
                      [value]="mmQuery()"
                      (input)="onMmSearch($any($event.target).value)"
                      (keydown.arrowdown)="moveMmSelection(1, $event)"
                      (keydown.arrowup)="moveMmSelection(-1, $event)"
                      (keydown.enter)="onMmEnter($event)"
                      (focus)="openMmDropdown()"
                      (blur)="closeMmDropdownDelayed()"
                      (click)="$event.stopPropagation()"
                      [class.is-invalid]="mmInvalid()"
                      #mmSelect
                    >
                    <label>MM</label>
                    @if (showMmDropdown() && filteredMmList().length > 0) {
                      <ul class="list-group autocomplete-dropdown">
                        @for (item of filteredMmList(); track item.id; let i = $index) {
                          <li
                            class="list-group-item list-group-item-action"
                            [class.top-match]="i === highlightedMmIndex()"
                            (mousedown)="selectMm(item.id, item['name'])"
                          >
                            {{ item['name'] }}
                          </li>
                        }
                      </ul>
                    }
                  </div>
                  
                  <div class="col-md-4 mb-3 position-relative">
                    <label class="form-label">CMP</label>
                    <input type="text" class="form-control" placeholder=" " [value]="cmpQuery()"
                      (input)="onCmpSearch($any($event.target).value)" (keydown.arrowdown)="moveCmpSelection(1, $event)"
                      (keydown.arrowup)="moveCmpSelection(-1, $event)" (keydown.enter)="onCmpEnter($event)"
                      (focus)="openCmpDropdown()" (blur)="closeCmpDropdownDelayed()" (click)="$event.stopPropagation()"
                      [class.is-invalid]="cmpInvalid()" #cmpSelect>
                    <label>CMP</label>
                    @if (showCmpDropdown() && filteredCmpList().length > 0) {
                      <ul class="list-group autocomplete-dropdown">
                        @for (item of filteredCmpList(); track item.id; let i = $index) {
                          <li class="list-group-item list-group-item-action" [class.top-match]="i === highlightedCmpIndex()"
                            (mousedown)="selectCmp(item.id, item['name'])">{{ item['name'] }}</li>
                        }
                      </ul>
                    }
                  </div>
                  
                  <div class="col-md-4 mb-3 position-relative">
                    <label class="form-label">FIT</label>
                    <input type="text" class="form-control" placeholder=" " [value]="fitQuery()"
                      (input)="onFitSearch($any($event.target).value)" (keydown.arrowdown)="moveFitSelection(1, $event)"
                      (keydown.arrowup)="moveFitSelection(-1, $event)" (keydown.enter)="onFitEnter($event)"
                      (focus)="openFitDropdown()" (blur)="closeFitDropdownDelayed()" (click)="$event.stopPropagation()"
                      [class.is-invalid]="fitInvalid()" #fitSelect>
                    <label>FIT</label>
                    @if (showFitDropdown() && filteredFitList().length > 0) {
                      <ul class="list-group autocomplete-dropdown">
                        @for (item of filteredFitList(); track item.id; let i = $index) {
                          <li class="list-group-item list-group-item-action" [class.top-match]="i === highlightedFitIndex()"
                            (mousedown)="selectFit(item.id, item['name'])">{{ item['name'] }}</li>
                        }
                      </ul>
                    }
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3 position-relative">
                    <label class="form-label">NALI</label>
                    <input type="text" class="form-control" placeholder=" " [value]="naliQuery()"
                      (input)="onNaliSearch($any($event.target).value)" (keydown.arrowdown)="moveNaliSelection(1, $event)"
                      (keydown.arrowup)="moveNaliSelection(-1, $event)" (keydown.enter)="onNaliEnter($event)"
                      (focus)="openNaliDropdown()" (blur)="closeNaliDropdownDelayed()" (click)="$event.stopPropagation()"
                      [class.is-invalid]="naliInvalid()" #naliSelect>
                    <label>NALI</label>
                    @if (showNaliDropdown() && filteredNaliList().length > 0) {
                      <ul class="list-group autocomplete-dropdown">
                        @for (item of filteredNaliList(); track item.id; let i = $index) {
                          <li class="list-group-item list-group-item-action" [class.top-match]="i === highlightedNaliIndex()"
                            (mousedown)="selectNali(item.id, item['name'])">{{ item['name'] }}</li>
                        }
                      </ul>
                    }
                  </div>
                  
                  <div class="col-md-4 mb-3 position-relative">
                    <label class="form-label">Grade</label>
                    <input type="text" class="form-control" placeholder=" " [value]="gradeQuery()"
                      (input)="onGradeSearch($any($event.target).value)" (keydown.arrowdown)="moveGradeSelection(1, $event)"
                      (keydown.arrowup)="moveGradeSelection(-1, $event)" (keydown.enter)="onGradeEnter($event)"
                      (focus)="openGradeDropdown()" (blur)="closeGradeDropdownDelayed()" (click)="$event.stopPropagation()"
                      [class.is-invalid]="gradeInvalid()" #gradeSelect>
                    <label>Grade</label>
                    @if (showGradeDropdown() && filteredGradeList().length > 0) {
                      <ul class="list-group autocomplete-dropdown">
                        @for (item of filteredGradeList(); track item.id; let i = $index) {
                          <li class="list-group-item list-group-item-action" [class.top-match]="i === highlightedGradeIndex()"
                            (mousedown)="selectGrade(item.id, item['name'])">{{ item['name'] }}</li>
                        }
                      </ul>
                    }
                  </div>
                  
                  <div class="col-md-4 mb-3 position-relative">
                    <label class="form-label">Item</label>
                    <input type="text" class="form-control" placeholder=" " [value]="itemQuery()"
                      (input)="onItemSearch($any($event.target).value)" (keydown.arrowdown)="moveItemSelection(1, $event)"
                      (keydown.arrowup)="moveItemSelection(-1, $event)" (keydown.enter)="onItemEnter($event)"
                      (focus)="openItemDropdown()" (blur)="closeItemDropdownDelayed()" (click)="$event.stopPropagation()"
                      [class.is-invalid]="itemInvalid()" #itemSelect>
                    <label>Item</label>
                    @if (showItemDropdown() && filteredItemList().length > 0) {
                      <ul class="list-group autocomplete-dropdown">
                        @for (item of filteredItemList(); track item.id; let i = $index) {
                          <li class="list-group-item list-group-item-action" [class.top-match]="i === highlightedItemIndex()"
                            (mousedown)="selectItem(item.id, item['name'])">{{ item['name'] }}</li>
                        }
                      </ul>
                    }
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Status</label>
                    <select class="form-select" formControlName="status">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button 
                type="button" 
                class="btn btn-primary" 
                (click)="savePacket()" 
                [disabled]="packetForm.invalid || saving()"
              >
                @if (saving()) {
                  <span class="spinner-border spinner-border-sm me-1"></span>
                }
                {{ isEditMode() ? 'Update' : 'Create' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    @if (showDeleteModal()) {
      <div class="modal show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Delete</h5>
              <button type="button" class="btn-close" (click)="closeDeleteModal()"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete packet: <strong>{{ packetToDelete()?.['pktname'] }}</strong>?</p>
              <p class="text-danger">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeDeleteModal()">Cancel</button>
              <button type="button" class="btn btn-danger" (click)="confirmDelete()" [disabled]="saving()">
                @if (saving()) {
                  <span class="spinner-border spinner-border-sm me-1"></span>
                }
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .navbar { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
    .card { border-radius: 1rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }
    .table { margin-bottom: 0; }
    .table-sm td, .table-sm th { padding: 0.5rem; }
    .form-label { font-weight: 500; }
    input[readonly] {
      background-color: #e9ecef;
      cursor: not-allowed;
    }
    .nav-item.dropdown { position: relative; }
    .dropdown-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
      min-width: 10rem;
      padding: 0.5rem 0;
      margin: 0.125rem 0 0;
      background-color: #fff;
      border-radius: 0.5rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      list-style: none;
    }
    .dropdown-menu.show { display: block; }
    .dropdown-item {
      display: block;
      width: 100%;
      padding: 0.625rem 1.5rem;
      clear: both;
      font-weight: 400;
      color: #212529;
      text-align: inherit;
      white-space: nowrap;
      background-color: transparent;
      border: 0;
      cursor: pointer;
    }
    .dropdown-item:hover { background-color: #f8f9fa; color: #0d6efd; }
    .dropdown-divider {
      height: 0;
      margin: 0.5rem 0;
      overflow: hidden;
      border-top: 1px solid #dee2e6;
    }
    .nav-link { cursor: pointer; }
    .sortable { cursor: pointer; user-select: none; }
    .sortable:hover { color: #0d6efd; }
    .sortable .bi { font-size: 0.75rem; margin-left: 4px; }
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
  `]
})
export class GcsheetPktmasterComponent implements OnInit {
  private pktmasterService = inject(GcsheetPktmasterService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected toastService = inject(ToastService);

  @ViewChild('mmSelect') mmSelect!: ElementRef<HTMLInputElement>;
  @ViewChild('cmpSelect') cmpSelect!: ElementRef<HTMLInputElement>;
  @ViewChild('fitSelect') fitSelect!: ElementRef<HTMLInputElement>;
  @ViewChild('naliSelect') naliSelect!: ElementRef<HTMLInputElement>;
  @ViewChild('gradeSelect') gradeSelect!: ElementRef<HTMLInputElement>;
  @ViewChild('itemSelect') itemSelect!: ElementRef<HTMLInputElement>;

  packets = signal<any[]>([]);
  mmList = signal<any[]>([]);
  cmpList = signal<any[]>([]);
  fitList = signal<any[]>([]);
  naliList = signal<any[]>([]);
  gradeList = signal<any[]>([]);
  itemList = signal<any[]>([]);

  mmQuery = signal('');
  showMmDropdown = signal(false);
  highlightedMmIndex = signal(0);
  selectedMmId = signal<string | null>(null);

  cmpQuery = signal('');
  showCmpDropdown = signal(false);
  highlightedCmpIndex = signal(0);
  selectedCmpId = signal<string | null>(null);

  fitQuery = signal('');
  showFitDropdown = signal(false);
  highlightedFitIndex = signal(0);
  selectedFitId = signal<string | null>(null);

  naliQuery = signal('');
  showNaliDropdown = signal(false);
  highlightedNaliIndex = signal(0);
  selectedNaliId = signal<string | null>(null);

  gradeQuery = signal('');
  showGradeDropdown = signal(false);
  highlightedGradeIndex = signal(0);
  selectedGradeId = signal<string | null>(null);

  itemQuery = signal('');
  showItemDropdown = signal(false);
  highlightedItemIndex = signal(0);
  selectedItemId = signal<string | null>(null);

  mmInvalid = signal(false);
  cmpInvalid = signal(false);
  fitInvalid = signal(false);
  naliInvalid = signal(false);
  gradeInvalid = signal(false);
  itemInvalid = signal(false);

  loading = signal(false);
  saving = signal(false);
  
  searchTerm = signal('');
  
  sortField = signal<string>('pktname');
  sortDirection = signal<'asc' | 'desc'>('asc');
  pageSize = signal(50);
  currentPage = signal(1);
  totalFilteredItems = signal(0);
  totalItems = signal(0);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
  paginatedData = signal<any[]>([]);
  
  private searchDebounce: any;
  
  showModal = signal(false);
  showDeleteModal = signal(false);
  isEditMode = signal(false);
  currentPacket = signal<any>(null);
  packetToDelete = signal<any>(null);
  
  formError = signal<string | null>(null);
  
  isCollapsed = true;
  showMasterMenu = false;
  showGcsheetMenu = false;
  
  importProgress = signal(0);
  isImporting = signal(false);
  
  sortColumn = signal<string>('pktname');

  filteredMmList = computed(() => {
    const q = this.mmQuery().trim().toLowerCase();
    const filtered = this.mmList().filter(m => (m['name'] || '').toLowerCase().includes(q));
    const sorted = filtered.sort((a, b) => (a['name'] || '').toLowerCase().localeCompare((b['name'] || '').toLowerCase()));
    return sorted.slice(0, 30);
  });

  filteredCmpList = computed(() => {
    const q = this.cmpQuery().trim().toLowerCase();
    const filtered = this.cmpList().filter(c => (c['name'] || '').toLowerCase().includes(q));
    const sorted = filtered.sort((a, b) => (a['name'] || '').toLowerCase().localeCompare((b['name'] || '').toLowerCase()));
    return sorted.slice(0, 30);
  });

  filteredFitList = computed(() => {
    const q = this.fitQuery().trim().toLowerCase();
    const filtered = this.fitList().filter(f => (f['name'] || '').toLowerCase().includes(q));
    const sorted = filtered.sort((a, b) => (a['name'] || '').toLowerCase().localeCompare((b['name'] || '').toLowerCase()));
    return sorted.slice(0, 30);
  });

  filteredNaliList = computed(() => {
    const q = this.naliQuery().trim().toLowerCase();
    const filtered = this.naliList().filter(n => (n['name'] || '').toLowerCase().includes(q));
    const sorted = filtered.sort((a, b) => (a['name'] || '').toLowerCase().localeCompare((b['name'] || '').toLowerCase()));
    return sorted.slice(0, 30);
  });

  filteredGradeList = computed(() => {
    const q = this.gradeQuery().trim().toLowerCase();
    const filtered = this.gradeList().filter(g => (g['name'] || '').toLowerCase().includes(q));
    const sorted = filtered.sort((a, b) => (a['name'] || '').toLowerCase().localeCompare((b['name'] || '').toLowerCase()));
    return sorted.slice(0, 30);
  });

  filteredItemList = computed(() => {
    const q = this.itemQuery().trim().toLowerCase();
    const filtered = this.itemList().filter(i => (i['name'] || '').toLowerCase().includes(q));
    const sorted = filtered.sort((a, b) => (a['name'] || '').toLowerCase().localeCompare((b['name'] || '').toLowerCase()));
    return sorted.slice(0, 30);
  });

  packetForm: FormGroup = this.fb.group({
    pktno: [''],
    pktname: [''],
    mmno: ['', Validators.required],
    cmpno: ['', Validators.required],
    fitno: ['', Validators.required],
    nalino: ['', Validators.required],
    gradeno: [''],
    itemno: [''],
    status: ['Active']
  });

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToDmsitem(): void {
    this.router.navigate(['/dmsitem']);
  }

  navigateToGcsheetPktmaster(): void {
    this.router.navigate(['/gcsheet-pktmaster']);
  }

  navigateToGcsheetSaleinv(): void {
    this.router.navigate(['/gcsheet-saleinv']);
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

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }

  toggleMasterMenu(): void {
    this.showMasterMenu = !this.showMasterMenu;
  }

  toggleGcsheetMenu(): void {
    this.showGcsheetMenu = !this.showGcsheetMenu;
  }

  sortBy(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  getSortIcon(column: string): string {
    if (this.sortColumn() !== column) {
      return 'bi-chevron-expand';
    }
    return this.sortDirection() === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  filteredPacketsWithoutPaging = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();
    
    let filtered = this.packets().filter(pkt => {
      const matchesSearch = !term || 
        (pkt['pktname'] as string)?.toLowerCase().includes(term) ||
        (pkt['pktno'] && pkt['pktno'].toString().includes(term));
      
      return matchesSearch;
    });
    
    return filtered.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];
      
      if (valA == null) valA = '';
      if (valB == null) valB = '';
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  filteredPackets = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredPacketsWithoutPaging().slice(start, end);
  });

  ngOnInit() {
    this.loadAllData();
  }

  async loadAllData() {
    await Promise.all([
      this.loadPackets(),
      this.loadDropdowns()
    ]);
  }

  async loadPackets() {
    this.loading.set(true);
    try {
      const result = await this.pktmasterService.getPaginated(
        this.currentPage(),
        this.pageSize(),
        this.searchTerm(),
        this.sortField(),
        this.sortDirection()
      );
      this.packets.set(result.items);
      this.totalFilteredItems.set(result.totalItems);
      this.totalItems.set(result.totalItems);
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to load packet records');
    } finally {
      this.loading.set(false);
    }
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.currentPage.set(1);
      this.loadPackets();
    }, 300);
  }

  toggleSort(field: string): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.loadPackets();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadPackets();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadPackets();
  }

  async loadDropdowns() {
    try {
      const pb = (await import('../../services/pocketbase.service')).PocketbaseService.getInstance().getClient();
      
      const [mmRecords, cmpRecords, fitRecords, naliRecords, gradeRecords, itemRecords] = await Promise.all([
      pb.collection('egcsheet1_mstmm').getFullList({ requestKey: null }).catch(() => []),
      pb.collection('egcsheet1_mstcmp').getFullList({ requestKey: null }).catch(() => []),
      pb.collection('egcsheet1_mstfit').getFullList({ requestKey: null }).catch(() => []),
      pb.collection('egcsheet1_mstnali').getFullList({ requestKey: null }).catch(() => []),
      pb.collection('egcsheet1_mstgrade').getFullList({ requestKey: null }).catch(() => []),
      pb.collection('egcsheet1_mstitem').getFullList({ requestKey: null }).catch(() => [])
      ]);

      this.mmList.set(mmRecords);
      this.cmpList.set(cmpRecords);
      this.fitList.set(fitRecords);
      this.naliList.set(naliRecords);
      this.gradeList.set(gradeRecords);
      this.itemList.set(itemRecords);
    } catch (err: any) {
      console.error('Failed to load dropdowns:', err);
    }
  }

  onMmSearch(value: string) {
    this.mmQuery.set(value);
    this.showMmDropdown.set(true);
    this.highlightedMmIndex.set(0);
    this.selectedMmId.set(null);
    this.packetForm.patchValue({ mmno: '' });
    this.mmInvalid.set(true);
    this.updatePktname();
  }

  onMmEnter(event: Event) {
    event.preventDefault();
    const list = this.filteredMmList();
    const idx = Math.min(Math.max(this.highlightedMmIndex(), 0), list.length - 1);
    const selected = list[idx];
    if (!selected) return;
    this.selectMm(selected.id, selected['name']);
  }

  moveMmSelection(step: number, event: Event) {
    event.preventDefault();
    const list = this.filteredMmList();
    if (!list.length) return;
    this.showMmDropdown.set(true);
    const next = this.highlightedMmIndex() + step;
    const clamped = Math.max(0, Math.min(list.length - 1, next));
    this.highlightedMmIndex.set(clamped);
  }

  selectMm(id: string, name: string) {
    this.selectedMmId.set(id);
    this.mmQuery.set(name);
    this.packetForm.patchValue({ mmno: id });
    this.showMmDropdown.set(false);
    this.highlightedMmIndex.set(0);
    this.mmInvalid.set(false);
    this.updatePktname();
  }

  openMmDropdown() {
    this.showMmDropdown.set(true);
    this.highlightedMmIndex.set(0);
  }

  closeMmDropdownDelayed() {
    setTimeout(() => this.showMmDropdown.set(false), 120);
  }

  onCmpSearch(value: string) { this.cmpQuery.set(value); this.showCmpDropdown.set(true); this.highlightedCmpIndex.set(0); this.selectedCmpId.set(null); this.packetForm.patchValue({ cmpno: '' }); this.cmpInvalid.set(true); this.updatePktname(); }
  onCmpEnter(event: Event) { event.preventDefault(); const list = this.filteredCmpList(); const idx = Math.min(Math.max(this.highlightedCmpIndex(), 0), list.length - 1); const selected = list[idx]; if (!selected) return; this.selectCmp(selected.id, selected['name']); }
  moveCmpSelection(step: number, event: Event) { event.preventDefault(); const list = this.filteredCmpList(); if (!list.length) return; this.showCmpDropdown.set(true); const next = this.highlightedCmpIndex() + step; this.highlightedCmpIndex.set(Math.max(0, Math.min(list.length - 1, next))); }
  selectCmp(id: string, name: string) { this.selectedCmpId.set(id); this.cmpQuery.set(name); this.packetForm.patchValue({ cmpno: id }); this.showCmpDropdown.set(false); this.highlightedCmpIndex.set(0); this.cmpInvalid.set(false); this.updatePktname(); }
  openCmpDropdown() { this.showCmpDropdown.set(true); this.highlightedCmpIndex.set(0); }
  closeCmpDropdownDelayed() { setTimeout(() => this.showCmpDropdown.set(false), 120); }

  onFitSearch(value: string) { this.fitQuery.set(value); this.showFitDropdown.set(true); this.highlightedFitIndex.set(0); this.selectedFitId.set(null); this.packetForm.patchValue({ fitno: '' }); this.fitInvalid.set(true); this.updatePktname(); }
  onFitEnter(event: Event) { event.preventDefault(); const list = this.filteredFitList(); const idx = Math.min(Math.max(this.highlightedFitIndex(), 0), list.length - 1); const selected = list[idx]; if (!selected) return; this.selectFit(selected.id, selected['name']); }
  moveFitSelection(step: number, event: Event) { event.preventDefault(); const list = this.filteredFitList(); if (!list.length) return; this.showFitDropdown.set(true); const next = this.highlightedFitIndex() + step; this.highlightedFitIndex.set(Math.max(0, Math.min(list.length - 1, next))); }
  selectFit(id: string, name: string) { this.selectedFitId.set(id); this.fitQuery.set(name); this.packetForm.patchValue({ fitno: id }); this.showFitDropdown.set(false); this.highlightedFitIndex.set(0); this.fitInvalid.set(false); this.updatePktname(); }
  openFitDropdown() { this.showFitDropdown.set(true); this.highlightedFitIndex.set(0); }
  closeFitDropdownDelayed() { setTimeout(() => this.showFitDropdown.set(false), 120); }

  onNaliSearch(value: string) { this.naliQuery.set(value); this.showNaliDropdown.set(true); this.highlightedNaliIndex.set(0); this.selectedNaliId.set(null); this.packetForm.patchValue({ nalino: '' }); this.naliInvalid.set(true); this.updatePktname(); }
  onNaliEnter(event: Event) { event.preventDefault(); const list = this.filteredNaliList(); const idx = Math.min(Math.max(this.highlightedNaliIndex(), 0), list.length - 1); const selected = list[idx]; if (!selected) return; this.selectNali(selected.id, selected['name']); }
  moveNaliSelection(step: number, event: Event) { event.preventDefault(); const list = this.filteredNaliList(); if (!list.length) return; this.showNaliDropdown.set(true); const next = this.highlightedNaliIndex() + step; this.highlightedNaliIndex.set(Math.max(0, Math.min(list.length - 1, next))); }
  selectNali(id: string, name: string) { this.selectedNaliId.set(id); this.naliQuery.set(name); this.packetForm.patchValue({ nalino: id }); this.showNaliDropdown.set(false); this.highlightedNaliIndex.set(0); this.naliInvalid.set(false); this.updatePktname(); }
  openNaliDropdown() { this.showNaliDropdown.set(true); this.highlightedNaliIndex.set(0); }
  closeNaliDropdownDelayed() { setTimeout(() => this.showNaliDropdown.set(false), 120); }

  onGradeSearch(value: string) { this.gradeQuery.set(value); this.showGradeDropdown.set(true); this.highlightedGradeIndex.set(0); this.selectedGradeId.set(null); this.packetForm.patchValue({ gradeno: '' }); this.gradeInvalid.set(true); this.updatePktname(); }
  onGradeEnter(event: Event) { event.preventDefault(); const list = this.filteredGradeList(); const idx = Math.min(Math.max(this.highlightedGradeIndex(), 0), list.length - 1); const selected = list[idx]; if (!selected) return; this.selectGrade(selected.id, selected['name']); }
  moveGradeSelection(step: number, event: Event) { event.preventDefault(); const list = this.filteredGradeList(); if (!list.length) return; this.showGradeDropdown.set(true); const next = this.highlightedGradeIndex() + step; this.highlightedGradeIndex.set(Math.max(0, Math.min(list.length - 1, next))); }
  selectGrade(id: string, name: string) { this.selectedGradeId.set(id); this.gradeQuery.set(name); this.packetForm.patchValue({ gradeno: id }); this.showGradeDropdown.set(false); this.highlightedGradeIndex.set(0); this.gradeInvalid.set(false); this.updatePktname(); }
  openGradeDropdown() { this.showGradeDropdown.set(true); this.highlightedGradeIndex.set(0); }
  closeGradeDropdownDelayed() { setTimeout(() => this.showGradeDropdown.set(false), 120); }

  onItemSearch(value: string) { this.itemQuery.set(value); this.showItemDropdown.set(true); this.highlightedItemIndex.set(0); this.selectedItemId.set(null); this.packetForm.patchValue({ itemno: '' }); this.itemInvalid.set(true); this.updatePktname(); }
  onItemEnter(event: Event) { event.preventDefault(); const list = this.filteredItemList(); const idx = Math.min(Math.max(this.highlightedItemIndex(), 0), list.length - 1); const selected = list[idx]; if (!selected) return; this.selectItem(selected.id, selected['name']); }
  moveItemSelection(step: number, event: Event) { event.preventDefault(); const list = this.filteredItemList(); if (!list.length) return; this.showItemDropdown.set(true); const next = this.highlightedItemIndex() + step; this.highlightedItemIndex.set(Math.max(0, Math.min(list.length - 1, next))); }
  selectItem(id: string, name: string) { this.selectedItemId.set(id); this.itemQuery.set(name); this.packetForm.patchValue({ itemno: id }); this.showItemDropdown.set(false); this.highlightedItemIndex.set(0); this.itemInvalid.set(false); this.updatePktname(); }
  openItemDropdown() { this.showItemDropdown.set(true); this.highlightedItemIndex.set(0); }
  closeItemDropdownDelayed() { setTimeout(() => this.showItemDropdown.set(false), 120); }

  getDropdownName(id: string | null, list: any[], type: string): string {
    if (!id) return '-';
    const item = list.find(i => i.id === id);
    if (!item) return '-';
    
    switch (type) {
      case 'mstmm': return item['mm'] || item['name'] || '-';
      case 'mstcmp': return item['cmp'] || item['name'] || '-';
      case 'mstfit': return item['fit'] || item['name'] || '-';
      case 'mstnali': return item['nali'] || item['name'] || '-';
      case 'mstgrade': return item['grade'] || item['name'] || '-';
      case 'mstitem': return item['item'] || item['name'] || '-';
      default: return item['name'] || '-';
    }
  }

  updatePktname(): void {
    const mm = this.packetForm.get('mmno')?.value;
    const cmp = this.packetForm.get('cmpno')?.value;
    const fit = this.packetForm.get('fitno')?.value;
    const nali = this.packetForm.get('nalino')?.value;

    const mmName = this.getDropdownName(mm, this.mmList(), 'mstmm');
    const cmpName = this.getDropdownName(cmp, this.cmpList(), 'mstcmp');
    const fitName = this.getDropdownName(fit, this.fitList(), 'mstfit');
    const naliName = this.getDropdownName(nali, this.naliList(), 'mstnali');

    const parts = [mmName, cmpName, fitName, naliName].filter(p => p && p !== '-');
    this.packetForm.patchValue({ pktname: parts.join(' X ') }, { emitEvent: false });
  }

  async openAddModal() {
    this.isEditMode.set(false);
    this.currentPacket.set(null);
    this.formError.set(null);
    this.packetForm.reset();
    this.mmQuery.set('');
    this.selectedMmId.set(null);
    
    const maxPktno = await this.pktmasterService.getMaxPktno();
    
    this.packetForm.patchValue({
      pktno: maxPktno,
      status: 'Active'
    });
    this.showModal.set(true);
    setTimeout(() => this.mmSelect?.nativeElement?.focus(), 100);
  }

  openEditModal(pkt: any) {
    this.isEditMode.set(true);
    this.currentPacket.set(pkt);
    this.formError.set(null);
    
    const mmItem = this.mmList().find(m => m.id === pkt['mmno']);
    const cmpItem = this.cmpList().find(c => c.id === pkt['cmpno']);
    const fitItem = this.fitList().find(f => f.id === pkt['fitno']);
    const naliItem = this.naliList().find(n => n.id === pkt['nalino']);
    const gradeItem = this.gradeList().find(g => g.id === pkt['gradeno']);
    const itemItem = this.itemList().find(i => i.id === pkt['itemno']);
    
    this.mmQuery.set(mmItem ? mmItem['name'] : '');
    this.selectedMmId.set(pkt['mmno'] || null);
    this.cmpQuery.set(cmpItem ? cmpItem['name'] : '');
    this.selectedCmpId.set(pkt['cmpno'] || null);
    this.fitQuery.set(fitItem ? fitItem['name'] : '');
    this.selectedFitId.set(pkt['fitno'] || null);
    this.naliQuery.set(naliItem ? naliItem['name'] : '');
    this.selectedNaliId.set(pkt['nalino'] || null);
    this.gradeQuery.set(gradeItem ? gradeItem['name'] : '');
    this.selectedGradeId.set(pkt['gradeno'] || null);
    this.itemQuery.set(itemItem ? itemItem['name'] : '');
    this.selectedItemId.set(pkt['itemno'] || null);
    
    this.packetForm.patchValue({
      pktno: pkt['pktno'],
      pktname: pkt['pktname'],
      mmno: pkt['mmno'] || '',
      cmpno: pkt['cmpno'] || '',
      fitno: pkt['fitno'] || '',
      nalino: pkt['nalino'] || '',
      gradeno: pkt['gradeno'] || '',
      itemno: pkt['itemno'] || '',
      status: pkt['status'] || 'Active'
    });
    this.showModal.set(true);
    setTimeout(() => this.mmSelect?.nativeElement?.focus(), 100);
  }

  closeModal() {
    this.showModal.set(false);
    this.packetForm.reset();
    this.formError.set(null);
    this.mmQuery.set('');
    this.selectedMmId.set(null);
    this.cmpQuery.set('');
    this.selectedCmpId.set(null);
    this.fitQuery.set('');
    this.selectedFitId.set(null);
    this.naliQuery.set('');
    this.selectedNaliId.set(null);
    this.gradeQuery.set('');
    this.selectedGradeId.set(null);
    this.itemQuery.set('');
    this.selectedItemId.set(null);
  }

  async savePacket() {
    if (this.packetForm.invalid) return;
    
    const formData = this.packetForm.value;
    
    if (formData['mmno'] && !this.mmList().find(m => m.id === formData['mmno'])) {
      this.formError.set('Please select a valid MM from the list');
      return;
    }
    if (formData['cmpno'] && !this.cmpList().find(c => c.id === formData['cmpno'])) {
      this.formError.set('Please select a valid CMP from the list');
      return;
    }
    if (formData['fitno'] && !this.fitList().find(f => f.id === formData['fitno'])) {
      this.formError.set('Please select a valid FIT from the list');
      return;
    }
    if (formData['nalino'] && !this.naliList().find(n => n.id === formData['nalino'])) {
      this.formError.set('Please select a valid NALI from the list');
      return;
    }
    if (formData['gradeno'] && !this.gradeList().find(g => g.id === formData['gradeno'])) {
      this.formError.set('Please select a valid Grade from the list');
      return;
    }
    if (formData['itemno'] && !this.itemList().find(i => i.id === formData['itemno'])) {
      this.formError.set('Please select a valid Item from the list');
      return;
    }
    
    this.saving.set(true);
    this.formError.set(null);
    
    try {
      const pktData = {
        pktno: formData['pktno'] ? parseInt(formData['pktno']) : null,
        pktname: formData['pktname'],
        mmno: formData['mmno'] || null,
        cmpno: formData['cmpno'] || null,
        fitno: formData['fitno'] || null,
        nalino: formData['nalino'] || null,
        gradeno: formData['gradeno'] || null,
        itemno: formData['itemno'] || null,
        status: formData['status'] || 'Active'
      };
      
      let result;
      
      if (this.isEditMode()) {
        result = await this.pktmasterService.update(this.currentPacket().id, pktData);
      } else {
        result = await this.pktmasterService.create(pktData);
      }
      
      if (result.success) {
        this.toastService.success(`Packet ${this.isEditMode() ? 'updated' : 'created'} successfully`);
        this.closeModal();
        await this.loadPackets();
      } else {
        this.toastService.error(result.error || 'Operation failed');
      }
    } catch (err: any) {
      this.toastService.error(err.message || 'Operation failed');
    } finally {
      this.saving.set(false);
    }
  }

  openDeleteModal(pkt: any) {
    this.packetToDelete.set(pkt);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.packetToDelete.set(null);
  }

  async confirmDelete() {
    if (!this.packetToDelete()) return;
    
    this.saving.set(true);
    
    try {
      const success = await this.pktmasterService.delete(this.packetToDelete().id);
      if (success) {
        this.toastService.success('Packet deleted successfully');
        this.closeDeleteModal();
        await this.loadPackets();
      } else {
        this.toastService.error('Failed to delete packet');
      }
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to delete packet');
    } finally {
      this.saving.set(false);
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  exportToExcel(): void {
    this.isImporting.set(true);
    this.importProgress.set(0);
    
    setTimeout(() => {
      const data = this.packets().map(pkt => ({
        'Pkt No': pkt['pktno'],
        'Packet Name': pkt['pktname'],
        'MM': this.getDropdownName(pkt['mmno'], this.mmList(), 'mstmm'),
        'CMP': this.getDropdownName(pkt['cmpno'], this.cmpList(), 'mstcmp'),
        'FIT': this.getDropdownName(pkt['fitno'], this.fitList(), 'mstfit'),
        'NALI': this.getDropdownName(pkt['nalino'], this.naliList(), 'mstnali'),
        'Grade': this.getDropdownName(pkt['gradeno'], this.gradeList(), 'mstgrade'),
        'Item': this.getDropdownName(pkt['itemno'], this.itemList(), 'mstitem'),
        'Status': pkt['status']
      }));

      this.importProgress.set(50);

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Packet Master');
      XLSX.writeFile(wb, `gcsheet_pktmaster_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      this.importProgress.set(100);
      setTimeout(() => {
        this.isImporting.set(false);
        this.importProgress.set(0);
      }, 500);
    }, 100);
  }

  async importFromExcel(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
          this.toastService.error('No data found in the file');
          return;
        }

        this.isImporting.set(true);
        this.importProgress.set(0);

        const maxPktno = await this.pktmasterService.getMaxPktno();

        const newRecords = jsonData
          .map((row, index) => {
            const mmName = row['MM'] || row['mm'] || '';
            const cmpName = row['CMP'] || row['cmp'] || '';
            const fitName = row['FIT'] || row['fit'] || '';
            const naliName = row['NALI'] || row['nali'] || '';
            const gradeName = row['Grade'] || row['grade'] || '';
            const itemName = row['Item'] || row['item'] || '';

            const mmItem = this.mmList().find(m => (m['name'] || m['mm'] || '').toLowerCase() === mmName.toLowerCase());
            const cmpItem = this.cmpList().find(c => (c['name'] || c['cmp'] || '').toLowerCase() === cmpName.toLowerCase());
            const fitItem = this.fitList().find(f => (f['name'] || f['fit'] || '').toLowerCase() === fitName.toLowerCase());
            const naliItem = this.naliList().find(n => (n['name'] || n['nali'] || '').toLowerCase() === naliName.toLowerCase());
            const gradeItem = this.gradeList().find(g => (g['name'] || g['grade'] || '').toLowerCase() === gradeName.toLowerCase());
            const itemItem = this.itemList().find(i => (i['name'] || i['item'] || '').toLowerCase() === itemName.toLowerCase());

            const pktname = row['Packet Name'] || row['pktname'];
            if (!pktname) return null;

            const missingFields: string[] = [];
            if (!mmItem && mmName) missingFields.push('MM');
            if (!cmpItem && cmpName) missingFields.push('CMP');
            if (!fitItem && fitName) missingFields.push('FIT');
            if (!naliItem && naliName) missingFields.push('NALI');
            if (!gradeItem && gradeName) missingFields.push('Grade');
            if (!itemItem && itemName) missingFields.push('Item');

            if (missingFields.length > 0) {
              return { _skip: true, pktname, missingFields: missingFields.join(', ') };
            }

            return {
              pktno: maxPktno + index + 1,
              pktname: pktname,
              mmno: mmItem?.id || null,
              cmpno: cmpItem?.id || null,
              fitno: fitItem?.id || null,
              nalino: naliItem?.id || null,
              gradeno: gradeItem?.id || null,
              itemno: itemItem?.id || null,
              status: row['Status'] || row['status'] || 'Active'
            };
          });

        const skippedRecords = newRecords.filter(r => r && (r as any)._skip === true);
        const validRecords = newRecords.filter(r => r && (r as any)._skip !== true) as any[];

        if (skippedRecords.length > 0) {
          const skippedMsg = (skippedRecords as NonNullable<typeof skippedRecords[number]>[]).map(r => `${r.pktname}: ${r.missingFields}`).join('; ');
          this.toastService.warning(`Skipped ${skippedRecords.length} record(s) - master data not found: ${skippedMsg}`);
        }

        if (validRecords.length === 0) {
          this.toastService.error('No valid data found in the file');
          this.isImporting.set(false);
          input.value = '';
          return;
        }

        const result = await this.pktmasterService.batchCreate(validRecords, (done, total) => {
          this.importProgress.set(Math.round((done / total) * 100));
        });
        
        await this.loadPackets();
        
        if (result.imported > 0) {
          this.toastService.success(`Successfully imported ${result.imported} record(s)${result.failed > 0 ? `. ${result.failed} failed.` : '.'}`);
        } else {
          this.toastService.error(`Import completed. ${result.failed} record(s) failed or already exist.`);
        }
      } catch (err: any) {
        this.toastService.error(err.message || 'Failed to import file');
      } finally {
        this.isImporting.set(false);
        this.importProgress.set(0);
        input.value = '';
      }
    };

    reader.readAsArrayBuffer(file);
  }

  async setAllActive() {
    if (!confirm('Are you sure you want to set all packets as Active?')) return;

    this.loading.set(true);

    try {
      const success = await this.pktmasterService.setAllActive();
      if (success) {
        this.toastService.success('All packets set to Active successfully');
        await this.loadPackets();
      } else {
        this.toastService.error('Failed to update packets');
      }
    } catch (err: any) {
      this.toastService.error(err.message || 'Failed to set all packets active');
    } finally {
      this.loading.set(false);
    }
  }
}