import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HubService } from 'src/app/services/hub/hub.service';
import { HubQuery, Scalars, JoinUserHub, InvitesByHubQuery } from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { NavController, ActionSheetController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera/camera.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-hub',
  templateUrl: './admin-hub.page.html',
  styleUrls: ['./admin-hub.page.scss'],
})
export class AdminHubPage implements OnInit {

  loading = true;
  userHub: Observable<HubQuery['hub']>;
  invites: Observable<InvitesByHubQuery['invitesByHub']>;
  subscriptions: Subscription[] = [];
  id: Scalars['ID'];

  myForm: FormGroup;

  get hubName() {
    return this.myForm.get('hubName');
  }

  get hubDescription() {
    return this.myForm.get('hubDescription');
  }

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
    private fb: FormBuilder,
    private logger: NGXLogger,
    private navCtrl: NavController,
    private actionSheetController: ActionSheetController,
    private cameraService: CameraService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.loadHub();

    this.myForm = this.fb.group({
      hubName: ['', [
        Validators.required,
        Validators.maxLength(25)
      ]],
      hubDescription: ['', [
        Validators.required,
        Validators.maxLength(25)
      ]]
    });
  }

  loadHub() {
    this.userHub = this.hubService.watchHub(this.id).valueChanges.pipe(
      map(x => x.data && x.data.hub)
    );

    this.subscriptions.push(
      this.hubService.watchHub(this.id).valueChanges.subscribe(x => {
        this.loading = x.loading;
      })
    );

    this.invites = this.hubService.watchInvitesByHub(this.id).valueChanges.pipe(
      map(x => x.data && x.data.invitesByHub)
    );
  }

  async save() {
    this.loading = true;
    const formValue = this.myForm.value;
    await this.hubService.editHub(this.id, formValue.hubName, formValue.hubDescription);
    this.loading = false;
  }

  async activeToggle(userHub: JoinUserHub) {
    this.loading = true;
    if (userHub.hub.active == false) {
      await this.hubService.activateHub(userHub.hub.id);
    } else {
      await this.hubService.deactivateHub(userHub.hub.id);
    }
    this.loading = false;
  }

  async invite() {
    this.navCtrl.navigateForward('invite/' + this.id);
    this.logger.log('Invite clicked');
  }

  goToPersonPage(id: number, user: any) {
    this.logger.log(user)
    this.navCtrl.navigateForward('person/'+ id, {
      state: {
        user
      }
    });
  }

  async takePicture() {
    this.cameraService.takePicture().then(newImage => {
      this.loading = true;
      this.hubService.changeHubImage(this.id, newImage).then(() => {
        this.loading = false;
      });
    });
  }

  async selectPicture() {
    this.cameraService.selectPicture().then(newImage => {
      this.loading = true;
      this.hubService.changeHubImage(this.id, newImage).then(() => {
        this.loading = false;
      });
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Albums',
      buttons: [
        {
          text: 'Take Picture',
          // icon: 'arrow-dropright-circle',
          handler: () => {
            this.logger.log('Take Picture clicked');
            this.takePicture();
          }
        },
        {
          text: 'Select Picture',
          // icon: 'arrow-dropright-circle',
          handler: () => {
            this.logger.log('Select Picture clicked');
            this.selectPicture();
          }
        },
        // {
        //   text: this.userHub.starred ? 'Remove Star' : 'Add Star',
        //   // icon: 'heart',
        //   handler: async () => {
        //     let result = false;
        //     this.loading = true;
        //     if (this.userHub.starred) {
        //       result = await this.hubService.setHubNotStarred(this.id);
        //       this.userHub.starred = false;
        //     } else {
        //       result = await this.hubService.setHubStarred(this.id);
        //       this.userHub.starred = true;
        //     }

        //     if (!result) {
        //       this.userHub.starred = !this.userHub.starred;
        //     }

        //     this.loading = false;
        //     this.logger.log('Star clicked');
        //     return true;
        //   }
        // },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.logger.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async deleteHub() {
    this.logger.log('Delete clicked');
    const result = confirm("Deleting a hub cannot be undone! Are you sure?");
    if (result) {
      this.loading = true;
      await this.hubService.deleteHub(this.id);
      this.loading = false;
      this.navCtrl.back();
    }
  }

}
