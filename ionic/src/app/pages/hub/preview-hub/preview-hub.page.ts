import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HubQuery, Scalars } from 'src/generated/graphql';
import { HubService } from 'src/app/services/hub/hub.service';
import { map, take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

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
  hubCoords: {latitude: number, longitude: number};

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
    public navCtrl: NavController,
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

    this.subscriptions.push(
      this.userHub.subscribe(userHub => {
        this.hubCoords = { 
          latitude: userHub.hub.latitude,
          longitude: userHub.hub.longitude
        };
      })
    );
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async goToMap() {
    this.userHub.pipe(take(1)).subscribe(userHub => {
      this.navCtrl.navigateForward('map', {
        state: {
          hubCoords: this.hubCoords,
          hub: userHub.hub
        }
      });
    });
  }

  async accept() {

  }

  async reject() {

  }

}
