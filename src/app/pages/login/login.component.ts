import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { DmsLogfileService } from '../../services/dms-logfile.service';
import { AppGlobalsService } from '../../services/app-globals.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2><i class="bi bi-shield-check"></i> GCSheet </h2>
          <p>Please authenticate to continue</p>
        </div>

        @if (error) {
          <div class="alert alert-danger">{{ error }}</div>
        }

        <form (ngSubmit)="login()">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            @if (loading) {
              <span class="spinner-border spinner-border-sm me-2"></span>
            }
            Login
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .login-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 400px;
      }
      .login-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .login-header h2 {
        color: #333;
        margin-bottom: 0.5rem;
      }
      .login-header p {
        color: #666;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  loading = false;

  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private logfileService = inject(DmsLogfileService);
  private globals = inject(AppGlobalsService);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async login() {
    this.loading = true;
    this.error = '';

    try {
      const success = await this.authService.login(this.email, this.password);
      if (success) {
        await this.initializeLogfileOnLogin();
        this.toastService.success('Login successful');
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Authentication failed. Please check your credentials.';
      }
    } catch (err: any) {
      this.error = err.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }

  private async initializeLogfileOnLogin(): Promise<void> {
    try {
      await this.logfileService.initializeLogfileIfNeeded();
      const todayDate = await this.logfileService.getLogfileTodayDate();
      if (todayDate) {
        this.globals.setMtodaydate(todayDate);
      } else {
        const today = new Date().toISOString().split('T')[0];
        this.globals.setMtodaydate(today);
      }
    } catch (e) {
      console.error('Error initializing logfile on login:', e);
      const today = new Date().toISOString().split('T')[0];
      this.globals.setMtodaydate(today);
    }
  }
}