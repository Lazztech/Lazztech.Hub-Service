import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CameraService } from 'src/app/services/camera.service';
import { HubService } from 'src/app/services/hub.service';
import { LocationService } from 'src/app/services/location.service';
import { ActionSheetButton } from '@ionic/core'; 
import { ActionSheetOption, ActionSheetOptions } from '@capacitor/core';
import { GoogleMapComponent } from 'src/app/components/google-map/google-map.component';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.page.html',
  styleUrls: ['./hub.page.scss'],
})
export class HubPage implements OnInit, OnDestroy {

  // image: any;

  loading = false;
  userHub: any;
  id: number;
  qrContent: string;
  locationSubscription: Subscription;
  hubCoords: {latitude: number, longitude: number};
  userCoords: {latitude: number, longitude: number};

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private hubService: HubService,
    public actionSheetController: ActionSheetController,
    public navCtrl: NavController,
    public cameraService: CameraService,
    private platform: Platform,
    private changeRef: ChangeDetectorRef,
    private locationService: LocationService,
  ) { }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.qrContent = JSON.stringify({ id: this.id });
  }

  async ionViewDidEnter() {
    this.loading = true;
    await this.loadHub();
    //FIXME this should be refactored into the HubService to avoid repeating code
    this.locationSubscription = this.locationService.coords$.subscribe(async x => {
      await this.platform.ready();
      console.log(x);
      const coords = { latitude: x.latitude, longitude: x.longitude };
      console.log(coords);
      this.userCoords = coords;
      this.changeRef.detectChanges();
    });
    const hubCoords = { 
      latitude: this.userHub.hub.latitude,
      longitude: this.userHub.hub.longitude
    };
    this.hubCoords = hubCoords;
    console.log(this.hubCoords);
    this.loading = false;
  }

  async loadHub() {
    this.userHub = await this.hubService.hub(this.id);
    console.log(JSON.stringify(this.userHub));
  }

  goToPersonPage(id: number, user: any) {
    console.log(user)
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

  async presentActionSheet() {
    const editHubButton = (this.userHub.isOwner)
    ? {
      text: 'Settings',
      // icon: 'share',
      handler: () => {
        this.navCtrl.navigateForward('edit-hub/'+ this.id);
        console.log('Edit clicked');
      },
    }
    : null ;

    const inviteButton = (this.userHub.isOwner)
    ? {
      text: 'Invite',
      // icon: 'share',
      handler: () => {
        this.navCtrl.navigateForward('invite/'+ this.id);
        console.log('Invite clicked');
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
          console.log('Delete clicked');
        }
      }, 
        inviteButton,
        editHubButton, 
      {
        text: 'Take Picture',
        // icon: 'arrow-dropright-circle',
        handler: async () => {
          console.log('Take Picture clicked');
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
          console.log('Take Picture clicked');
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
          console.log('Star clicked');
        }
      },
      {
        text: 'Cancel',
        // icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
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
