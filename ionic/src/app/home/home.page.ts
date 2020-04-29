import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/generated/graphql';
import { GoogleMapComponent } from '../components/google-map/google-map.component';
import { AuthService } from '../services/auth/auth.service';
import { HubService } from '../services/hub/hub.service';
import { LocationService } from '../services/location/location.service';
import { NotificationsService } from '../services/notifications/notifications.service';
import { UpdateService } from '../services/update/update.service';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  loading = true;
  userHubs = [];
  hubs = [];
  user: User;

  locationSubscription: Subscription;
  coords: {latitude: number, longitude: number};
  
  @ViewChild(GoogleMapComponent) child:GoogleMapComponent;
  
  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private updateService: UpdateService,
    private platform: Platform,
    private notificationsService: NotificationsService,
    public navCtrl: NavController,
    private hubService: HubService,
    private locationService: LocationService,
    private changeRef: ChangeDetectorRef
    ) { 
    this.menu.enable(true);
  }

  async doRefresh(event) {
    console.log('Begin async operation');
    this.loading = true;
    this.userHubs = await this.hubService.usersHubs("network-only");
    this.loading = false;
    event.target.complete();
  }

  async ionViewDidEnter() {
    this.user = await this.authService.user();
    this.locationSubscription = this.locationService.coords$.subscribe(async x => {
      await this.platform.ready();
      console.log(x);
      const coords = { latitude: x.latitude, longitude: x.longitude };
      console.log(coords);
      this.coords = coords;
      this.changeRef.detectChanges();
    });
    this.userHubs = await this.hubService.usersHubs();
    for (let index = 0; index < this.userHubs.length; index++) {
      const userHub = this.userHubs[index];
      this.hubs.push(userHub.hub);
    }
    this.loading = false;
  }

  async ngOnInit() {
    
  }

  async ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.platform.ready().then(async () => {
       await this.notificationsService.requestWebPushPermission();
    });
  }

  //TODO remove me
  update() {
    console.log('updating...');
    this.updateService.updateToLatest();
  }

  goToAddHubPage() {
    this.navCtrl.navigateForward('add-hub/join-hub');
  }

  goToHubPage(id: number) {
    this.navCtrl.navigateForward('hub/'+ id);
  }

  async filterHubs(ev:any) {
    this.userHubs = await this.hubService.usersHubs("cache-only");
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.userHubs = this.userHubs.filter(x => {
        console.log(x.hub.name.toLowerCase())
        return x.hub.name.toLowerCase().includes(val.toLowerCase())
      })
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
