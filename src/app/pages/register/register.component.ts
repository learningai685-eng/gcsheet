import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { TabAsEnterDirective } from '../../shared/directives/tab-as-enter.directive';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TabAsEnterDirective],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h2 class="text-center mb-4">
            <i class="bi bi-person-plus-fill me-2"></i>
            GCSheet Registration
          </h2>
        </div>

        @if (authService.error()) {
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ authService.error() }}
            <button type="button" class="btn-close" (click)="authService.clearError()"></button>
          </div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" (appTabAsEnter)="onSubmit()">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-person-fill"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                id="username" 
                formControlName="username"
                [class.is-invalid]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                placeholder="Choose a username"
              >
            </div>
            @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
              <div class="invalid-feedback d-block">
                @if (registerForm.get('username')?.errors?.['required']) {
                  Username is required
                } @else if (registerForm.get('username')?.errors?.['minlength']) {
                  Username must be at least 3 characters
                }
              </div>
            }
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-envelope-fill"></i>
              </span>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                formControlName="email"
                [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                placeholder="your.email@example.com"
              >
            </div>
            @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
              <div class="invalid-feedback d-block">
                @if (registerForm.get('email')?.errors?.['required']) {
                  Email is required
                } @else if (registerForm.get('email')?.errors?.['email']) {
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
                [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                placeholder="Create a strong password"
              >
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                (click)="togglePassword()"
              >
                <i class="bi" [class.bi-eye-fill]="!showPassword()" [class.bi-eye-slash-fill]="showPassword()"></i>
              </button>
            </div>
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <div class="invalid-feedback d-block">
                @if (registerForm.get('password')?.errors?.['required']) {
                  Password is required
                } @else if (registerForm.get('password')?.errors?.['minlength']) {
                  Password must be at least 8 characters
                }
              </div>
            }
            <div class="password-strength mt-2">
              <div class="progress" style="height: 5px;">
                <div 
                  class="progress-bar" 
                  [style.width.%]="passwordStrength()"
                  [class.bg-danger]="passwordStrength() < 40"
                  [class.bg-warning]="passwordStrength() >= 40 && passwordStrength() < 70"
                  [class.bg-success]="passwordStrength() >= 70"
                  role="progressbar"
                ></div>
              </div>
              <small class="text-muted">Password strength: {{ getStrengthLabel() }}</small>
            </div>
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-shield-lock-fill"></i>
              </span>
              <input 
                [type]="showConfirmPassword() ? 'text' : 'password'" 
                class="form-control" 
                id="confirmPassword" 
                formControlName="confirmPassword"
                [class.is-invalid]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                placeholder="Confirm your password"
              >
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                (click)="toggleConfirmPassword()"
              >
                <i class="bi" [class.bi-eye-fill]="!showConfirmPassword()" [class.bi-eye-slash-fill]="showConfirmPassword()"></i>
              </button>
            </div>
            @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
              <div class="invalid-feedback d-block">
                @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                  Please confirm your password
                } @else if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                  Passwords do not match
                }
              </div>
            }
          </div>

          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="terms" formControlName="terms"
              [class.is-invalid]="registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched">
            <label class="form-check-label" for="terms">
              I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>
            </label>
            @if (registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched) {
              <div class="invalid-feedback d-block">
                You must accept the terms and conditions
              </div>
            }
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-100 mb-3"
            [disabled]="registerForm.invalid || authService.isLoading()"
          >
            @if (authService.isLoading()) {
              <span class="spinner-border spinner-border-sm me-2"></span>
              Creating account...
            } @else {
              <i class="bi bi-person-plus me-2"></i>
              Create Account
            }
          </button>

          <div class="text-center">
            <p class="mb-0">Already have an account? 
              <a routerLink="/login" class="text-decoration-none">Login here</a>
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
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .register-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 2.5rem;
      width: 100%;
      max-width: 500px;
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

    .register-header h2 {
      color: #333;
      font-weight: 600;
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
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border: none;
      padding: 0.75rem;
      font-weight: 500;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.7;
    }

    .alert-danger {
      border-radius: 0.5rem;
    }

    a {
      color: #f5576c;
      font-weight: 500;
    }

    a:hover {
      color: #f093fb;
    }

    .bi-person-plus-fill {
      color: #f5576c;
    }

    .password-strength {
      font-size: 0.85rem;
    }

    .progress {
      border-radius: 3px;
    }

    .form-check-label a {
      color: #f5576c;
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  protected toastService = inject(ToastService);

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  }, {
    validators: passwordMatchValidator
  });

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  passwordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
    
    return strength;
  }

  getStrengthLabel(): string {
    const strength = this.passwordStrength();
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;

    const { username, email, password, confirmPassword } = this.registerForm.value;
    const result = await this.authService.register(username, email, password, confirmPassword);
    
    if (result) {
      this.toastService.success('Registration successful! Please login.');
      this.registerForm.reset();
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  }
}
