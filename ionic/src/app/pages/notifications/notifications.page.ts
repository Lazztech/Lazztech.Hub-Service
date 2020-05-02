import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { InAppNotification } from 'src/generated/graphql';

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
    this.inAppNotifications = this.sortNotifications(await this.notificationsService.getInAppNotifications());
    this.loading = false;
  }

  sortNotifications(notifications: InAppNotification[]) {
    const sorted = notifications.sort((x, y) => {
      return parseInt(y.date) - parseInt(x.date);
    });
    return sorted;
  }

  async doRefresh(event) {
    console.log('Begin async operation');
    try {
      this.loading = true;
      this.inAppNotifications = this.sortNotifications(await this.notificationsService.getInAppNotifications("network-only"));
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
      this.inAppNotifications = [];
    }
  }

  async deleteNotification(id: any) {
    const result = await this.notificationsService.deleteInAppNotification(id);
    if (result) {
      const notification = this.inAppNotifications.find(x => x.id == id);
      this.inAppNotifications.splice(this.inAppNotifications.indexOf(notification), 1);
    }
  }
}
