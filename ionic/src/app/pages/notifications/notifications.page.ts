import { Component, OnInit } from '@angular/core';
import { InAppNotification } from 'src/app/models/inAppNotification';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  loading = false;

  inAppNotifications: InAppNotification[] = Array.of<InAppNotification>();

  constructor(
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.loading = true;
    this.inAppNotifications = await this.notificationsService.getInAppNotifications();
    this.loading = false;
  }

  async loadNotifications() {

  }

  async doRefresh(event) {
    console.log('Begin async operation');
    try {
      this.loading = true;
      this.inAppNotifications = await this.notificationsService.getInAppNotifications("network-only");
      this.loading = false;
      event.target.complete();
    } catch (error) {
      event.target.complete();
      this.loading = false;
    }
  }


  async deleteNotifications() {
    const result = confirm("Delete all notifications?");
    if (result) {
      await this.notificationsService.deleteAllInAppNotifications();
    }
  }

  async deleteNotification(id: any) {
    const result = await this.notificationsService.deleteInAppNotification(id);
    if (result) {
      const notification = this.inAppNotifications.find(x => x.id == id);
      this.inAppNotifications.splice(this.inAppNotifications.indexOf(notification));
    }
  }
}
