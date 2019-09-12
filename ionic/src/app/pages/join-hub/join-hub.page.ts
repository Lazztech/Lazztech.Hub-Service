import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HubService } from 'src/app/services/hub.service';
import jsQR, { QRCode } from "jsqr";
import { BrowserQRCodeReader } from '@zxing/library';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-join-hub',
  templateUrl: './join-hub.page.html',
  styleUrls: ['./join-hub.page.scss'],
})
export class JoinHubPage implements OnInit {

  photo: any;

  loading = false;
  hub: any;

  constructor(
    private sanitizer: DomSanitizer,
    private hubService: HubService,
    private navCtrl: NavController,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  async getHubByQRImage(qrImageB64: string) {
    const hub = await this.hubService.getHubByQRImage(qrImageB64);
    return hub;
  }

  async joinHub() {
    const result = await this.hubService.joinHub(this.hub.id);
    if (result)
      this.navCtrl.navigateRoot('hubs');
    else 
      await this.alertService.presentRedToast("Failed to join hub.");
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      height: 200,
      width: 200
    });

    // this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.photo = image.dataUrl;
    console.log(this.photo);
    const hub = await this.getHubByQRImage(image.dataUrl);
    if (hub)
      this.hub = hub;
    else
      alert(`Failed to scan QR code. Try again.`);
  }

}
