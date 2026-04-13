import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';

export interface SalesHeader {
  id: string;
  billno: number;
  billdate: string;
  customername: string;
  truckno: string;
}

export interface SalesDetail {
  id: string;
  billno: string;
  pktno: string;
  pktname?: string;
  particulars?: string;
  qty: number;
  weight: number;
  rate: number;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class GcsheetSaleinvService {
  private pb = PocketbaseService.getInstance().getClient();
  private pktmasterCache: any[] | null = null;
  private mstfitCache: any[] | null = null;
  private lastPktmasterLoadTime = 0;
  private lastMstfitLoadTime = 0;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private async ensureAuth() {
    await PocketbaseService.getInstance().authenticate();
  }

  async preAuthenticate() {
    await PocketbaseService.getInstance().authenticate();
  }

  async getSalesHeaderAll(): Promise<SalesHeader[]> {
    await this.ensureAuth();
    // Load first page only for initial table display - improves UI responsiveness
    const res = await this.pb.collection('egcsheet1_salesmy')
      .getList(1, 50, { sort: '-created' });

    return res.items.map((r: any) => ({
      id: r.id,
      billno: +r.billno,
      billdate: r.billdate,
      customername: r.customername,
      truckno: r.truckno,
      transportation: r.transportation || '',
      wgtslipno: r.wgtslipno || '',
      loadslipno: r.loadslipno || '',
      narration: r.narration || '',
      totalpcs: r.totalpcs || 0,
      totalwgt: r.totalwgt || 0,
      billamt: r.billamt || 0,
      nettamount: r.nettamount || 0
    }));
  }

  async getSalesHeaderPage(page: number, pageSize: number = 50): Promise<{ items: SalesHeader[]; total: number }> {
    await this.ensureAuth();
    const res = await this.pb.collection('egcsheet1_salesmy')
      .getList(page, pageSize, { sort: '-created' });

    return {
      items: res.items.map((r: any) => ({
        id: r.id,
        billno: +r.billno,
        billdate: r.billdate,
        customername: r.customername,
        truckno: r.truckno,
        transportation: r.transportation || '',
        wgtslipno: r.wgtslipno || '',
        loadslipno: r.loadslipno || '',
        narration: r.narration || '',
        totalpcs: r.totalpcs || 0,
        totalwgt: r.totalwgt || 0,
        billamt: r.billamt || 0,
        nettamount: r.nettamount || 0
      })),
      total: res.totalItems
    };
  }

  async getSalesDetailAll(): Promise<SalesDetail[]> {
    await this.ensureAuth();
    
    // Cache sales details to avoid reloading on every dayend check
    const now = Date.now();
    const lastLoadTime = (this as any)._lastSalesDetailLoadTime || 0;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    if ((this as any)._salesDetailCache && (now - lastLoadTime) < CACHE_DURATION) {
      return (this as any)._salesDetailCache;
    }
    
    const res = await this.pb.collection('egcsheet1_saledet')
      .getList(1, 1000, { sort: 'billno,srno' });

    const result = res.items.map((r: any) => ({
      id: r.id,
      billno: r.billno,
      pktno: r.pktno,
      qty: +r.qty || 0,
      weight: +r.weight || 0,
      rate: +r.rate || 0,
      amount: +r.amount || 0
    }));
    
    (this as any)._salesDetailCache = result;
    (this as any)._lastSalesDetailLoadTime = now;
    return result;
  }

  async getSalesDetailByBillno(billno: string): Promise<SalesDetail[]> {
    await this.ensureAuth();
    // Use getList with pagination instead of getFullList for better performance
    const res = await this.pb.collection('egcsheet1_saledet').getList(1, 500, {
      filter: `billno="${billno}"`,
      sort: 'srno'
    });

    return res.items.map((r: any) => ({
      id: r.id,
      billno: r.billno,
      pktno: r.pktno,
      particulars: r.particulars || '',
      qty: +r.qty || 0,
      weight: +r.weight || 0,
      rate: +r.rate || 0,
      amount: +r.amount || 0
    }));
  }

  async deleteSalesDetailsByBillno(billno: string): Promise<boolean> {
    try {
      await this.ensureAuth();
      const details = await this.getSalesDetailByBillno(billno);
      if (details.length === 0) return true;
      
      await Promise.all(details.map(d => 
        PocketbaseService.getInstance().withRetry(async () => {
          await this.pb.collection('egcsheet1_saledet').delete(d.id);
        }).catch(() => null)
      ));
      
      return true;
    } catch {
      return false;
    }
  }

  async createSalesHeader(data: any) {
    await this.ensureAuth();
    return await this.pb.collection('egcsheet1_salesmy').create(data);
  }

  async updateSalesHeader(id: string, data: any) {
    await this.ensureAuth();
    return await this.pb.collection('egcsheet1_salesmy').update(id, data);
  }

  async deleteSalesHeader(id: string) {
    await this.ensureAuth();
    return await this.pb.collection('egcsheet1_salesmy').delete(id);
  }

  async createSalesDetailsBatch(details: any[], onProgress?: (done: number, total: number) => void) {
    await this.ensureAuth();
    
    const BATCH_SIZE = 50;
    let completed = 0;
    
    for (let i = 0; i < details.length; i += BATCH_SIZE) {
      const chunk = details.slice(i, i + BATCH_SIZE);
      
      const promises = chunk.map(d => 
        PocketbaseService.getInstance().withRetry(async () => {
          await this.pb.collection('egcsheet1_saledet').create(d);
        }).catch(err => {
          console.error('Failed to create sales detail:', err);
          return null;
        })
      );
      
      await Promise.all(promises);
      completed += chunk.length;
      
      if (onProgress) {
        onProgress(completed, details.length);
      }
    }
  }

  async getMaxBillno(): Promise<number> {
    await this.ensureAuth();
    const res = await this.pb.collection('egcsheet1_salesmy')
      .getList(1, 1, { sort: '-billno' });

    if (res.items.length > 0) {
      return parseInt(res.items[0]['billno']) + 1;
    }
    return 1;
  }

  async getPktmasterAll(): Promise<any[]> {
    await this.ensureAuth();
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.pktmasterCache && (now - this.lastPktmasterLoadTime) < this.CACHE_DURATION) {
      return this.pktmasterCache;
    }

    // Load only first 500 items instead of ALL records for better performance
    // If you need more, implement pagination or search
    const res = await this.pb.collection('egcsheet1_pktmst')
      .getList(1, 500, { sort: 'pktname' });

    this.pktmasterCache = res.items;
    this.lastPktmasterLoadTime = now;
    return res.items;
  }

  async getPktmasterSearchResults(query: string, limit: number = 100): Promise<any[]> {
    await this.ensureAuth();
    // For search scenarios when user types in dropdown
    const res = await this.pb.collection('egcsheet1_pktmst')
      .getList(1, limit, { 
        filter: `pktname ~ "${query}"`,
        sort: 'pktname' 
      });
    return res.items;
  }

  async getMstfitAll(): Promise<any[]> {
    await this.ensureAuth();
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.mstfitCache && (now - this.lastMstfitLoadTime) < this.CACHE_DURATION) {
      return this.mstfitCache;
    }

    const res = await this.pb.collection('egcsheet1_mstfit')
      .getList(1, 200, { sort: 'name' });

    this.mstfitCache = res.items;
    this.lastMstfitLoadTime = now;
    return res.items;
  }

  clearCache(): void {
    this.pktmasterCache = null;
    this.mstfitCache = null;
    this.lastPktmasterLoadTime = 0;
    this.lastMstfitLoadTime = 0;
    (this as any)._salesDetailCache = null;
    (this as any)._lastSalesDetailLoadTime = 0;
  }

  async getLogfileTodayDate(): Promise<string> {
    await this.ensureAuth();
    const res = await this.pb.collection('egcsheet1_logfile')
      .getList(1, 1, { filter: 'status=false', sort: '-created' });

    if (res.items.length > 0) {
      return res.items[0]['todaydate'] || '';
    }
    return '';
  }

  async getActiveLogfile(): Promise<any> {
    await this.ensureAuth();
    const res = await this.pb.collection('egcsheet1_logfile')
      .getList(1, 1, { filter: 'status=false', sort: '-created' });

    if (res.items.length > 0) {
      return res.items[0];
    }
    return null;
  }

  async updateLogfileStatus(todaydate: string): Promise<void> {
    await this.ensureAuth();
    const res = await this.pb.collection('egcsheet1_logfile')
      .getList(1, 1, { filter: `todaydate="${todaydate}"`, sort: '-created' });

    if (res.items.length > 0) {
      await this.pb.collection('egcsheet1_logfile').update(res.items[0]['id'], { status: true });
    }
  }

  async createLogfileNextDay(currentDate: string): Promise<void> {
    await this.ensureAuth();
    const current = new Date(currentDate);
    const nextDate = new Date(current);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    await this.pb.collection('egcsheet1_logfile').create({
      todaydate: nextDateStr,
      status: false
    });
  }

}




// Current flow:

// User clicks "Day End" button
// Confirms deletion in modal
// System deletes all invoice records for that date
// Updates logfile status
// Creates next day's logfile
// Shows success message
// After 1 second → Redirects to login page ✅


// Updated flow:

// Day End process completes
// PocketBase auth cleared
// Service cache cleared
// localStorage cleared ← This was missing!
// Shows success message
// After 1 second → Redirects to login page ✓