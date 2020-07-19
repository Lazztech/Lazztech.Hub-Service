import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { CameraService } from 'src/app/services/camera/camera.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { Scalars, HubQuery, JoinUserHub } from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.page.html',
  styleUrls: ['./hub.page.scss'],
})
export class HubPage implements OnInit, OnDestroy {

  loading = true;
  userHub: Observable<HubQuery['hub']>;
  id: Scalars['ID'];
  qrContent: string;
  subscriptions: Subscription[] = [];
  hubCoords: {latitude: number, longitude: number};
  userCoords: {latitude: number, longitude: number};

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
    public actionSheetController: ActionSheetController,
    public navCtrl: NavController,
    public cameraService: CameraService,
    private platform: Platform,
    private changeRef: ChangeDetectorRef,
    private locationService: LocationService,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.qrContent = JSON.stringify({ id: this.id });

    this.loadHub();
  }

  async ionViewDidEnter() {
    //FIXME this should be refactored into the HubService to avoid repeating code
    this.subscriptions.push(
      this.locationService.coords$.subscribe(async x => {
        await this.platform.ready();
        this.userCoords = { latitude: x.latitude, longitude: x.longitude };
        this.changeRef.detectChanges();
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

  loadHub() {
    this.userHub = this.hubService.watchHub(this.id).valueChanges.pipe(
      map(x => x.data && x.data.hub)
    );

    this.subscriptions.push(
      this.hubService.watchHub(this.id).valueChanges.subscribe(x => {
        this.loading = x.loading;
      })
    );
  }

  goToPersonPage(id: number, user: any) {
    this.navCtrl.navigateForward('person/'+ id, {
      state: {
        user
      }
    });
  }

  async goToMap() {
    const userHub = await this.userHub.toPromise();
    this.navCtrl.navigateForward('map', {
      state: {
        hubCoords: this.hubCoords,
        hub: userHub.hub
      }
    });
  }

  async requestRide(userHub: JoinUserHub) {
    console.log(userHub.hub.name);
    window.open(`uber://?client_id=<CLIENT_ID>&action=setPickup&pickup[latitude]=${this.userCoords.latitude}&pickup[longitude]=${this.userCoords.longitude}&pickup[nickname]=Your%20Location&pickup[formatted_address]=1455%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103&dropoff[latitude]=${this.hubCoords.latitude}&dropoff[longitude]=${this.hubCoords.longitude}&dropoff[nickname]=${userHub.hub.name}%20Hub&dropoff[formatted_address]=1%20Telegraph%20Hill%20Blvd%2C%20San%20Francisco%2C%20CA%2094133&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383`)
  }

  navigate() {
    if (this.platform.is('ios')) {
      window.open(`http://maps.apple.com/?saddr=${this.userCoords.latitude},${this.userCoords.longitude}&daddr=${this.hubCoords.latitude},${this.hubCoords.longitude}&dirflg=d`)
    } 
    else if (this.platform.is('android')) {
      //TODO implement for android
    }
  }

  async presentActionSheet() {
    const userHub = await this.userHub.toPromise();
    const editHubButton = (userHub.isOwner)
    ? {
      text: 'Settings',
      // icon: 'share',
      handler: () => {
        this.navCtrl.navigateForward('admin-hub/'+ this.id);
        this.logger.log('Settings clicked');
      },
    }
    : null ;

    const inviteButton = (userHub.isOwner)
    ? {
      text: 'Invite',
      // icon: 'share',
      handler: () => {
        this.navCtrl.navigateForward('invite/'+ this.id);
        this.logger.log('Invite clicked');
      }
    }
    : null ;

    const actionSheet = await this.actionSheetController.create({
      // header: 'Albums',
      buttons: [
        inviteButton,
        editHubButton, 
      {
        text: userHub.starred ? 'Remove Star' : 'Add Star',
        handler: async () => {
          let result = false;
          this.loading = true;
          if (userHub.starred) {
            result = await this.hubService.setHubNotStarred(this.id);
            //FIXME in apollo cache
            // this.userHub.starred = false;
          } else {
            result = await this.hubService.setHubStarred(this.id);
            //FIXME in apollo cache
            // this.userHub.starred = true;
          }

          if (!result) {
            //FIXME in apollo cache
            // this.userHub.starred = !this.userHub.starred;
          }

          this.loading = false;
          this.logger.log('Star clicked');
        }
      },
      {
        text: 'Cancel',
        // icon: 'close',
        role: 'cancel',
        handler: () => {
          this.logger.log('Cancel clicked');
        }
      }
    ].filter((item) => item !== null)
    });
    await actionSheet.present();
  }

}
