import { Component, OnInit } from '@angular/core';
import { ActionSheetController, MenuController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { Scalars, User, UsersHubsQuery } from 'src/generated/graphql';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  loading = true;
  user: User;
  userHubs: Observable<UsersHubsQuery['usersHubs']>;
  subscriptions: Subscription[] = [];

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private alertService: AlertService,
    private themeService: ThemeService,
    private navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public cameraService: CameraService,
    public profileService: ProfileService,
    private hubService: HubService,
    private logger: NGXLogger
  ) {
    this.menu.enable(true);
  }

  async ngOnInit() {
    this.user = await this.authService.user();

    this.userHubs = await this.hubService.watchUserHubs().valueChanges.pipe(
      map(x => x.data && x.data.usersHubs)
    ).pipe(
      map(x => x.filter(x => x.isOwner))
    );

    this.subscriptions.push(
      this.hubService.watchUserHubs().valueChanges.subscribe(x => {
        this.logger.log('loading: ', x.loading);
        this.loading = x.loading;
      })
    );
  }

  async userActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Profile Picture',
      buttons: [{
        text: 'Take Picture',
        handler: () => {
          this.logger.log('Take Picture clicked');
          this.cameraService.takePicture().then(async image => {
            this.loading = true;
            this.profileService.changeUserImage(image).then(result => {
              this.user.image = result.image
              this.loading = false;
            });
          });
        }
      },
      {
        text: 'Select Picture',
        handler: async () => {
          this.logger.log('Take Picture clicked');
          await this.cameraService.selectPicture().then(async image => {
            this.loading = true;
            this.profileService.changeUserImage(image).then(result => {
              this.user.image = result.image
              this.loading = false;
            });
          });
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.logger.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Profile',
      buttons: [{
        text: 'Settings',
        handler: () => {
          this.navCtrl.navigateForward('settings');
        }
      }, {
        text: 'Privacy',
        handler: () => {
          this.navCtrl.navigateForward('privacy');
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.logger.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async logout() {
    await this.authService.logout();
    this.alertService.presentToast('Logged Out');
    this.navCtrl.navigateRoot('/landing');
  }
  async toggleTheme() {
    await this.themeService.toggle();
  }

  adminHub(id: Scalars['ID']) {
    this.navCtrl.navigateForward('admin-hub/' + id);
  }

}
