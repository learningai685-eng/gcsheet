import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';

export interface OrderHeader {
  id: string;
  billno: number;
  billdate: string;
  customername: string;
  deliverylocation?: string;
  truckno: string;
  transportation?: string;
  wgtslipno?: string;
  loadslipno?: string;
  narration?: string;
  totalpcs?: number;
  totalwgt?: number;
  nettamount?: number;
  other1_desp?: string;
  other2_desp?: string;
  billamt?: number;
  other1_amt?: number;
  other2_amt?: number;
  loadamt?: number;
  gstper?: number;
  gstamt?: number;
}

export interface OrderDetail {
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
export class GcsheetOrdinvService {
  private pb = PocketbaseService.getInstance().getClient();

  async getOrderHeaderAll(): Promise<OrderHeader[]> {
    const res = await this.pb.collection('egcsheet1_ordsmy')
      .getList(1, 200, { sort: '-created' });

    return res.items.map((r: any) => ({
      id: r.id,
      billno: +r.billno,
      billdate: r.billdate,
      customername: r.customername,
      deliverylocation: r.deliverylocation || '',
      truckno: r.truckno,
      transportation: r.transportation || '',
      wgtslipno: r.wgtslipno || '',
      loadslipno: r.loadslipno || '',
      narration: r.narration || '',
      totalpcs: +r.totalpcs || 0,
      totalwgt: +r.totalwgt || 0,
      nettamount: +r.nettamount || 0,
      other1_desp: r.other1_desp || '',
      other2_desp: r.other2_desp || '',
      billamt: +r.billamt || 0,
      other1_amt: +r.other1_amt || 0,
      other2_amt: +r.other2_amt || 0,
      loadamt: +r.loadamt || 0,
      gstper: +r.gstper || 0,
      gstamt: +r.gstamt || 0
    }));
  }

  async getOrderDetailAll(): Promise<OrderDetail[]> {
    const res = await this.pb.collection('egcsheet1_orddet')
      .getList(1, 500, { sort: 'billno,srno' });

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

  async getOrderDetailByBillno(billno: string): Promise<OrderDetail[]> {
    const records = await this.pb.collection('egcsheet1_orddet').getFullList({
      filter: `billno="${billno}"`,
      sort: 'srno'
    });

    return records.map((r: any) => ({
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

  async deleteOrderDetailsByBillno(billno: string): Promise<boolean> {
    try {
      const records = await this.pb.collection('egcsheet1_orddet').getFullList({
        filter: `billno="${billno}"`,
        sort: 'srno'
      });
      
      if (records.length === 0) return true;

      const ids = records.map((r: any) => r.id);
      const BATCH_SIZE = 100;
      
      for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batch = ids.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map((id: string) => this.pb.collection('egcsheet1_orddet').delete(id).catch(() => null))
        );
      }
      return true;
    } catch {
      return false;
    }
  }

  async createOrderHeader(data: any) {
    const result = await this.pb.collection('egcsheet1_ordsmy').create(data);
    return result;
  }

  async updateOrderHeader(id: string, data: any) {
    return await this.pb.collection('egcsheet1_ordsmy').update(id, data);
  }

  async deleteOrderHeader(id: string) {
    return await this.pb.collection('egcsheet1_ordsmy').delete(id);
  }

  async createOrderDetailsBatch(details: any[], onProgress?: (done: number, total: number) => void) {
    if (details.length === 0) return;
    
    const BATCH_SIZE = 50;
    
    for (let i = 0; i < details.length; i += BATCH_SIZE) {
      const batch = details.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((d: any) => this.pb.collection('egcsheet1_orddet').create(d).catch((err: any) => {
          console.error('Error creating detail:', err);
          throw err;
        }))
      );
      if (onProgress) {
        onProgress(Math.min(i + BATCH_SIZE, details.length), details.length);
      }
    }
  }

  async createOrderDetailsBatchWithBillno(billno: string, details: any[], onProgress?: (done: number, total: number) => void) {
    if (details.length === 0) return;
    
    const BATCH_SIZE = 100;
    
    for (let i = 0; i < details.length; i += BATCH_SIZE) {
      const batch = details.slice(i, i + BATCH_SIZE).map(d => ({ ...d, billno }));
      await Promise.all(
        batch.map((d: any) => this.pb.collection('egcsheet1_orddet').create(d).catch((err: any) => {
          console.error('Error creating detail:', err);
          throw err;
        }))
      );
      if (onProgress) {
        onProgress(Math.min(i + BATCH_SIZE, details.length), details.length);
      }
    }
  }

  async getMaxBillno(): Promise<number> {
    const res = await this.pb.collection('egcsheet1_ordsmy')
      .getList(1, 1, { sort: '-billno' });

    if (res.items.length > 0) {
      return parseInt(res.items[0]['billno']) + 1;
    }
    return 1;
  }

  async getPktmasterAll(): Promise<any[]> {
    const res = await this.pb.collection('egcsheet1_pktmst')
      .getList(1, 200, { sort: 'pktname' });

    return res.items;
  }

  async getOrderDetails(headerId: string): Promise<OrderDetail[]> {
    const records = await this.pb.collection('egcsheet1_orddet').getList(1, 100, {
      filter: `billno="${headerId}"`,
      sort: 'srno'
    });

    return records.items.map((r: any) => ({
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

  clearCache(): void {
    console.log('Cache cleared');
  }
}