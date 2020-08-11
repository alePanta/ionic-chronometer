import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private intervals: number;
  private interTime: number[] = [];
  private intervalsTime$ = new Subject();
  private intervals$ = new Subject();
  private endSound$ = new Subject();
  private beforeSound$ = new Subject();

  constructor() { }

  set amountIntervals(val: number) {
    this.intervals = val;
    this.intervals$.next(this.intervals);
  }

  set setEndSound(val: boolean) {
    this.endSound$.next(val);
  }

  set setBeforeSound(val: number) {
    this.beforeSound$.next(val);
  }

  getAmountIntervals$(): Observable<any> {
    return this.intervals$.asObservable();
  }

  getEndSound$(): Observable<any> {
    return this.endSound$.asObservable();
  }

  getBeforeSound$(): Observable<any> {
    return this.beforeSound$.asObservable();
  }

  set intervalsTime(val: number[]) {
    this.interTime = val;
    this.intervalsTime$.next(this.interTime);
  }

  getIntervalsTime$(): Observable<any> {
    return this.intervalsTime$.asObservable();
  }
}
