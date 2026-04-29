import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppGlobalsService } from '../../services/app-globals.service';
import { AuthService } from '../../services/auth.service';
import { DmsLogfileService } from '../../services/dms-logfile.service';

interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="d-flex">
      <nav class="sidebar bg-dark text-white" [class.collapsed]="sidebarCollapsed()">
        <div class="sidebar-header p-3">
          <h4 class="mb-0">{{ sidebarCollapsed() ? 'GC' : 'GCSheet' }}</h4>
        </div>
        <ul class="nav flex-column">
          <li class="nav-item">
            <a
              class="nav-link"
              [routerLink]="'/dashboard'"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              <i class="bi bi-speedometer2"></i>
              @if (!sidebarCollapsed()) {
                <span>Dashboard</span>
              }
            </a>
          </li>
          @for (item of menuItems; track item.label) {
            @if (item.children && item.children.length > 0) {
              <li class="nav-item">
                <a class="nav-link" (click)="toggleSubmenu(item.label)" style="cursor: pointer;">
                  @if (item.icon) {
                    <i [class]="item.icon"></i>
                  }
                  @if (!sidebarCollapsed()) {
                    <span>{{ item.label }}</span>
                    <i
                      class="bi"
                      [class.bi-chevron-down]="!expandedMenus()[item.label]"
                      [class.bi-chevron-up]="expandedMenus()[item.label]"
                      style="float: right;"
                    ></i>
                  }
                </a>
                @if (expandedMenus()[item.label] && !sidebarCollapsed()) {
                  <ul class="nav flex-column ms-3">
                    @for (child of item.children; track child.label) {
                      <li class="nav-item">
                        <a class="nav-link" [routerLink]="child.route" routerLinkActive="active">
                          {{ child.label }}
                        </a>
                      </li>
                    }
                  </ul>
                }
              </li>
            } @else {
              <li class="nav-item">
                <a class="nav-link" [routerLink]="item.route" routerLinkActive="active">
                  @if (item.icon) {
                    <i [class]="item.icon"></i>
                  }
                  @if (!sidebarCollapsed()) {
                    <span>{{ item.label }}</span>
                  }
                </a>
              </li>
            }
          }
        </ul>
      </nav>

      <div class="main-content flex-grow-1">
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
          <button class="btn btn-outline-secondary me-3" (click)="toggleSidebar()">
            <i class="bi bi-list"></i>
          </button>
          <button class="btn btn-outline-secondary me-2" (click)="goBack()">
            <i class="bi bi-arrow-left"></i>
          </button>
          <span class="navbar-brand mb-0 h1">Dashboard</span>
          <span class="mx-auto fw-bold text-primary">Todays'Date: {{ globals.mtodaydate() }}</span>
          <div class="ms-auto d-flex align-items-center gap-3">
            <span class="text-muted"
              >Welcome, {{ authService.user()?.email }}</span
            >
            <button class="btn btn-outline-danger btn-sm" (click)="logout()">
              <i class="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </nav>

        <div class="container-fluid p-4">
          <div class="row">
            <div class="col-md-3 mb-4">
              <div class="card border-primary">
                <div class="card-body">
                  <h5 class="card-title text-primary">Company</h5>
                  <a routerLink="/gcsheet-company" class="btn btn-primary btn-sm">Open</a>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card border-success">
                <div class="card-body">
                  <h5 class="card-title text-success">Fit Master</h5>
                  <a routerLink="/gcsheet-fit" class="btn btn-success btn-sm">Open</a>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card border-info">
                <div class="card-body">
                  <h5 class="card-title text-info">MM Master</h5>
                  <a routerLink="/gcsheet-mm" class="btn btn-info btn-sm">Open</a>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card border-warning">
                <div class="card-body">
                  <h5 class="card-title text-warning">Grade Master</h5>
                  <a routerLink="/gcsheet-grade" class="btn btn-warning btn-sm">Open</a>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 mb-4">
              <div class="card border-secondary">
                <div class="card-body">
                  <h5 class="card-title text-secondary">Item Master</h5>
                  <a routerLink="/gcsheet-item" class="btn btn-secondary btn-sm">Open</a>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card border-dark">
                <div class="card-body">
                  <h5 class="card-title text-dark">Nali Master</h5>
                  <a routerLink="/gcsheet-nali" class="btn btn-dark btn-sm">Open</a>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card border-primary">
                <div class="card-body">
                  <h5 class="card-title text-primary">Packet Master</h5>
                  <a routerLink="/gcsheet-pktmaster" class="btn btn-primary btn-sm">Open</a>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card border-info">
                <div class="card-body">
                  <h5 class="card-title text-info">Sale Invoice</h5>
                  <a routerLink="/gcsheet-saleinv" class="btn btn-info btn-sm">Open</a>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 mb-4">
              <div class="card border-warning">
                <div class="card-body">
                  <h5 class="card-title text-warning">Order Invoice</h5>
                  <a routerLink="/gcsheet-ordinv" class="btn btn-warning btn-sm">Open</a>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card border-success">
                <div class="card-body">
                  <h5 class="card-title text-success">Sale Report</h5>
                  <a routerLink="/gcsheet1-salereport" class="btn btn-success btn-sm">Open</a>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card border-danger">
                <div class="card-body">
                  <h5 class="card-title text-danger">Order Report</h5>
                  <a routerLink="/gcsheet1-orderreport" class="btn btn-danger btn-sm">Open</a>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card border-secondary">
                <div class="card-body">
                  <h5 class="card-title text-secondary">Day End</h5>
                  <a routerLink="/gcsheet1-dayend" class="btn btn-secondary btn-sm">Open</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .sidebar {
        width: 250px;
        min-height: 100vh;
        transition: width 0.3s;
      }
      .sidebar.collapsed {
        width: 60px;
      }
      .sidebar .nav-link {
        color: rgba(255, 255, 255, 0.8);
        padding: 12px 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sidebar .nav-link:hover,
      .sidebar .nav-link.active {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }
      .sidebar ul.nav.flex-column .nav-link {
        white-space: nowrap;
      }
      .sidebar-header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .main-content {
        min-height: 100vh;
        background: #f5f5f5;
      }
      .navbar {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  protected globals = inject(AppGlobalsService);
  private router = inject(Router);
  protected authService = inject(AuthService);
  private logfileService = inject(DmsLogfileService);

  currentDate = '';

  readonly sidebarCollapsed = signal(true);
  readonly expandedMenus = signal<Record<string, boolean>>({});

  menuItems: MenuItem[] = [
    {
      label: 'Master Entry',
      icon: 'bi bi-folder',
      children: [
        { label: 'Company', route: '/gcsheet-company' },
        { label: 'Fit', route: '/gcsheet-fit' },
        { label: 'MM', route: '/gcsheet-mm' },
        { label: 'Grade', route: '/gcsheet-grade' },
        { label: 'Item', route: '/gcsheet-item' },
        { label: 'Nali', route: '/gcsheet-nali' },
      ],
    },
    {
      label: 'Transactions',
      icon: 'bi bi-currency-exchange',
      children: [
        { label: 'Packet Master', route: '/gcsheet-pktmaster' },
        { label: 'Sale Invoice', route: '/gcsheet-saleinv' },
        { label: 'Order Invoice', route: '/gcsheet-ordinv' },
        { label: 'Sale Report', route: '/gcsheet1-salereport' },
        { label: 'Order Report', route: '/gcsheet1-orderreport' },
        { label: 'Day End', route: '/gcsheet1-dayend' },
      ],
    },
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  toggleSubmenu(label: string): void {
    this.expandedMenus.update((menus) => ({
      ...menus,
      [label]: !menus[label],
    }));
  }

  ngOnInit() {
    this.loadCurrentDate();
  }

  async loadCurrentDate() {
    try {
      const todayDate = await this.logfileService.getLogfileTodayDate();
      if (todayDate) {
        const normalized = this.normalizeDate(todayDate);
        this.currentDate = normalized;
        this.globals.setMtodaydate(normalized);
      } else {
        const today = new Date().toISOString().split('T')[0];
        this.currentDate = today;
        this.globals.setMtodaydate(today);
      }
    } catch (e) {
      console.error('Error loading date from logfile:', e);
      const today = new Date().toISOString().split('T')[0];
      this.currentDate = today;
      this.globals.setMtodaydate(today);
    }
  }

  private normalizeDate(value: any): string {
    if (!value) return '';
    const text = String(value);
    if (text.includes('T')) return text.split('T')[0];
    if (text.includes(' ')) return text.split(' ')[0];
    return text;
  }

  logout(): void {
    this.authService.logout();
  }

  goBack(): void {
    window.history.back();
  }
}