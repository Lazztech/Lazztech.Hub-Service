import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HubService } from 'src/app/services/hub/hub.service';
import { User } from 'src/generated/graphql';

@Component({
  selector: 'app-person',
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
})
export class PersonPage implements OnInit, OnDestroy {

  loading = false;
  queryParamsSubscription: Subscription;
  id: any;
  user: User;

  userHubs = [];

  constructor(
    private route : ActivatedRoute,
    private router: Router,
    private hubService: HubService
  ) { 
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
      }
    });
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
  }

  async ngOnInit() {
    this.loading = true;
    this.userHubs = await this.hubService.commonUsersHubs(this.id);
    this.loading = false;
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }

}
