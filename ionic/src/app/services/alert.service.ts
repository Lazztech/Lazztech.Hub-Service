import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastController: ToastController) { }
  
  async presentToast(message: any, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      color: 'dark'
    });
    console.log("presenting toast");
    await toast.present();
  }

  async presentRedToast(message: any, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      color: 'danger'
    });
    console.log("presenting toast")
    await toast.present();
  }

}