import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HubService } from 'src/app/services/hub/hub.service';
import jsQR, { QRCode } from "jsqr";
import { BrowserQRCodeReader } from '@zxing/library';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';


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
    private alertService: AlertService,
    private cameraService: CameraService
  ) { }

  ngOnInit() {
  }

  //TODO verify that I'm dead and remove me.

  async joinHub() {
    const result = await this.hubService.joinHub(this.hub.id);
    if (result)
      this.navCtrl.navigateRoot('hubs');
    else 
      await this.alertService.presentRedToast("Failed to join hub.");
  }

}
