import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-person',
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
})
export class PersonPage implements OnInit, OnDestroy {

  queryParamsSubscription: Subscription;
  id: number;
  user: any;

  constructor(
    public route : ActivatedRoute,
    private router: Router
  ) { 
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
      }
    });
    
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }

}
