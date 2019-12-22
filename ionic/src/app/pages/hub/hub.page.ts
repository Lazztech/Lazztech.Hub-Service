import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HubService } from 'src/app/services/hub.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { Subscription } from 'rxjs';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.page.html',
  styleUrls: ['./hub.page.scss'],
})
export class HubPage implements OnInit, OnDestroy {

  // image: any;

  loading = false;
  hub: any;
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
    private locationService: LocationService
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
      latitude: this.hub.latitude,
      longitude: this.hub.longitude
    };
    this.hubCoords = hubCoords;
    console.log(this.hubCoords);
    this.loading = false;
  }

  async loadHub() {
    this.hub = await this.hubService.hub(this.id);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Albums',
      buttons: [
        {
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
      {
        text: 'Share',
        // icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, 
      {
        text: 'Take Picture',
        // icon: 'arrow-dropright-circle',
        handler: async () => {
          console.log('Take Picture clicked');
          const newImage = await this.cameraService.takePicture();
          this.loading = true;
          const oldImage = this.hub.image;
          this.hub.image = newImage;
          const result = await this.hubService.updateHubPhoto(this.id, newImage);
          if (!result) {
            this.hub.image = oldImage;
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
          const oldImage = this.hub.image;
          this.hub.image = newImage;
          const result = await this.hubService.updateHubPhoto(this.id, newImage);
          if (!result) {
            this.hub.image = oldImage;
          }
          this.loading = false;
        }
      }, 
      {
        text: this.hub.starred ? 'Remove Star' : 'Add Star',
        // icon: 'heart',
        handler: async () => {
          let result = false;
          this.loading = true;
          if (this.hub.starred) {
            result = await this.hubService.setHubNotStarred(this.id);
            this.hub.starred = false;
          } else {
            result = await this.hubService.setHubStarred(this.id);
            this.hub.starred = true;
          }

          if (!result) {
            this.hub.starred = !this.hub.starred;
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
    ]
    });
    await actionSheet.present();
  }

  async ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

}
