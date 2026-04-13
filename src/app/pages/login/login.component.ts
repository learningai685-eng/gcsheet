import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { TabAsEnterDirective } from '../../shared/directives/tab-as-enter.directive';
import { AppGlobalsService } from '../../services/app-globals.service';
import { GcsheetSaleinvService } from '../../services/gcsheet-saleinv.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TabAsEnterDirective],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2 class="text-center mb-4">
            <i class="bi bi-shield-lock-fill me-2"></i>
            SuperAdmin Login
          </h2>
        </div>
        
        @if (authService.error()) {
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ authService.error() }}
            <button type="button" class="btn-close" (click)="authService.clearError()"></button>
          </div>
        }

        <div class="login-type-tabs mb-4">
          <button 
            type="button" 
            class="btn tab-btn"
            [class.active]="!isSuperUserLogin()"
            (click)="isSuperUserLogin.set(false)"
          >
            <i class="bi bi-person me-2"></i>User Login
          </button>
          <button 
            type="button" 
            class="btn tab-btn"
            [class.active]="isSuperUserLogin()"
            (click)="isSuperUserLogin.set(true)"
          >
            <i class="bi bi-shield-check me-2"></i>SuperUser Login
          </button>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" (appTabAsEnter)="onSubmit()">
          <div class="mb-3">
            <label for="email" class="form-label">
              {{ isSuperUserLogin() ? 'SuperUser Email' : 'Email Address' }}
            </label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-envelope-fill"></i>
              </span>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                formControlName="email"
                [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                [placeholder]="isSuperUserLogin() ? 'superadmin@example.com' : 'admin@example.com'"
              >
            </div>
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <div class="invalid-feedback d-block">
                @if (loginForm.get('email')?.errors?.['required']) {
                  Email is required
                } @else if (loginForm.get('email')?.errors?.['email']) {
                  Invalid email format
                }
              </div>
            }
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-lock-fill"></i>
              </span>
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                class="form-control" 
                id="password" 
                formControlName="password"
                [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="Enter password"
              >
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                (click)="togglePassword()"
              >
                <i class="bi" [class.bi-eye-fill]="!showPassword()" [class.bi-eye-slash-fill]="showPassword()"></i>
              </button>
            </div>
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <div class="invalid-feedback d-block">
                Password is required
              </div>
            }
          </div>

          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="remember" formControlName="remember">
            <label class="form-check-label" for="remember">Remember me</label>
          </div>

          <button 
            type="submit" 
            class="btn w-100 mb-3"
            [class.btn-primary]="!isSuperUserLogin()"
            [class.btn-superuser]="isSuperUserLogin()"
            [disabled]="loginForm.invalid || authService.isLoading()"
          >
            @if (authService.isLoading()) {
              <span class="spinner-border spinner-border-sm me-2"></span>
              Signing in...
            } @else {
              <i class="bi bi-box-arrow-in-right me-2"></i>
              {{ isSuperUserLogin() ? 'SuperUser Sign In' : 'Sign In' }}
            }
          </button>

          <div class="text-center">
            <p class="mb-0">Don't have an account? 
              <a routerLink="/register" class="text-decoration-none">Register here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 2.5rem;
      width: 100%;
      max-width: 450px;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header h2 {
      color: #333;
      font-weight: 600;
    }

    .login-type-tabs {
      display: flex;
      gap: 0.5rem;
      background: #f8f9fa;
      padding: 0.25rem;
      border-radius: 0.75rem;
    }

    .tab-btn {
      flex: 1;
      border-radius: 0.5rem;
      padding: 0.75rem;
      font-weight: 500;
      background: transparent;
      color: #666;
      border: none;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: white;
      color: #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .tab-btn:hover:not(.active) {
      color: #333;
    }

    .input-group-text {
      background-color: #f8f9fa;
      border-right: none;
    }

    .input-group .form-control {
      border-left: none;
    }

    .input-group .form-control:focus {
      border-color: #dee2e6;
      box-shadow: none;
    }

    .input-group:focus-within .input-group-text {
      border-color: #86b7fe;
      background-color: #f8f9fa;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      padding: 0.75rem;
      font-weight: 500;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-superuser {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      border: none;
      padding: 0.75rem;
      font-weight: 500;
      color: white;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-superuser:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4);
    }

    .btn-primary:disabled, .btn-superuser:disabled {
      opacity: 0.7;
    }

    .alert-danger {
      border-radius: 0.5rem;
    }

    a {
      color: #667eea;
      font-weight: 500;
    }

    a:hover {
      color: #764ba2;
    }

    .bi-shield-lock-fill {
      color: #667eea;
    }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected toastService = inject(ToastService);
  private globals = inject(AppGlobalsService);
  private saleinvService = inject(GcsheetSaleinvService);
  
  showPassword = signal(false);
  isSuperUserLogin = signal(false);
  
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [false]
  });

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    let success: boolean;

    if (this.isSuperUserLogin()) {
      success = await this.authService.loginWithSuperuser(email, password);
    } else {
      success = await this.authService.login(email, password);
    }
    
    if (success) {
      try {
        const logfile = await this.saleinvService.getActiveLogfile();
        console.log('Login - Active logfile:', logfile);
        if (logfile && logfile['todaydate']) {
          const dateStr = this.normalizeDate(logfile['todaydate']);
          console.log('Login - Setting mtodaydate:', dateStr);
          this.globals.setMtodaydate(dateStr);
        } else {
          console.log('Login - No logfile found, using today date');
          const today = new Date().toISOString().split('T')[0];
          this.globals.setMtodaydate(today);
        }
      } catch (e) {
        console.error('Error loading mtodaydate:', e);
        const today = new Date().toISOString().split('T')[0];
        this.globals.setMtodaydate(today);
      }
      this.router.navigate(['/dashboard']);
    }
  }

  private normalizeDate(value: any): string {
    if (!value) return '';
    console.log('normalizeDate input:', value, typeof value);
    const text = String(value);
    if (text.includes('T')) return text.split('T')[0];
    if (text.includes(' ')) return text.split(' ')[0];
    return text;
  }
}
