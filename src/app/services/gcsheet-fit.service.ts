import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';

export interface FitRecord {
  id: string;
  name: string;
  pcsperpkt?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  page: number;
  perPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class GcsheetFitService {
  private pb = PocketbaseService.getInstance().getClient();
  private cacheKey = 'gcsheet_fit_page_';

  async getPaginated(
    page = 1,
    perPage = 50,
    search?: string,
    sortBy = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<PaginatedResult<FitRecord>> {
    await PocketbaseService.getInstance().authenticate();
    
    const cacheKey = `${this.cacheKey}${page}_${perPage}_${search || ''}_${sortBy}_${sortOrder}`;
    const cached = PocketbaseService.getInstance().getCached<PaginatedResult<FitRecord>>(cacheKey);
    if (cached) return cached;

    const filterParts: string[] = [];
    if (search) {
      filterParts.push(`name ~ "${search}"`);
    }
    const filter = filterParts.length > 0 ? filterParts.join(' && ') : '';

    const result = await PocketbaseService.getInstance().withRetry(async () => {
      return await this.pb.collection('egcsheet1_mstfit').getList(page, perPage, {
        filter,
        sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
        requestKey: null
      });
    });

    const paginatedResult: PaginatedResult<FitRecord> = {
      items: result.items.map((r: any) => ({ id: r.id, name: r.name, pcsperpkt: r.pcsperpkt })),
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      page: result.page,
      perPage: result.perPage
    };

    PocketbaseService.getInstance().setCache(cacheKey, paginatedResult);
    return paginatedResult;
  }

  async getAll(): Promise<FitRecord[]> {
    await PocketbaseService.getInstance().authenticate();
    
    const cacheKey = 'gcsheet_fit_all';
    const cached = PocketbaseService.getInstance().getCached<FitRecord[]>(cacheKey);
    if (cached) return cached;
    
    const records = await PocketbaseService.getInstance().withRetry(async () => {
      return await this.pb.collection('egcsheet1_mstfit').getList(1, 500, {
        sort: 'name',
        requestKey: null
      });
    });
    const result = records.items.map((r: any) => ({ id: r.id, name: r.name, pcsperpkt: r.pcsperpkt }));
    PocketbaseService.getInstance().setCache(cacheKey, result);
    return result;
  }

  async checkDuplicateName(name: string, excludeId?: string): Promise<boolean> {
    await PocketbaseService.getInstance().authenticate();
    
    const filter = excludeId 
      ? `name = "${name.toLowerCase()}" && id != "${excludeId}"`
      : `name = "${name.toLowerCase()}"`;
    const result = await this.pb.collection('egcsheet1_mstfit').getList(1, 1, {
      filter,
      requestKey: null
    });
    return result.totalItems > 0;
  }

  async batchCreate(records: { name: string; pcsperpkt?: number }[], onProgress?: (done: number, total: number) => void): Promise<{ imported: number; failed: number }> {
    await PocketbaseService.getInstance().authenticate();
    
    let imported = 0;
    let failed = 0;
    const BATCH_SIZE = 400;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const chunk = records.slice(i, i + BATCH_SIZE);
      
      for (const data of chunk) {
        try {
          await PocketbaseService.getInstance().withRetry(async () => {
            await this.pb.collection('egcsheet1_mstfit').create(data);
          });
          imported++;
        } catch {
          failed++;
        }
      }

      if (onProgress) {
        onProgress(Math.min(i + BATCH_SIZE, records.length), records.length);
      }
    }

    if (imported > 0) {
      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
    }
    
    return { imported, failed };
  }

  async create(data: { name: string; pcsperpkt?: number }): Promise<{ success: boolean; record?: any; error: string }> {
    try {
      await PocketbaseService.getInstance().authenticate();
      
      const record = await this.pb.collection('egcsheet1_mstfit').create(data);
      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
      return { success: true, record, error: '' };
    } catch (err: any) {
      return { success: false, record: null, error: err.message || 'Failed to create record' };
    }
  }

  async update(id: string, data: { name: string; pcsperpkt?: number }): Promise<{ success: boolean; record?: any; error: string }> {
    try {
      await PocketbaseService.getInstance().authenticate();
      
      const record = await this.pb.collection('egcsheet1_mstfit').update(id, data);
      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
      return { success: true, record, error: '' };
    } catch (err: any) {
      return { success: false, record: null, error: err.message || 'Failed to update record' };
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await PocketbaseService.getInstance().authenticate();
      
      await this.pb.collection('egcsheet1_mstfit').delete(id);
      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
      return true;
    } catch (err: any) {
      return false;
    }
  }
}