import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public intervalsLabel: string[] = [];
  public intervalsAmount: any[] = new Array(100);
  public seconds: any[] = new Array(180);
  private secondsBeforeSound: number = 5;
  private intervalsTime: number[] = [];
  public isDisabledBefore: boolean = false;

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit() {
    this.intervalsLabel.push('Interval 1');
    this.intervalsTime.push(20);
  }

  changeAmount(e: any) {
    this.configurationService.amountIntervals = e.detail.value;

    this.intervalsTime.splice(e.detail.value);
    this.intervalsLabel = [];
    for (let index = 0; index < e.detail.value; index++) {
      const label = `Interval ${(index + 1)}`;
      if (!this.intervalsTime[index]) {
        this.intervalsTime.push(20);
      }
      this.intervalsLabel.push(label);
    }
    this.configurationService.intervalsTime = this.intervalsTime;
  }

  changeIntervalTime(data: any) {
    this.intervalsTime[data.target.dataset.index] = Number(data.detail.value);
    this.configurationService.intervalsTime = this.intervalsTime;
  }

  changeSoundBeforeEndInterval(val: any) {
    this.secondsBeforeSound = val.detail.value;
    this.configurationService.setBeforeSound = this.secondsBeforeSound;
  }

  handlerFXEndChange(state: any) {
    this.configurationService.setEndSound = state.detail.checked;
  }

  handlerFXBeforeEndChange(state: any) {
    this.isDisabledBefore = !state.detail.checked;
    if (state.detail.checked) {
      this.configurationService.setBeforeSound = this.secondsBeforeSound;
    } else {
      this.configurationService.setBeforeSound = 100;
    }
  }
}
