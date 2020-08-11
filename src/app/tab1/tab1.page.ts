import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  public intervalView: number;
  private amountIntervals$: Subscription;
  private intervalsTime$: Subscription;
  private endSound$: Subscription;
  private beforeSound$: Subscription;
  private interval: any;
  private contSTimeout: any;
  private counter: number;
  private activatePlay: boolean;
  private activateStop: boolean;
  private initAmountIntervals: number;
  private endSound: boolean = true;
  private beforeSound: number = 5;
  private amountIntervals: number;
  private intervalsTime: number[] = [];

  constructor(
    private configurationService: ConfigurationService,
    private nativeAudio: NativeAudio) {}

  ngOnInit() {
    this.nativeAudio.preloadSimple('sfx-end', 'assets/end.mp3');
    this.nativeAudio.preloadSimple('sfx-before', 'assets/before2.mp3');
    this.initAmountIntervals = 0;
    this.activateStop = false;
    this.activatePlay = true;
    this.intervalView = 0;
    this.amountIntervals = 1;
    this.intervalsTime = [20];

    this.amountIntervals$ = this.configurationService.getAmountIntervals$().subscribe(
      response => {
        this.amountIntervals = response;
        this.handlerResetAll();
      }
    );

    this.intervalsTime$ = this.configurationService.getIntervalsTime$().subscribe(
      response => {
        this.intervalsTime = response;
        this.handlerResetAll();
      }
    );

    this.endSound$ = this.configurationService.getEndSound$().subscribe(
      response => this.endSound = response
    );

    this.beforeSound$ = this.configurationService.getBeforeSound$().subscribe(
      response => this.beforeSound = response
    );
  }

  handlerPaly() {
    this.start(this.amountIntervals, this.intervalsTime);
  }

  start(amountIntervals: number, intervalsTime: number[]) {
    if (this.activatePlay) {
      this.activatePlay = !this.activatePlay;

      if (this.activateStop) {
        this.activateStop = !this.activateStop;
        this.verifyInterval(this.amountIntervals, this.intervalsTime);
      } else {
        this.intervalView = 0;
        this.counter = 1;
        this.verifyInterval(this.amountIntervals, this.intervalsTime);
      }
    }
  }

  verifyInterval(amountIntervals: number, intervalsTime: number[]) {
    if (this.initAmountIntervals < amountIntervals) {
      this.interval = setInterval(() => {
        this.intervalView++;
        // tslint:disable-next-line:triple-equals
        if ((intervalsTime[this.initAmountIntervals] - this.intervalView) == this.beforeSound) {
          console.log('>>>BEFORE');
          this.nativeAudio.play('sfx-before');
        }

        if (this.counter === intervalsTime[this.initAmountIntervals]) {
          clearInterval(this.interval);
          if (this.endSound) {
            console.log('>>>End');
            this.nativeAudio.play('sfx-end');
          }
          this.initAmountIntervals++;
          if (intervalsTime[this.initAmountIntervals]) {
            this.activatePlay = true;
            this.contSTimeout = setTimeout(() => { this.start(this.amountIntervals, this.intervalsTime); }, 1000);
          }
        }
        this.counter++;
      }, 1000);
    }
  }

  handlerStop() {
    this.activatePlay = this.activateStop = true;
    clearTimeout(this.contSTimeout);
    clearInterval(this.interval);
  }

  handlerResetAll(): any {
    this.activatePlay = true;
    this.activateStop = false;
    clearTimeout(this.contSTimeout);
    clearInterval(this.interval);
    this.intervalView = 0, this.initAmountIntervals = 0;
  }

  ngOnDestroy() {
    this.amountIntervals$.unsubscribe();
    this.intervalsTime$.unsubscribe();
    this.endSound$.unsubscribe();
    this.beforeSound$.unsubscribe();
  }
}
