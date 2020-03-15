import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { AlertService } from 'src/app/services/alert.service';
import { Plugins, CameraResultType, CameraSource, GeolocationPosition, Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HubService } from 'src/app/services/hub.service';
import { NavController } from '@ionic/angular';

import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap, take } from 'rxjs/operators';
import { CameraService } from 'src/app/services/camera.service';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-add-hub',
  templateUrl: './add-hub.page.html',
  styleUrls: ['./add-hub.page.scss'],
})
export class AddHubPage implements OnInit {

  loading = true;
  image: any;
  paid = false;
  //FIXME: make this observable based & refactor
  coordinates$: Observable<GeolocationPosition>;
  // coordinates: Promise<{ lat: number; lng: number }> = Geolocation.getCurrentPosition().then(x => {
  //   const result = {
  //     lat: x.coords.latitude,
  //     lng: x.coords.longitude
  //   }
  //   console.log(result);
  //   this.loading = false;
  //   return result;
  // });

  defaultPos: { lat: number; lng: number } = {
    lat: 47.5421318,
    lng: -122.1755343
  };

  myForm: FormGroup;

  get hubName() {
    return this.myForm.get('hubName');
  }

  get hubDescription() {
    return this.myForm.get('hubDescription');
  }

  constructor(
    private hubService: HubService,
    private alertService: AlertService,
    private fb: FormBuilder,
    public navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private cameraService: CameraService
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      hubName: ['', [
        Validators.required
      ]],
      hubDescription: ['', [
        Validators.required
      ]]
    });

    this.getCurrentPosition().then(() => this.loading = false);
    this.myForm.valueChanges.subscribe();
  }

  async getCurrentPosition() {
    // const isAvailable = Capacitor.isPluginAvailable('GeoLocation');
    // //FIXME: this should have an else clause
    // if (isAvailable) {
      const coordinates = Geolocation.getCurrentPosition();
      // console.log(coordinates);
      this.coordinates$ = fromPromise(coordinates).pipe(
        switchMap((data: any) => of(data.coords)),
        tap(data => console.log(data))
      );
      // this.loading = false;
      return coordinates;
    // }
  }

  async takePicture() {
    const image = await this.cameraService.takePicture()
    this.image = image;
  }

  async selectPicture() {
    const image = await this.cameraService.selectPicture();
    this.image = image;
  }



  isFree() {
    if (this.paid) {
      this.paid = false;
    }
  }

  isPaid() {
    if (!this.paid) {
      this.paid = true;
    }
  }

  async saveHub() {
    this.loading = true;

    const formValue = this.myForm.value;
    //FIXME: add latitude and longitude
    const coords = await this.coordinates$.pipe(take(1)).toPromise() as any;
    console.log(coords);
    const result = await this.hubService.createHub(
      formValue.hubName,
      formValue.description,
      this.image,
      coords.latitude,
      coords.longitude
      );
    if (result) {
      this.loading = false;
      this.navCtrl.navigateRoot('tabs/hubs');
      this.alertService.presentToast("Created Hub!");
    } else {
      this.loading = false;
      this.alertService.presentRedToast("Failed to create Hub.");
    }
  }


}
