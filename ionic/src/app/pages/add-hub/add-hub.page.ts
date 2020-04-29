import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeolocationPosition, Plugins } from '@capacitor/core';
import { NavController, Platform } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera.service';
import { GeofenceService } from 'src/app/services/geofence.service';
import { HubService } from 'src/app/services/hub.service';
import { LocationService } from 'src/app/services/location.service';


const { Geolocation } = Plugins;

@Component({
  selector: 'app-add-hub',
  templateUrl: './add-hub.page.html',
  styleUrls: ['./add-hub.page.scss'],
})
export class AddHubPage implements OnInit, OnDestroy {

  loading = true;
  image: any;
  paid = false;
  myForm: FormGroup;

  locationSubscription: Subscription;
  coords: {latitude: number, longitude: number};

  get hubName() {
    return this.myForm.get('hubName');
  }

  get hubDescription() {
    return this.myForm.get('hubDescription');
  }

  constructor(
    private hubService: HubService,
    private geofenceService: GeofenceService,
    private locationService: LocationService,
    private alertService: AlertService,
    private platform: Platform,
    private fb: FormBuilder,
    public navCtrl: NavController,
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

    this.myForm.valueChanges.subscribe();
  }

  async ionViewDidEnter() {
        //FIXME this should be refactored into the HubService to avoid repeating code
    this.coords = await this.locationService.coords$.pipe(take(1)).toPromise();
    this.loading = false;
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
    console.log(this.coords);
    const result = await this.hubService.createHub(
      formValue.hubName,
      formValue.description,
      this.image,
      this.coords.latitude,
      this.coords.longitude
    );
    if (result) {
      this.loading = false;
      await this.geofenceService.addGeofence({
        identifier: JSON.stringify({
          id: result.id,
          name: result.name
        }),
        latitude: this.coords.latitude,
        longitude: this.coords.longitude,
        notifyOnEntry: true,
        notifyOnExit: true
      });
      await this.navCtrl.navigateRoot('tabs/');
      await this.alertService.presentToast("Created Hub!");
    } else {
      this.loading = false;
      this.alertService.presentRedToast("Failed to create Hub.");
    }
  }

  async ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

}
