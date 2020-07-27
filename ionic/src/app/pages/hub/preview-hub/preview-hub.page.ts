import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HubQuery, Scalars } from 'src/generated/graphql';
import { HubService } from 'src/app/services/hub/hub.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-preview-hub',
  templateUrl: './preview-hub.page.html',
  styleUrls: ['./preview-hub.page.scss'],
})
export class PreviewHubPage implements OnInit {

  loading = true;
  userHub: Observable<HubQuery['hub']>;
  subscriptions: Subscription[] = [];
  id: Scalars['ID'];

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.userHub = this.hubService.watchHub(this.id).valueChanges.pipe(
      map(x => x.data && x.data.hub)
    );

    this.subscriptions.push(
      this.hubService.watchHub(this.id).valueChanges.subscribe(x => {
        this.loading = x.loading;
      })
    );
  }

  async accept() {

  }

  async reject() {
    
  }

}
