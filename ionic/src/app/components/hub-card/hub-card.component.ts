import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hub-card',
  templateUrl: './hub-card.component.html',
  styleUrls: ['./hub-card.component.scss'],
})
export class HubCardComponent implements OnInit {

  @Input()
  hub: any

  constructor() { }

  ngOnInit() {}

}
