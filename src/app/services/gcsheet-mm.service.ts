import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';

@Injectable({
  providedIn: 'root'
})
export class GcsheetMmService {
  private pb = PocketbaseService.getInstance().getClient();

  async getAll(): Promise<any[]> {
    const cacheKey = 'gcsheet_mm_all';
    const cached = PocketbaseService.getInstance().getCached<any[]>(cacheKey);
    if (cached) return cached;

    const records = await PocketbaseService.getInstance().withRetry(async () => {
      return await this.pb.collection('egcsheet1_mstmm').getList(1, 500, {
        sort: 'name',
        requestKey: null
      });
    });

    const result = records.items;
    PocketbaseService.getInstance().setCache(cacheKey, result);
    return result;
  }

  async create(data: { name: string }): Promise<{ success: boolean; record?: any; error: string }> {
    try {
      const record = await this.pb.collection('egcsheet1_mstmm').create(data);
      PocketbaseService.getInstance().invalidateCache('gcsheet_mm_all');
      return { success: true, record, error: '' };
    } catch (err: any) {
      return { success: false, record: null, error: err.message || 'Failed to create record' };
    }
  }

  async update(id: string, data: { name: string }): Promise<{ success: boolean; record?: any; error: string }> {
    try {
      const record = await this.pb.collection('egcsheet1_mstmm').update(id, data);
      PocketbaseService.getInstance().invalidateCache('gcsheet_mm_all');
      return { success: true, record, error: '' };
    } catch (err: any) {
      return { success: false, record: null, error: err.message || 'Failed to update record' };
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.pb.collection('egcsheet1_mstmm').delete(id);
      PocketbaseService.getInstance().invalidateCache('gcsheet_mm_all');
      return true;
    } catch (err: any) {
      return false;
    }
  }
}
