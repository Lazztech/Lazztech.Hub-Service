import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.page.html',
  styleUrls: ['./add-person.page.scss'],
})
export class AddPersonPage implements OnInit {

  photo: any;

  constructor(
    private sanitizer: DomSanitizer,
    private cameraService: CameraService
  ) { }

  ngOnInit() {
  }

  async takePicture() {
    const image = this.cameraService.takePicture();
    this.photo = image;
  }

}
