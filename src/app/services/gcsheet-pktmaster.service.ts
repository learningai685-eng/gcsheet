import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';

export interface PktmasterRecord {
  id: string;
  cmpno?: string;
  mmno?: string;
  fitno?: string;
  nalino?: string;
  gradeno?: string;
  itemno?: string;
  pktname?: string;
  pktno?: number;
  status?: string;
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
export class GcsheetPktmasterService {
  private pb = PocketbaseService.getInstance().getClient();
  private cacheKey = 'gcsheet_pktmaster_page_';

  async getPaginated(
    page = 1,
    perPage = 50,
    search?: string,
    sortBy = 'pktname',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<PaginatedResult<PktmasterRecord>> {
    await PocketbaseService.getInstance().authenticate();
    
    const cacheKey = `${this.cacheKey}${page}_${perPage}_${search || ''}_${sortBy}_${sortOrder}`;
    const cached = PocketbaseService.getInstance().getCached<PaginatedResult<PktmasterRecord>>(cacheKey);
    if (cached) return cached;

    const filterParts: string[] = [];
    if (search) {
      filterParts.push(`pktname ~ "${search}"`);
    }
    const filter = filterParts.length > 0 ? filterParts.join(' && ') : '';

    const result = await PocketbaseService.getInstance().withRetry(async () => {
      return await this.pb.collection('egcsheet1_pktmst').getList(page, perPage, {
        filter,
        sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
        requestKey: null
      });
    });

    const paginatedResult: PaginatedResult<PktmasterRecord> = {
      items: result.items.map((r: any) => ({
        id: r.id,
        cmpno: r.cmpno,
        mmno: r.mmno,
        fitno: r.fitno,
        nalino: r.nalino,
        gradeno: r.gradeno,
        itemno: r.itemno,
        pktname: r.pktname,
        pktno: r.pktno,
        status: r.status
      })),
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      page: result.page,
      perPage: result.perPage
    };

    PocketbaseService.getInstance().setCache(cacheKey, paginatedResult);
    return paginatedResult;
  }

  async getAll(): Promise<PktmasterRecord[]> {
    await PocketbaseService.getInstance().authenticate();
    
    const cacheKey = 'gcsheet_pktmaster_all';
    const cached = PocketbaseService.getInstance().getCached<PktmasterRecord[]>(cacheKey);
    if (cached) return cached;
    
    const records = await PocketbaseService.getInstance().withRetry(async () => {
      return await this.pb.collection('egcsheet1_pktmst').getList(1, 1000, {
        sort: 'pktname',
        requestKey: null
      });
    });
    const result = records.items.map((r: any) => ({
      id: r.id,
      cmpno: r.cmpno,
      mmno: r.mmno,
      fitno: r.fitno,
      nalino: r.nalino,
      gradeno: r.gradeno,
      itemno: r.itemno,
      pktname: r.pktname,
      pktno: r.pktno,
      status: r.status
    }));
    PocketbaseService.getInstance().setCache(cacheKey, result);
    return result;
  }

  async search(term: string = ''): Promise<PktmasterRecord[]> {
    if (!term) return this.getAll();

    try {
      await PocketbaseService.getInstance().authenticate();
      
      const escapedTerm = term.replace(/"/g, '""');
      const records = await this.pb.collection('egcsheet1_pktmst').getFullList({
        filter: `pktname ~ "${escapedTerm}"`,
        requestKey: null
      });
      return records.map((r: any) => ({
        id: r.id,
        cmpno: r.cmpno,
        mmno: r.mmno,
        fitno: r.fitno,
        nalino: r.nalino,
        gradeno: r.gradeno,
        itemno: r.itemno,
        pktname: r.pktname,
        pktno: r.pktno,
        status: r.status
      }));
    } catch (err: any) {
      console.error('GcsheetPktmaster search error:', err);
      return [];
    }
  }

  async batchCreate(records: {
    cmpno?: string | null;
    mmno?: string | null;
    fitno?: string | null;
    nalino?: string | null;
    gradeno?: string | null;
    itemno?: string | null;
    pktname?: string;
    pktno?: number | null;
    status?: string;
  }[], onProgress?: (done: number, total: number) => void): Promise<{ imported: number; failed: number }> {
    await PocketbaseService.getInstance().authenticate();
    
    let imported = 0;
    let failed = 0;
    const BATCH_SIZE = 400;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const chunk = records.slice(i, i + BATCH_SIZE);
      
      for (const data of chunk) {
        try {
          await PocketbaseService.getInstance().withRetry(async () => {
            await this.pb.collection('egcsheet1_pktmst').create(data);
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

  async create(data: {
    cmpno?: string | null;
    mmno?: string | null;
    fitno?: string | null;
    nalino?: string | null;
    gradeno?: string | null;
    itemno?: string | null;
    pktname?: string;
    pktno?: number | null;
    status?: string;
  }): Promise<{ success: boolean; record?: any; error?: string }> {
    try {
      await PocketbaseService.getInstance().authenticate();
      
      const record = await PocketbaseService.getInstance().withRetry(async () => {
        return await this.pb.collection('egcsheet1_pktmst').create(data);
      });
      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
      return { success: true, record };
    } catch (err: any) {
      let errorMessage = 'Failed to create pktmaster record';
      if (err.status === 400 && err.data) {
        if (err.data.data) {
          const fieldErrors = Object.keys(err.data.data).map(key => `${key}: ${err.data.data[key].message}`).join(', ');
          errorMessage = fieldErrors;
        } else {
          errorMessage = err.data.message || JSON.stringify(err.data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      return { success: false, error: errorMessage };
    }
  }

  async update(id: string, data: {
    cmpno?: string | null;
    mmno?: string | null;
    fitno?: string | null;
    nalino?: string | null;
    gradeno?: string | null;
    itemno?: string | null;
    pktname?: string;
    pktno?: number | null;
    status?: string;
  }): Promise<{ success: boolean; record?: any; error?: string }> {
    try {
      await PocketbaseService.getInstance().authenticate();
      
      const record = await this.pb.collection('egcsheet1_pktmst').update(id, data);
      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
      return { success: true, record };
    } catch (err: any) {
      let errorMessage = 'Failed to update pktmaster record';
      if (err.status === 400 && err.data?.data?.pktname) {
        errorMessage = 'Packet name already exists. Please use different values.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      return { success: false, error: errorMessage };
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await PocketbaseService.getInstance().authenticate();
      
      await this.pb.collection('egcsheet1_pktmst').delete(id);
      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
      return true;
    } catch (err: any) {
      return false;
    }
  }

  async setAllActive(): Promise<boolean> {
    try {
      await PocketbaseService.getInstance().authenticate();
      
      const records = await this.pb.collection('egcsheet1_pktmst').getFullList({
        fields: 'id',
        requestKey: null
      });

      await Promise.all(
        records.map(record => 
          this.pb.collection('egcsheet1_pktmst').update(record.id, { status: 'Active' })
        )
      );

      PocketbaseService.getInstance().invalidateCache(this.cacheKey);
      return true;
    } catch (err: any) {
      console.error('Error setting all pktmaster active:', err);
      return false;
    }
  }

  async getMaxPktno(): Promise<number> {
    try {
      await PocketbaseService.getInstance().authenticate();
      
      const records = await this.pb.collection('egcsheet1_pktmst').getFullList({
        fields: 'pktno',
        sort: '-pktno',
        requestKey: null
      });
      
      if (records.length === 0 || records[0]['pktno'] === null || records[0]['pktno'] === undefined) {
        return 1;
      }
      
      return (records[0]['pktno'] as number) + 1;
    } catch (err: any) {
      console.error('Error getting max pktno:', err);
      return 1;
    }
  }
}