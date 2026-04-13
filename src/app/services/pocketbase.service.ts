import { Injectable, signal } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {
  private static instance: PocketbaseService;
  private pb: PocketBase;
  private authPromise: Promise<boolean> | null = null;
  
  private _isConnected = signal<boolean>(false);
  private _isAuthenticated = signal<boolean>(false);
  
  readonly isConnected = this._isConnected.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000;

  private constructor() {
    this.pb = new PocketBase(environment.pocketbaseUrl);
    this.pb.autoCancellation(false);
    this.checkConnection();
  }

  static getInstance(): PocketbaseService {
    if (!PocketbaseService.instance) {
      PocketbaseService.instance = new PocketbaseService();
    }
    return PocketbaseService.instance;
  }

  getClient(): PocketBase {
    return this.pb;
  }

  async checkConnection(): Promise<void> {
    try {
      await this.pb.health.check();
      this._isConnected.set(true);
    } catch {
      this._isConnected.set(false);
    }
  }

  async authenticate(): Promise<boolean> {
    console.log('PB Service: authenticate() called');
    if (this.authPromise) {
      console.log('PB Service: returning cached auth promise');
      return this.authPromise;
    }
    
    console.log('PB Service: starting new authentication');
    this.authPromise = this.doAuthenticate();
    return this.authPromise;
  }

  private async doAuthenticate(): Promise<boolean> {
    try {
      console.log('PB Service: attempting superuser auth with', environment.pocketbaseAdminEmail);
      await this.pb.collection('_superusers').authWithPassword(
        environment.pocketbaseAdminEmail,
        environment.pocketbaseAdminPassword
      );
      console.log('PB Service: superuser auth successful');
      this._isAuthenticated.set(true);
      return true;
    } catch (err: any) {
      console.error('PB Service: superuser auth failed', err);
      try {
        console.log('PB Service: trying admin auth');
        await (this.pb as any).admins?.authWithPassword(
          environment.pocketbaseAdminEmail,
          environment.pocketbaseAdminPassword
        );
        console.log('PB Service: admin auth successful');
        this._isAuthenticated.set(true);
        return true;
      } catch (err2: any) {
        console.error('PB Service: admin auth also failed', err2);
        this._isAuthenticated.set(false);
        return false;
      }
    }
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (err: any) {
        if (attempt === retries) throw err;
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    throw new Error('Max retries exceeded');
  }

  getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  invalidateCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  async batchDelete(
    collection: string,
    ids: string[],
    batchSize = 50
  ): Promise<void> {
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      await Promise.all(
        batch.map(id => this.pb.collection(collection).delete(id).catch(() => null))
      );
    }
  }

  clearAuth(): void {
    this.pb.authStore.clear();
    this._isAuthenticated.set(false);
    this.authPromise = null;
  }
}
