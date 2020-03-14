import { AfterViewInit, Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { Observable, of, Subscription } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { NotificationsService } from '../services/notifications.service';
import { PwaInstallService } from '../services/pwa-install.service';
import { UpdateService } from '../services/update.service';
import { HubService } from '../services/hub.service';
import { LocationService } from '../services/location.service';
import { GoogleMapComponent } from '../components/google-map/google-map.component';

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
  updateReady = false;
  beforeInstall: Observable<boolean> = of(false);
  inAppNotificationCount = 0;

  locationSubscription: Subscription;
  coords: {latitude: number, longitude: number};
  
  @ViewChild(GoogleMapComponent) child:GoogleMapComponent;
  
  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private updateService: UpdateService,
    private pwaInstallService: PwaInstallService,
    private platform: Platform,
    private notificationsService: NotificationsService,
    public navCtrl: NavController,
    private hubService: HubService,
    private locationService: LocationService,
    private changeRef: ChangeDetectorRef
    ) { 
    this.menu.enable(true);
    this.beforeInstall = pwaInstallService.beforeInstall;
    //FIXME this update service should be replaced
    // this.updateService.checkForUpdate();
    // if (this.updateService.swUpdate.isEnabled) {
    //   this.updateService.updateAvailable = this.updateService.swUpdate.available;
    //   this.updateService.swUpdate.available.subscribe(() => {
    //       // if(confirm("New version available. Load New Version?")) {
    //       //     window.location.reload();
    //       // }

    //       this.updateReady = true;
    //   });
    // }

    // pwaInstallService.showInstallBanner();
  }

  async doRefresh(event) {
    console.log('Begin async operation');
    this.loading = true;
    this.userHubs = await this.hubService.usersHubs("network-only");
    this.loading = false;
    event.target.complete();
  }

  goToNotifications() {
    this.navCtrl.navigateRoot('notifications');
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
  installAppPrompt() {
    this.pwaInstallService.showInstallBanner();
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

}
