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
  pktname?: string; // ✅ optional (UI use)
  qty: number;
  weight: number;
  rate: number;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class GcsheetSaleinvServicecopy {
  private pb = PocketbaseService.getInstance().getClient();

  // ✅ HEADER LIST (SAFE MAPPING)
  async getSalesHeaderAll(): Promise<SalesHeader[]> {
    const res = await this.pb.collection('egcsheet1_salesmy')
      .getList(1, 200, { sort: '-created' });

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
      nettamount: r.nettamount || 0
    }));
  }

  // ✅ REQUIRED FOR REPORT SCREEN
  async getSalesDetailAll(): Promise<SalesDetail[]> {
    const res = await this.pb.collection('egcsheet1_saledet')
      .getList(1, 500, { sort: 'billno,srno' });

    return res.items.map((r: any) => ({
      id: r.id,
      billno: r.billno,
      pktno: r.pktno,
      qty: +r.qty || 0,
      weight: +r.weight || 0,
      rate: +r.rate || 0,
      amount: +r.amount || 0
    }));
  }

  async getSalesDetailByBillno(billno: string): Promise<SalesDetail[]> {
    const records = await this.pb.collection('egcsheet1_saledet').getFullList({
      filter: `billno="${billno}"`,
      sort: 'srno'
    });

    return records.map((r: any) => ({
      id: r.id,
      billno: r.billno,
      pktno: r.pktno,
      qty: +r.qty || 0,
      weight: +r.weight || 0,
      rate: +r.rate || 0,
      amount: +r.amount || 0
    }));
  }

  // ✅ FAST DELETE
  async deleteSalesDetailsByBillno(billno: string): Promise<boolean> {
    try {
      const details = await this.getSalesDetailByBillno(billno);

      await Promise.all(
        details.map(d =>
          this.pb.collection('egcsheet1_saledet').delete(d.id)
        )
      );

      return true;
    } catch {
      return false;
    }
  }

  async createSalesHeader(data: any) {
    console.log('Service creating header with data:', JSON.stringify(data, null, 2));
    const result = await this.pb.collection('egcsheet1_salesmy').create(data);
    console.log('Service create result:', JSON.stringify(result, null, 2));
    return result;
  }

  async updateSalesHeader(id: string, data: any) {
    return await this.pb.collection('egcsheet1_salesmy').update(id, data);
  }

  async deleteSalesHeader(id: string) {
    return await this.pb.collection('egcsheet1_salesmy').delete(id);
  }

  // ✅ FAST INSERT - Sequential batches for remote servers
  async createSalesDetailsBatch(details: any[], onProgress?: (done: number, total: number) => void) {
    const BATCH_SIZE = 5;
    const DELAY_BETWEEN_BATCHES = 100;
    
    for (let i = 0; i < details.length; i += BATCH_SIZE) {
      const batch = details.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(d => this.pb.collection('egcsheet1_saledet').create(d))
      );
      if (onProgress) {
        onProgress(Math.min(i + BATCH_SIZE, details.length), details.length);
      }
      if (i + BATCH_SIZE < details.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }
  }

  async getMaxBillno(): Promise<number> {
    const res = await this.pb.collection('egcsheet1_salesmy')
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
}