import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';

export interface SalesHeader {
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

  // ✅ HEADER LIST (SAFE MAPPING)
  async getSalesHeaderAll(): Promise<SalesHeader[]> {
    const res = await this.pb.collection('egcsheet1_salesmy')
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

  // ✅ REQUIRED FOR REPORT SCREEN
  async getSalesDetailAll(): Promise<SalesDetail[]> {
    const res = await this.pb.collection('egcsheet1_saledet')
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

  async getSalesDetailByBillno(billno: string): Promise<SalesDetail[]> {
    const records = await this.pb.collection('egcsheet1_saledet').getFullList({
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
    const BATCH_SIZE = 10;
    
    for (let i = 0; i < details.length; i += BATCH_SIZE) {
      const batch = details.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(d => this.pb.collection('egcsheet1_saledet').create(d))
      );
      if (onProgress) {
        onProgress(Math.min(i + BATCH_SIZE, details.length), details.length);
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

  // ✅ Get sales details by header ID (direct query using relation field)
  async getSalesDetails(headerId: string): Promise<SalesDetail[]> {
    console.log('DB Query: getSalesDetails by headerId:', headerId);
    const startTime = Date.now();
    
    const records = await this.pb.collection('egcsheet1_saledet').getList(1, 100, {
      filter: `billno="${headerId}"`,
      sort: 'srno'
    });

    console.log(`DB Query: ${records.items.length} items in ${Date.now() - startTime}ms`);
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

  // ✅ LOGFILE METHODS
  async getLogfileTodayDate(): Promise<string> {
    const logfile = await this.getActiveLogfile();
    return logfile?.todaydate || logfile?.date || '';
  }

  async updateLogfileStatus(startDate: string): Promise<any> {
    return await this.pb.collection('egcsheet1_logfile').update(startDate, { status: 'closed' });
  }

  async createLogfileNextDay(startDate: string): Promise<any> {
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const dateStr = nextDate.toISOString().split('T')[0];
    return await this.pb.collection('egcsheet1_logfile').create({ date: dateStr, status: 'active' });
  }

  async getActiveLogfile(): Promise<any> {
    const res = await this.pb.collection('egcsheet1_logfile').getList(1, 1, {
      filter: 'status="active"',
      sort: '-created'
    });
    return res.items[0] || null;
  }

  // ✅ CACHE CLEAR (placeholder for future implementation)
  clearCache(): void {
    console.log('Cache cleared');
  }
}