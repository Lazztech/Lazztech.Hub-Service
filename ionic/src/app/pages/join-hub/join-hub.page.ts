import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import QrScanner from 'qr-scanner';
QrScanner.WORKER_PATH = './assets/qr-scanner-worker.min.js';


@Component({
  selector: 'app-join-hub',
  templateUrl: './join-hub.page.html',
  styleUrls: ['./join-hub.page.scss'],
})
export class JoinHubPage implements OnInit {

  photo: any;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  async scanQR(base64: string) {
    const blob = this.b64toBlob(base64);
    QrScanner.scanImage(this.photo)
    .then(result => console.log(result))
    .catch(error => console.log(error || 'No QR code found.'));
  }

  b64toBlob(b64Data, contentType='', sliceSize=512) {
    const byteCharacters = atob(b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    // this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.photo = image.dataUrl;

    this.scanQR(image.dataUrl);
  }

}
