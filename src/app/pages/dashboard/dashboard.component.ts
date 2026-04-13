import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppGlobalsService } from '../../services/app-globals.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" (click)="navigateToDashboard()" style="cursor: pointer;">
          <i class="bi bi-grid-3x3-gap me-2"></i>
          GCSheet
        </a>
        <button class="navbar-toggler" type="button" (click)="isCollapsed = !isCollapsed">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" [class.show]="!isCollapsed" (click)="isCollapsed = true">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" (click)="navigateToDashboard()" style="cursor: pointer;">
                <i class="bi bi-speedometer2 me-1"></i> Dashboard
              </a>
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
                  <a class="dropdown-item" (click)="navigateToGcsheetPktmaster()">
                    <i class="bi bi-collection me-2"></i>Packet Master
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" (click)="navigateToGcsheetSaleinv()">
                    <i class="bi bi-receipt me-2"></i>Sale Invoice
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" (click)="navigateToGcsheetSalereport()">
                    <i class="bi bi-file-earmark-bar-graph me-2"></i>Sale Report
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" (click)="navigateToGcsheetDayend()">
                    <i class="bi bi-calendar-check me-2"></i>Day End
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item">
              <span class="nav-link">
                <i class="bi bi-person-circle me-1"></i>
                {{ authService.user()?.email }}
              </span>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm" (click)="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-3">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0 d-flex justify-content-between align-items-center">
                <span>
                  <i class="bi bi-speedometer2 me-2"></i>
                  Welcome, {{ authService.user()?.username || authService.user()?.email }}!
                </span>
                <span>
                  <i class="bi bi-calendar me-1"></i>{{ globals.mtodaydate() }}
                </span>
              </h4>
            </div>
            <div class="card-body">
              @if (authService.isSuperAdmin()) {
                <div class="alert alert-success">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  Admin access granted
                </div>
              }
              
              <div class="row mt-2 g-1">
                <div class="col-6 col-md-3 mb-1">
                  <div class="card h-100 border-primary">
                    <div class="card-body text-center py-2">
                      <i class="bi bi-building text-primary"></i>
                      <h5 class="card-title">Company</h5>
                      <p class="card-text">Maintain company records</p>
                      <button class="btn btn-primary btn-sm" (click)="navigateToGcsheetCompany()">Open</button>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3 mb-1">
                  <div class="card h-100 border-success">
                    <div class="card-body text-center py-2">
                      <i class="bi bi-collection text-success"></i>
                      <h5 class="card-title">Packet Master</h5>
                      <p class="card-text">Manage packet definitions</p>
                      <button class="btn btn-success btn-sm" (click)="navigateToGcsheetPktmaster()">Open</button>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3 mb-1">
                  <div class="card h-100 border-warning">
                    <div class="card-body text-center py-2">
                      <i class="bi bi-box-seam text-warning"></i>
                      <h5 class="card-title">Item Master</h5>
                      <p class="card-text">Manage sheet items</p>
                      <button class="btn btn-warning btn-sm" (click)="navigateToGcsheetItem()">Open</button>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3 mb-1">
                  <div class="card h-100 border-info">
                    <div class="card-body text-center py-2">
                      <i class="bi bi-rulers text-info"></i>
                      <h5 class="card-title">Fit Master</h5>
                      <p class="card-text">Manage fit records</p>
                      <button class="btn btn-info btn-sm" (click)="navigateToGcsheetFit()">Open</button>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3 mb-1">
                  <div class="card h-100 border-secondary">
                    <div class="card-body text-center py-2">
                      <i class="bi bi-geo-alt text-secondary"></i>
                      <h5 class="card-title">Nali Master</h5>
                      <p class="card-text">Manage nali records</p>
                      <button class="btn btn-secondary btn-sm" (click)="navigateToGcsheetNali()">Open</button>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3 mb-1">
                  <div class="card h-100 border-dark">
                    <div class="card-body text-center py-2">
                      <i class="bi bi-bar-chart text-dark"></i>
                      <h5 class="card-title">Grade Master</h5>
                      <p class="card-text">Manage grade records</p>
                      <button class="btn btn-dark btn-sm" (click)="navigateToGcsheetGrade()">Open</button>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3 mb-1">
                  <div class="card h-100 border-primary">
                    <div class="card-body text-center py-2">
                      <i class="bi bi-box text-primary"></i>
                      <h5 class="card-title">MM Master</h5>
                      <p class="card-text">Manage mm records</p>
                      <button class="btn btn-primary btn-sm" (click)="navigateToGcsheetMm()">Open</button>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3 mb-1">
                  <div class="card h-100 border-primary">
                    <div class="card-body text-center py-2">
                      <i class="bi bi-receipt text-primary"></i>
                      <h5 class="card-title">Sale Invoice</h5>
                      <p class="card-text">Create and print invoices</p>
                      <button class="btn btn-primary btn-sm" (click)="navigateToGcsheetSaleinv()">Open</button>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3 mb-1">
                  <div class="card h-100 border-success">
                    <div class="card-body text-center py-2">
                      <i class="bi bi-file-earmark-bar-graph text-success"></i>
                      <h5 class="card-title">Sale Report</h5>
                      <p class="card-text">Open invoice print report</p>
                      <button class="btn btn-success btn-sm" (click)="navigateToGcsheetSalereport()">Open</button>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3 mb-1">
                  <div class="card h-100 border-danger">
                    <div class="card-body text-center py-2">
                      <i class="bi bi-calendar-check text-danger"></i>
                      <h5 class="card-title">Day End</h5>
                      <p class="card-text">Close day and reset date</p>
                      <button class="btn btn-danger btn-sm" (click)="navigateToGcsheetDayend()">Open</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .card {
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      padding: 0.75rem 1rem;
    }

    .card-header h4 {
      font-size: 1.1rem;
    }

    .card-title {
      font-weight: 600;
    }

    .card-body {
      padding: 0.75rem;
    }

    .card-body .row {
      margin-top: 0.25rem;
    }

    .card h5 {
      font-size: 0.8rem;
      margin-bottom: 0;
    }

    .card p {
      font-size: 0.65rem;
      margin-bottom: 0.25rem;
    }

    .card button {
      padding: 0.15rem 0.4rem;
      font-size: 0.7rem;
    }

    .card i {
      font-size: 1.2rem;
      display: block;
      margin-bottom: 0.25rem;
    }

    .card-title {
      margin-top: 0.15rem;
    }

    .nav-item.dropdown {
      position: relative;
    }

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

    .dropdown-menu.show {
      display: block;
    }

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

    .dropdown-item:hover {
      background-color: #f8f9fa;
      color: #0d6efd;
    }

    .dropdown-divider {
      height: 0;
      margin: 0.5rem 0;
      overflow: hidden;
      border-top: 1px solid #dee2e6;
    }

    .nav-link {
      cursor: pointer;
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  protected globals = inject(AppGlobalsService);

  isCollapsed = true;
  showGcsheetMenu = false;

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToGcsheetPktmaster(): void {
    this.router.navigate(['/gcsheet-pktmaster']);
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

  navigateToGcsheetSaleinv(): void {
    this.router.navigate(['/gcsheet-saleinv']);
  }

  navigateToGcsheetSalereport(): void {
    this.router.navigate(['/gcsheet1-salereport']);
  }

  navigateToGcsheetDayend(): void {
    this.router.navigate(['/gcsheet1-dayend']);
  }

  toggleGcsheetMenu(): void {
    this.showGcsheetMenu = !this.showGcsheetMenu;
  }

  logout(): void {
    this.authService.logout();
  }
}
