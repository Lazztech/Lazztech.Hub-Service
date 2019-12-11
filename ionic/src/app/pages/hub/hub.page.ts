import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HubService } from 'src/app/services/hub.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.page.html',
  styleUrls: ['./hub.page.scss'],
})
export class HubPage implements OnInit {

  // image: any;

  loading = false;
  hub: any;
  id: number;
  qrContent: string;
  coords: { latitude: number, longitude: number };

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private hubService: HubService,
    public actionSheetController: ActionSheetController,
    public navCtrl: NavController,
    public cameraService: CameraService
  ) { }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.qrContent = JSON.stringify({ id: this.id });
  }

  async ionViewDidEnter() {
    this.loading = true;
    await this.loadHub();
    const coords = { 
      latitude: this.hub.latitude,
      longitude: this.hub.longitude
    };
    this.coords = coords;
    console.log(this.coords);
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

}
