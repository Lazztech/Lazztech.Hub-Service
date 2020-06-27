import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription, Observable } from 'rxjs';
import { Hub, User, UsersHubsQuery } from 'src/generated/graphql';
import { GoogleMapComponent } from '../components/google-map/google-map.component';
import { AuthService } from '../services/auth/auth.service';
import { HubService } from '../services/hub/hub.service';
import { LocationService } from '../services/location/location.service';
import { NotificationsService } from '../services/notifications/notifications.service';
import { map } from 'rxjs/operators';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  loading = true;
  userHubs: Observable<UsersHubsQuery['usersHubs']>;
  hubs: Hub[] = [];
  user: User;

  subscriptions: Subscription[] = [];
  locationSubscription: Subscription;
  coords: { latitude: number, longitude: number };

  @ViewChild(GoogleMapComponent) child: GoogleMapComponent;

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private platform: Platform,
    private notificationsService: NotificationsService,
    public navCtrl: NavController,
    private hubService: HubService,
    private locationService: LocationService,
    private changeRef: ChangeDetectorRef,
    private logger: NGXLogger,
  ) {
    this.menu.enable(true);
  }

  async doRefresh(event) {
    this.loading = true;
    this.userHubs = await this.hubService.watchUserHubs("network-only").valueChanges.pipe(map(x => x.data && x.data.usersHubs));
    this.loading = false;
    event.target.complete();
  }

  async ngOnInit() {
    this.user = await this.authService.user();

    this.subscriptions.push(
      this.locationService.coords$.subscribe(async x => {
        await this.platform.ready();
        this.coords = { latitude: x.latitude, longitude: x.longitude };
        this.changeRef.detectChanges();
      })
    );

    this.userHubs = this.hubService.watchUserHubs().valueChanges.pipe(map(x => x.data && x.data.usersHubs));

    this.subscriptions.push(
      this.hubService.watchUserHubs().valueChanges.subscribe(x => {
        this.logger.log('loading: ', x.loading);
        this.loading = x.loading;
      })
    );

    this.subscriptions.push(
        this.userHubs.subscribe(x => {
        x.forEach(x => this.hubs.push(x.hub));
      })
    );
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(
      x => x.unsubscribe()
    );
  }

  ngAfterViewInit() {
    this.platform.ready().then(async () => {
      await this.notificationsService.requestWebPushPermission();
    });
  }

  goToAddHubPage() {
    this.navCtrl.navigateForward('add-hub');
  }

  goToHubPage(id: number) {
    this.navCtrl.navigateForward('hub/' + id);
  }

  goToStatusPage() {
    this.navCtrl.navigateForward('status');
  }

  async filterHubs(ev: any) {
    this.userHubs = this.hubService.watchUserHubs("cache-only").valueChanges.pipe(map(x => x.data && x.data.usersHubs));
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.userHubs = this.userHubs.pipe(
        map(x => x.filter(y => y.hub.name.toLowerCase().includes(val.toLowerCase())))
      );
    }
  }

  goToMap() {
    this.navCtrl.navigateForward('map', {
      state: {
        hubCoords: this.coords,
        hubs: this.hubs
      }
    });
  }

}
