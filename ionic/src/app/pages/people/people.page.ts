import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HubService } from 'src/app/services/hub/hub.service';
import { NGXLogger } from 'ngx-logger';
import { UsersPeopleQuery } from 'src/generated/graphql';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  loading = true;
  persons: Observable<UsersPeopleQuery['usersPeople']>;
  subscriptions: Subscription[] = [];

  constructor(
    public navCtrl: NavController,
    public hubService: HubService,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    this.persons = this.hubService.watchUsersPeople().valueChanges.pipe(map(x => x.data && x.data.usersPeople));

    this.subscriptions.push(
      this.hubService.watchUserHubs().valueChanges.subscribe(x => {
        this.logger.log('loading: ', x.loading);
        this.loading = x.loading;
      })
    );
  }

  async doRefresh(event) {
    this.logger.log('Begin async operation');
    this.loading = true;
    this.persons = this.hubService.watchUsersPeople("network-only").valueChanges.pipe(map(x => x.data && x.data.usersPeople));
    event.target.complete();
    this.loading = false;
  }

  goToPersonPage(id: number, user: any) {
    this.logger.log(user)
    this.navCtrl.navigateForward('person/'+ id, {
      state: {
        user
      }
    });
  }

  async filterPeople(ev:any) {
    this.persons = this.hubService.watchUsersPeople("cache-only").valueChanges.pipe(map(x => x.data && x.data.usersPeople));
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.persons = this.persons.pipe(
        map(x => x.filter(y => {
          let name = y.firstName.trim().toLowerCase() + y.lastName.trim().toLowerCase();
          return name.includes(val.trim().toLowerCase());
        }))
      );
    }
  }

}
