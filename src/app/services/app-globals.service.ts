import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppGlobalsService {
  mtodaydate = signal<string>('');

  setMtodaydate(date: string) {
    this.mtodaydate.set(date);
  }
}