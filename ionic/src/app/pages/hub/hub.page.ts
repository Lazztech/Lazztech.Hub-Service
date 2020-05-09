import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CameraService } from 'src/app/services/camera/camera.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { Scalars, HubQuery } from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.page.html',
  styleUrls: ['./hub.page.scss'],
})
export class HubPage implements OnInit, OnDestroy {

  loading = false;
  userHub: any;
  id: Scalars['ID'];
  qrContent: string;
  locationSubscription: Subscription;
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
  }

  async ionViewDidEnter() {
    this.loading = true;
    await this.loadHub();
    //FIXME this should be refactored into the HubService to avoid repeating code
    this.locationSubscription = this.locationService.coords$.subscribe(async x => {
      await this.platform.ready();
      this.logger.log(x);
      const coords = { latitude: x.latitude, longitude: x.longitude };
      this.logger.log(coords);
      this.userCoords = coords;
      this.changeRef.detectChanges();
    });
    const hubCoords = { 
      latitude: this.userHub.hub.latitude,
      longitude: this.userHub.hub.longitude
    };
    this.hubCoords = hubCoords;
    this.logger.log(this.hubCoords);
    this.loading = false;
  }

  async loadHub() {
    this.userHub = await this.hubService.hub(this.id);
    this.logger.log(JSON.stringify(this.userHub));
  }

  goToPersonPage(id: number, user: any) {
    this.logger.log(user)
    this.navCtrl.navigateForward('person/'+ id, {
      state: {
        user
      }
    });
  }

  goToMap() {
    this.navCtrl.navigateForward('map', {
      state: {
        hubCoords: this.hubCoords,
        hub: this.userHub.hub
      }
    });
  }

  requestRide() {
    window.open(`uber://?client_id=<CLIENT_ID>&action=setPickup&pickup[latitude]=${this.userCoords.latitude}&pickup[longitude]=${this.userCoords.longitude}&pickup[nickname]=Your%20Location&pickup[formatted_address]=1455%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103&dropoff[latitude]=${this.hubCoords.latitude}&dropoff[longitude]=${this.hubCoords.longitude}&dropoff[nickname]=${this.userHub.hub.name}%20Hub&dropoff[formatted_address]=1%20Telegraph%20Hill%20Blvd%2C%20San%20Francisco%2C%20CA%2094133&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383`)
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
    const editHubButton = (this.userHub.isOwner)
    ? {
      text: 'Settings',
      // icon: 'share',
      handler: () => {
        this.navCtrl.navigateForward('edit-hub/'+ this.id);
        this.logger.log('Edit clicked');
      },
    }
    : null ;

    const inviteButton = (this.userHub.isOwner)
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
        {
          //TODO remove this as it's too easy to delete hub
        text: 'Delete',
        role: 'destructive',
        // icon: 'trash',
        handler: async () => {
          this.loading = true;
          const result = await this.hubService.deleteHub(this.id);
          this.loading = false;
          this.navCtrl.back();
          this.logger.log('Delete clicked');
        }
      }, 
        inviteButton,
        editHubButton, 
      {
        text: 'Take Picture',
        // icon: 'arrow-dropright-circle',
        handler: async () => {
          this.logger.log('Take Picture clicked');
          const newImage = await this.cameraService.takePicture();
          this.loading = true;
          const oldImage = this.userHub.image;
          this.userHub.image = newImage;
          const result = await this.hubService.changeHubImage(this.id, newImage);
          if (!result) {
            this.userHub.image = oldImage;
          }
          this.loading = false;
        }
      },
      {
        text: 'Select Picture',
        // icon: 'arrow-dropright-circle',
        handler: async () => {
          this.logger.log('Take Picture clicked');
          const newImage = await this.cameraService.selectPicture();
          this.loading = true;
          const oldImage = this.userHub.image;
          this.userHub.image = newImage;
          const result = await this.hubService.changeHubImage(this.id, newImage);
          if (!result) {
            this.userHub.image = oldImage;
          }
          this.loading = false;
        }
      }, 
      {
        text: this.userHub.starred ? 'Remove Star' : 'Add Star',
        // icon: 'heart',
        handler: async () => {
          let result = false;
          this.loading = true;
          if (this.userHub.starred) {
            result = await this.hubService.setHubNotStarred(this.id);
            this.userHub.starred = false;
          } else {
            result = await this.hubService.setHubStarred(this.id);
            this.userHub.starred = true;
          }

          if (!result) {
            this.userHub.starred = !this.userHub.starred;
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

  async ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

}
