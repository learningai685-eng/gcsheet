import { Injectable, signal, computed } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { PocketbaseService } from './pocketbase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private pb: PocketBase;

  private _user = signal<any>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isSuperAdmin = computed(() => this._user()?.role === 'superadmin');

  constructor(private router: Router) {
    this.pb = PocketbaseService.getInstance().getClient();

    this.pb.authStore.onChange((token: string, model: any) => {
      if (model) {
        this._user.set(model);
        this._isAuthenticated.set(true);
      } else {
        this._user.set(null);
        this._isAuthenticated.set(false);
      }
    });

    if (this.pb.authStore.isValid) {
      this._isAuthenticated.set(true);
      this._user.set(this.pb.authStore.model);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const pbService = PocketbaseService.getInstance();
      if (!pbService.isConnected()) {
        this._error.set('Cannot connect to PocketBase server. Please ensure the server is running.');
        return false;
      }
      
      const authData = await this.pb.collection('users').authWithPassword(email, password);
      this._user.set(authData.record);
      this._isAuthenticated.set(true);
      return true;
    } catch (err: any) {
      console.error('User login error:', err);
      this._error.set(err.message || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  async loginWithSuperuser(email: string, password: string): Promise<boolean> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const pbService = (window as any)['__pbService'] || PocketbaseService.getInstance();
      if (!pbService.isConnected()) {
        this._error.set('Cannot connect to PocketBase server. Please ensure the server is running.');
        return false;
      }
      
      const authData = await this.pb.collection('_superusers').authWithPassword(email, password);
      this._user.set({
        ...authData.record,
        role: 'superadmin',
        isSuperUser: true
      });
      this._isAuthenticated.set(true);
      this.pb.authStore.save(authData.token, authData.record);
      return true;
    } catch (err: any) {
      console.error('Superuser login error:', err);
      this._error.set(err.message || 'Superuser login failed. Please check your credentials.');
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  async register(username: string, email: string, password: string, passwordConfirm: string): Promise<boolean> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      await this.pb.collection('users').create({
        username,
        email,
        password,
        passwordConfirm,
        role: 'user'
      });
      return true;
    } catch (err: any) {
      this._error.set(err.message || 'Registration failed');
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  logout(): void {
    this.pb.authStore.clear();
    this._user.set(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  clearError(): void {
    this._error.set(null);
  }

  async getUsers(): Promise<any[]> {
    const cacheKey = 'auth_users_all';
    const cached = PocketbaseService.getInstance().getCached<any[]>(cacheKey);
    if (cached) return cached;

    const result = await PocketbaseService.getInstance().withRetry(async () => {
      return await this.pb.collection('users').getList(1, 500, {
        sort: '-created',
        requestKey: null
      });
    });
    
    const users = result.items;
    PocketbaseService.getInstance().setCache(cacheKey, users);
    return users;
  }

  async createUser(username: string, email: string, password: string, passwordConfirm: string, role: string): Promise<boolean> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await this.pb.collection('users').create({
        username,
        email,
        password,
        passwordConfirm,
        role
      });
      return true;
    } catch (err: any) {
      this._error.set(err.message || 'Failed to create user');
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  async updateUser(id: string, data: { username: string; email: string; role: string }): Promise<boolean> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await this.pb.collection('users').update(id, data);
      return true;
    } catch (err: any) {
      this._error.set(err.message || 'Failed to update user');
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await this.pb.collection('users').delete(id);
      return true;
    } catch (err: any) {
      this._error.set(err.message || 'Failed to delete user');
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }
}
