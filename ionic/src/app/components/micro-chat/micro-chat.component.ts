import { Component, OnInit, Input } from '@angular/core';
import { HubService } from 'src/app/services/hub.service';
import { ActionSheetController, IonRouterOutlet, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-micro-chat',
  templateUrl: './micro-chat.component.html',
  styleUrls: ['./micro-chat.component.scss'],
})
export class MicroChatComponent implements OnInit {

  @Input()
  hubId: number;

  @Input()
  userHub: any;

  constructor(
    private hubService: HubService,
    private actionSheetController: ActionSheetController,
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  async addNewMicroChat() {
    // const modal = await this.modalController.create({
    //   component: AddNewMicrochatPage,
    //   swipeToClose: true,
    //   presentingElement: this.routerOutlet.nativeEl
    // });
    // return await modal.present();
  }

  async microChatActionSheet(microChatId) {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Albums',
      buttons: [
      {
        text: 'Send to hub members',
        // icon: 'close',
        handler: async () => {
          await this.hubService.sendMicroChat(this.hubId, microChatId);
          console.log('Send microChat clicked');
          return true;
        }
      },
      {
        text: 'Cancel',
        // icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
    });
    await actionSheet.present();
  }  

}
