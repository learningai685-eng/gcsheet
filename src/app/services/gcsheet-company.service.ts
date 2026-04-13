import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';

export interface CompanyRecord {
  id: string;
  name: string;
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
export class GcsheetCompanyService {
  private pb = PocketbaseService.getInstance().getClient();
  private cacheKey = 'gcsheet_company_page_';

  async getPaginated(
    page = 1,
    perPage = 50,
    search?: string,
    sortBy = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<PaginatedResult<CompanyRecord>> {
    await PocketbaseService.getInstance().authenticate();
    
    const cacheKey = `${this.cacheKey}${page}_${perPage}_${search || ''}_${sortBy}_${sortOrder}`;
    const cached = PocketbaseService.getInstance().getCached<PaginatedResult<CompanyRecord>>(cacheKey);
    if (cached) {
      console.log('Returning cached data');
      return cached;
    }

    const filterParts: string[] = [];
    if (search) {
      filterParts.push(`name ~ "${search}"`);
    }
    const filter = filterParts.length > 0 ? filterParts.join(' && ') : '';
    
    console.log('Fetching from PocketBase:', { page, perPage, filter, sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}` });

    const result = await PocketbaseService.getInstance().withRetry(async () => {
      return await this.pb.collection('egcsheet1_mstcmp').getList(page, perPage, {
        filter,
        sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
        requestKey: null
      });
    });

    console.log('PocketBase response:', result);
    console.log('Items:', result.items);

    const paginatedResult: PaginatedResult<CompanyRecord> = {
      items: result.items.map((r: any) => ({ id: r.id, name: r.name })),
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      page: result.page,
      perPage: result.perPage
    };

    PocketbaseService.getInstance().setCache(cacheKey, paginatedResult);
    return paginatedResult;
  }

  async getAll(): Promise<CompanyRecord[]> {
    await PocketbaseService.getInstance().authenticate();
    
    const cacheKey = 'gcsheet_company_all';
    const cached = PocketbaseService.getInstance().getCached<CompanyRecord[]>(cacheKey);
    if (cached) return cached;
    
    const records = await PocketbaseService.getInstance().withRetry(async () => {
      return await this.pb.collection('egcsheet1_mstcmp').getList(1, 500, {
        sort: 'name',
        requestKey: null
      });
    });
    const result = records.items.map((r: any) => ({ id: r.id, name: r.name }));
    PocketbaseService.getInstance().setCache(cacheKey, result);
    return result;
  }

  async checkDuplicateName(name: string, excludeId?: string): Promise<boolean> {
    await PocketbaseService.getInstance().authenticate();
    
    const filter = excludeId 
      ? `name = "${name.toLowerCase()}" && id != "${excludeId}"`
      : `name = "${name.toLowerCase()}"`;
    const result = await this.pb.collection('egcsheet1_mstcmp').getList(1, 1, {
      filter,
      requestKey: null
    });
    return result.totalItems > 0;
  }

  async batchCreate(records: { name: string }[], onProgress?: (done: number, total: number) => void): Promise<{ imported: number; failed: number }> {
    await PocketbaseService.getInstance().authenticate();
    
    let imported = 0;
    let failed = 0;
    const BATCH_SIZE = 400;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const chunk = records.slice(i, i + BATCH_SIZE);
      
      for (const data of chunk) {
        try {
          await PocketbaseService.getInstance().withRetry(async () => {
            await this.pb.collection('egcsheet1_mstcmp').create(data);
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

  async create(data: { name: string }): Promise<{ success: boolean; record?: any; error?: string }> {
    await PocketbaseService.getInstance().authenticate();
    
    try {
      const record = await this.pb.collection('egcsheet1_mstcmp').create(data);
      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
      return { success: true, record };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create record' };
    }
  }

  async update(id: string, data: { name: string }): Promise<{ success: boolean; record?: any; error?: string }> {
    await PocketbaseService.getInstance().authenticate();
    
    try {
      const record = await this.pb.collection('egcsheet1_mstcmp').update(id, data);
      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
      return { success: true, record };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update record' };
    }
  }

  async delete(id: string): Promise<boolean> {
    await PocketbaseService.getInstance().authenticate();
    
    try {
      await this.pb.collection('egcsheet1_mstcmp').delete(id);
      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
      return true;
    } catch (err: any) {
      return false;
    }
  }
}
