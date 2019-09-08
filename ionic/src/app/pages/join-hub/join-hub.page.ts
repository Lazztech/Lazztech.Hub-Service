import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HubService } from 'src/app/services/hub.service';
import jsQR, { QRCode } from "jsqr";
import { BrowserQRCodeReader } from '@zxing/library';


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
    private hubService: HubService
  ) { }

  ngOnInit() {
  }

  async getHubDetails(id: number) {
    this.hub = await this.hubService.hub(id);
  }

  async jsQR_fromBase64(base64: string): Promise<QRCode> {
    return new Promise<QRCode>((resolve, reject) => {
      const image: HTMLImageElement = document.createElement('img');
      image.onload = () => {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        try {
          const imageData: ImageData = context.getImageData(0, 0, image.width, image.height);

          const qrCode: QRCode = jsQR(imageData.data, imageData.width, imageData.height);
          resolve(qrCode);
        } catch (e) {
          alert(`Failed to scan: ${JSON.stringify(e)}`);
          reject(e);
        }
      };
      image.src = base64;
    });
  }

  async scanQR(base64: string): Promise<any> {
    // const result = await this.jsQR_fromBase64(base64).catch(x => alert(`Failed to scan: ${x}`));
    const codeReader = new BrowserQRCodeReader();
    const result = await codeReader.decodeFromImage(undefined, base64);
    if (result)
      return JSON.parse(result.getText());
    else
      alert(`Failed to scan QR code. Try again.`);
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    // this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.photo = image.dataUrl;
    alert(JSON.stringify(image));
    console.log(JSON.stringify(image));

    const result = await this.scanQR(image.dataUrl);
    if (result)
        this.getHubDetails(result.id);
  }

}
