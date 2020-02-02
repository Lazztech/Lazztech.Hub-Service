import { Component, OnInit, Input, ViewChild, OnChanges, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-activity-dot',
  templateUrl: './activity-dot.component.html',
  styleUrls: ['./activity-dot.component.scss'],
})
export class ActivityDotComponent implements OnInit, OnChanges {

  @Input()
  active = false;

  private green = false;
  private orange = false;
  private grey = false;

  constructor(
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.setColor();
  }

  ngOnChanges() {
    this.setColor();
    this.changeRef.detectChanges();
  }

  private setColor() {
    if (this.active) {
      this.green = true;
      this.grey = false;
    }
    else if (!this.active) {
      this.grey = true;
      this.green = false;
    }
  }

}
