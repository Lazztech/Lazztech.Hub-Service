import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HubService } from 'src/app/services/hub/hub.service';
import { NGXLogger } from 'ngx-logger';
import { UsersPeopleQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  loading = false;
  persons: UsersPeopleQuery['usersPeople'] = [];

  constructor(
    public navCtrl: NavController,
    public hubService: HubService,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.loading = true;
    this.persons = await this.hubService.usersPeople();
    this.loading = false;
  }

  async doRefresh(event) {
    this.logger.log('Begin async operation');
    this.loading = true;
    this.persons = await this.hubService.usersPeople();
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
    this.persons = await this.hubService.usersPeople("cache-only");
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.persons = this.persons.filter(x => {
        let name = x.firstName.trim().toLowerCase() + x.lastName.trim().toLowerCase();
        this.logger.log(name);
        return name.includes(val.trim().toLowerCase())
      })
    }
  }

}
