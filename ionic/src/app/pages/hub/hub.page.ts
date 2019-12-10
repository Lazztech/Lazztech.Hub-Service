import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HubService } from 'src/app/services/hub.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.page.html',
  styleUrls: ['./hub.page.scss'],
})
export class HubPage implements OnInit {

  image: any;

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
    public navCtrl: NavController
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
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: async () => {
          this.loading = true;
          const result = await this.hubService.deleteHub(this.id);
          this.loading = false;
          this.navCtrl.back();
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, 
      // {
      //   text: 'Play (open modal)',
      //   icon: 'arrow-dropright-circle',
      //   handler: () => {
      //     console.log('Play clicked');
      //   }
      // }, 
      {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.image = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
  }

  async selectPicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    this.image = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
  }

}
