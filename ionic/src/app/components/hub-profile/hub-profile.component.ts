import { Component, OnInit, Input } from '@angular/core';
import { Hub } from 'src/generated/graphql';

@Component({
  selector: 'app-hub-profile',
  templateUrl: './hub-profile.component.html',
  styleUrls: ['./hub-profile.component.scss'],
})
export class HubProfileComponent implements OnInit {

  @Input()
  hub: Hub

  constructor() { }

  ngOnInit() {}

}
