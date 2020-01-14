import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  @Input()
  user: any

  constructor() { }

  ngOnInit() {}

}
