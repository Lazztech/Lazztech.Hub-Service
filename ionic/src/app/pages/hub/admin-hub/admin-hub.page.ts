import { Component, OnInit } from '@angular/core';
import { Hub, JoinUserHub, HubQuery, Scalars } from 'src/generated/graphql';
import { HubService } from 'src/app/services/hub/hub.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-hub',
  templateUrl: './admin-hub.page.html',
  styleUrls: ['./admin-hub.page.scss'],
})
export class AdminHubPage implements OnInit {

  loading = true;
  userHub: HubQuery['hub'];
  id: Scalars['ID'];

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.userHub = await this.hubService.hub(this.id,
      "network-only"
    );
    this.loading = false;
  }

}
