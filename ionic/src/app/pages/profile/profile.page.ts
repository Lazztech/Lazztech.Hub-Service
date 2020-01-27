import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { MenuController, ModalController, NavController, ActionSheetController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UpdateService } from 'src/app/services/update.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { ProfileService } from 'src/app/services/profile.service';
import { ChangeNamePage } from './settings/change-name/change-name.page';
import { ChangeEmailPage } from './settings/change-email/change-email.page';
import { ChangePasswordPage } from './settings/change-password/change-password.page';
import { DeleteAccountPage } from './settings/delete-account/delete-account.page';
import { ThemeService } from 'src/app/services/theme.service';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  loading = false;
  user: User;

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private alertService: AlertService,
    private themeService: ThemeService,
    private navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public cameraService: CameraService,
    ) { 
    this.menu.enable(true);
  }

  async ngOnInit() {
  }

  async ionViewWillEnter() {
    this.user = await this.authService.user();    
  }

  async userActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Profile Picture',
      buttons: [{
        text: 'Take Picture',
        handler: () => {
          console.log('Take Picture clicked');
          this.cameraService.takePicture().then(image => {
            this.loading = true;
            // const oldImage = this.userHub.image;
            // this.userHub.image = newImage;
            // const result = await this.hubService.updateHubPhoto(this.id, newImage);
            // if (!result) {
            //   this.userHub.image = oldImage;
            // }
            this.loading = false;
          });
        }
      },
      {
        text: 'Select Picture',
        handler: async () => {
          console.log('Take Picture clicked');
          await this.cameraService.selectPicture().then(image => {
            this.loading = true;
            // const oldImage = this.userHub.image;
            // this.userHub.image = newImage;
            // const result = await this.hubService.updateHubPhoto(this.id, newImage);
            // if (!result) {
            //   this.userHub.image = oldImage;
            // }
            this.loading = false;
          });
        }
      }, 
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
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
      },{
        text: 'Privacy',
        handler: () => {
          this.navCtrl.navigateForward('privacy');
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
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

}
