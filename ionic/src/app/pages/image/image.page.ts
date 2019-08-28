import { Component, OnInit } from '@angular/core';
import { PeopleService } from 'src/app/services/people.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {

  id: number;
  image: any;

  constructor(
    private route: ActivatedRoute,
    private peopleService: PeopleService
  ) { }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
  }

  async ionViewDidEnter() {
    this.image = await this.peopleService.getImage(this.id);
  }

}
