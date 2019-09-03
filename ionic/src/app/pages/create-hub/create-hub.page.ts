import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { AlertService } from 'src/app/services/alert.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HubService } from 'src/app/services/hub.service';

@Component({
  selector: 'app-create-hub',
  templateUrl: './create-hub.page.html',
  styleUrls: ['./create-hub.page.scss'],
})
export class CreateHubPage implements OnInit {

  image: any;

  loading = false;

  myForm: FormGroup;

  get hubName() {
    return this.myForm.get('hubName');
  }

  constructor(
    private hubService: HubService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      hubName: ['', [
        Validators.required
      ]]
    });

    this.myForm.valueChanges.subscribe();
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

  async saveHub() {
    this.loading = true;

    const formValue = this.myForm.value;

    const result = await this.hubService.createHub(formValue.hubName, this.image);
    if (result) {
      this.loading = false;
      this.alertService.presentToast("Created Hub!");
    } else {
      this.loading = false;
      this.alertService.presentRedToast("Failed to create Hub.");
    }
  }

}
