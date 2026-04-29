import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet-pktmaster',
    loadComponent: () => import('./pages/gcsheet-pktmaster/gcsheet-pktmaster.component').then(m => m.GcsheetPktmasterComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet-company',
    loadComponent: () => import('./pages/gcsheet-company/gcsheet-company.component').then(m => m.GcsheetCompanyComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet-fit',
    loadComponent: () => import('./pages/gcsheet-fit/gcsheet-fit.component').then(m => m.GcsheetFitComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet-mm',
    loadComponent: () => import('./pages/gcsheet-mm/gcsheet-mm.component').then(m => m.GcsheetMmComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet-grade',
    loadComponent: () => import('./pages/gcsheet-grade/gcsheet-grade.component').then(m => m.GcsheetGradeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet-item',
    loadComponent: () => import('./pages/gcsheet-item/gcsheet-item.component').then(m => m.GcsheetItemComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet-nali',
    loadComponent: () => import('./pages/gcsheet-nali/gcsheet-nali.component').then(m => m.GcsheetNaliComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet-saleinv',
    loadComponent: () => import('./pages/gcsheet-saleinv/gcsheet-saleinv.component').then(m => m.GcsheetSaleinvComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet-ordinv',
    loadComponent: () => import('./pages/gcsheet-ordinv/gcsheet-ordinv.component').then(m => m.GcsheetOrdinvComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet1-salereport',
    loadComponent: () => import('./pages/gcsheet1-salereport/gcsheet1-salereport.component').then(m => m.Gcsheet1SalereportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet1-orderreport',
    loadComponent: () => import('./pages/gcsheet1-orderreport/gcsheet1-orderreport.component').then(m => m.Gcsheet1OrderreportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gcsheet1-dayend',
    loadComponent: () => import('./pages/gcsheet1-dayend/gcsheet1-dayend.component').then(m => m.Gcsheet1DayendComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
