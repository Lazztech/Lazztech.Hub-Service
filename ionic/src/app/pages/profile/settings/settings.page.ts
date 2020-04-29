import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UpdateService } from 'src/app/services/update/update.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private updateService: UpdateService,
    private alertService: AlertService,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
  }

  async changeName() {
    this.navCtrl.navigateForward('change-name');
  }
  
  async changeEmail() {
    this.navCtrl.navigateForward('change-email');
  }

  async changePassword() {
    this.navCtrl.navigateForward('change-password');
  }

  async deleteAccount() {
    this.navCtrl.navigateForward('delete-account');
  }

  async checkForUpdates() {
    this.updateService.checkForUpdate();
    console.log('checked for updates');
    await this.alertService.presentToast('Checked for updates.');
  }

  async clearStorage() {
    await this.profileService.clearStorage();
  }


}
