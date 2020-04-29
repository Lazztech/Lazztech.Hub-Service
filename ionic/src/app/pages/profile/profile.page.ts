import { Component, OnInit } from '@angular/core';
import { ActionSheetController, MenuController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera.service';
import { HubService } from 'src/app/services/hub.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ThemeService } from 'src/app/services/theme.service';
import { User } from 'src/generated/graphql';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  loading = false;
  user: User;
  userHubs = [];

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private alertService: AlertService,
    private themeService: ThemeService,
    private navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public cameraService: CameraService,
    public profileService: ProfileService,
    private hubService: HubService
    ) { 
    this.menu.enable(true);
  }

  async ngOnInit() {
  }

  async ionViewWillEnter() {
    this.loading = true;
    this.user = await this.authService.user(); 
    this.userHubs = await this.hubService.usersHubs();
    this.userHubs = this.userHubs.filter(x => x.isOwner);
    this.loading = false;   
  }

  async userActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Profile Picture',
      buttons: [{
        text: 'Take Picture',
        handler: () => {
          console.log('Take Picture clicked');
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
          console.log('Take Picture clicked');
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
