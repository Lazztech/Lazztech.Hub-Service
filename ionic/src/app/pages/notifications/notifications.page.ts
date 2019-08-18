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

  async doRefresh(event) {
    console.log('Begin async operation');
    this.loading = true;

    try {
      this.inAppNotifications = await this.notificationsService.getInAppNotifications();

      event.target.complete();
      this.loading = false;
    } catch (error) {
      event.target.complete();
      this.loading = false;
    }
  }

}
