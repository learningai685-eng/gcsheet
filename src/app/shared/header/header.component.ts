import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppGlobalsService } from '../../services/app-globals.service';

interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-header',
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
            <a class="nav-link" [routerLink]="'/dashboard'" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-speedometer2"></i>
              @if (!sidebarCollapsed()) { <span>Dashboard</span> }
            </a>
          </li>
          @for (item of menuItems; track item.label) {
            @if (item.children && item.children.length > 0) {
              <li class="nav-item">
                <a class="nav-link" (click)="toggleSubmenu(item.label)" style="cursor: pointer;">
                  @if (item.icon) { <i [class]="item.icon"></i> }
                  @if (!sidebarCollapsed()) {
                    <span>{{ item.label }}</span>
                    <i class="bi" [class.bi-chevron-down]="!expandedMenus()[item.label]" 
                       [class.bi-chevron-up]="expandedMenus()[item.label]" 
                       style="float: right;"></i>
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
                  @if (item.icon) { <i [class]="item.icon"></i> }
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
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
          <div class="container-fluid">
            <button class="btn btn-link text-white text-decoration-none p-0 me-2" (click)="toggleSidebar()" title="Toggle Sidebar">
              <i class="bi bi-list fs-4"></i>
            </button>
            <a class="navbar-brand" [routerLink]="'/dashboard'">
              <i class="bi bi-grid-3x3-gap me-2"></i>GCSheet
            </a>
            <span class="navbar-text text-white mx-auto fw-bold">
              Todays'Date:{{ globals.mtodaydate() }}
            </span>
            <div class="d-flex align-items-center gap-3">
              <span class="navbar-text text-white">
                <i class="bi bi-person-circle me-1"></i>
                {{ authService.user()?.email }}
              </span>
              <button class="btn btn-outline-light btn-sm" (click)="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </div>
          </div>
        </nav>

        <div class="p-4">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 400px;
      min-height: 100vh;
      transition: width 0.3s;
    }
    .sidebar.collapsed {
      width: 60px;
    }
    .sidebar .nav-link {
      color: rgba(255,255,255,0.8);
      padding: 12px 20px;
    }
    .sidebar .nav-link:hover, .sidebar .nav-link.active {
      color: white;
      background: rgba(255,255,255,0.1);
    }
    .sidebar-header {
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .main-content {
      min-height: 100vh;
      background: #f5f5f5;
    }
    .navbar { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .sidebar .nav-item ul.nav {
      flex-direction: row !important;
      flex-wrap: wrap;
      gap: 8px;
      padding: 8px 0;
    }
    .sidebar .nav-item ul.nav .nav-item .nav-link {
      padding: 6px 12px;
      font-size: 0.9em;
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  globals = inject(AppGlobalsService);
  private router = inject(Router);

  readonly sidebarCollapsed = signal(false);
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
        { label: 'Nali', route: '/gcsheet-nali' }
      ]
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
        { label: 'Day End', route: '/gcsheet1-dayend' }
      ]
    }
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  toggleSubmenu(label: string): void {
    this.expandedMenus.update(menus => ({
      ...menus,
      [label]: !menus[label]
    }));
  }

  logout(): void {
    this.authService.logout();
  }
}
