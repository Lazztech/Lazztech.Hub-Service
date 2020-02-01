import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-activity-dot',
  templateUrl: './activity-dot.component.html',
  styleUrls: ['./activity-dot.component.scss'],
})
export class ActivityDotComponent implements OnInit {

  @Input()
  active = false;

  private green = false;
  private orange = false;
  private grey = false;

  constructor() { }

  ngOnInit() {
    if (this.active) {
      this.green = true;
    }
    else if (!this.active) {
      this.grey = true;
    }
  }

}
