import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { MenuController, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UpdateService } from 'src/app/services/update.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { ProfileService } from 'src/app/services/profile.service';
import { ChangeNamePage } from './change-name/change-name.page';
import { ChangeEmailPage } from './change-email/change-email.page';
import { ChangePasswordPage } from './change-password/change-password.page';
import { DeleteAccountPage } from './delete-account/delete-account.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User;

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private updateService: UpdateService,
    private alertService: AlertService,
    private profileService: ProfileService,
    private storage: Storage,
    private modalController: ModalController
    ) { 
    this.menu.enable(true);
  }

  async ngOnInit() {
  }

  async ionViewWillEnter() {
    this.user = await this.authService.user();    
  }

  async changeName() {
    const modal = await this.modalController.create({
      component: ChangeNamePage
    });
    modal.onDidDismiss().then(async () => this.user = await this.authService.user());
    return await modal.present();
  }
  
  async changeEmail() {
    const modal = await this.modalController.create({
      component: ChangeEmailPage
    });
    modal.onDidDismiss().then(async () => this.user = await this.authService.user());
    return await modal.present();
  }

  async changePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordPage
    });
    return await modal.present();
  }

  async deleteAccount() {
    const modal = await this.modalController.create({
      component: DeleteAccountPage
    });
    return await modal.present();
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
