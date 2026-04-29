import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DmsLogfileService {
  private pb = PocketbaseService.getInstance().getClient();

  private async ensureAuthenticated(): Promise<void> {
    if (!this.pb.authStore.isValid) {
      try {
        await this.pb
          .collection('_superusers')
          .authWithPassword(environment.pocketbaseAdminEmail, environment.pocketbaseAdminPassword);
      } catch (e1) {
        try {
          await (this.pb as any).admins?.authWithPassword(
            environment.pocketbaseAdminEmail,
            environment.pocketbaseAdminPassword,
          );
        } catch (e2) {
          console.error('Failed to authenticate:', e2);
        }
      }
    }
  }

  async getLogfileTodayDate(): Promise<string> {
    try {
      const res = await this.pb
        .collection('dms_logfile')
        .getList(1, 1, { filter: 'status=false', sort: '-created' });

      if (res.items.length > 0) {
        const todaydate = res.items[0]['todaydate'] || '';
        if (todaydate) {
          const date = new Date(todaydate);
          return date.toISOString().split('T')[0];
        }
        return '';
      }
    } catch (e) {
      console.error('Error getting logfile todaydate:', e);
    }
    return '';
  }

  async getActiveLogfile(): Promise<any> {
    try {
      const res = await this.pb
        .collection('dms_logfile')
        .getList(1, 1, { filter: 'status=false', sort: '-created' });

      if (res.items.length > 0) {
        const logfile = res.items[0] as any;
        const todaydate = logfile['todaydate'] || '';
        if (todaydate) {
          const date = new Date(todaydate);
          logfile['normalizedDate'] = date.toISOString().split('T')[0];
        }
        return logfile;
      }
    } catch (e) {
      console.error('Error getting active logfile:', e);
    }
    return null;
  }

  async updateLogfileStatus(todaydate: string): Promise<{ success: boolean; error: string }> {
    try {
      await this.ensureAuthenticated();

      const nextDay = new Date(todaydate);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split('T')[0];

      const res = await this.pb.collection('dms_logfile').getList(1, 1, {
        filter: `todaydate >= "${todaydate}" && todaydate < "${nextDayStr}"`,
        sort: '-created',
      });

      if (res.items.length === 0) {
        return { success: false, error: 'No logfile found for date: ' + todaydate };
      }

      const logfile = res.items[0] as any;
      await this.pb.collection('dms_logfile').update(logfile.id, { status: true });
      return { success: true, error: '' };
    } catch (e: any) {
      const errorMsg = e?.response?.message || e?.message || 'Unknown error';
      console.error('Error updating logfile status:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  async createLogfileNextDay(currentDate: string): Promise<void> {
    try {
      await this.ensureAuthenticated();
      const current = new Date(currentDate);
      const nextDate = new Date(current);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextDateStr = nextDate.toISOString().split('T')[0];

      await this.pb.collection('dms_logfile').create({
        todaydate: nextDateStr,
        status: false,
      });
    } catch (e) {
      console.error('Error creating next day logfile:', e);
    }
  }

  async initializeLogfileIfNeeded(): Promise<void> {
    try {
      const existing = await this.getActiveLogfile();
      if (!existing) {
        const today = new Date().toISOString().split('T')[0];
        await this.pb.collection('dms_logfile').create({
          todaydate: today,
          status: false,
        });
      }
    } catch (e) {
      console.error('Error initializing logfile:', e);
    }
  }
}