import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as faceapi from 'face-api.js';
import { PeopleService } from 'src/app/services/people.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-person',
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
})
export class PersonPage implements OnInit {

  id: number;
  person: any;
  renaming: boolean;
  newName: string;

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private peopleService: PeopleService
    ) {
    this.renaming = false;
  }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    console.log(this.id);
  }

  async ionViewDidEnter() {
    this.person = await this.peopleService.getPerson(this.id);
    this.drawCanvas("canvas");
  }

  startRenaming() {
    this.renaming = true;
  }

  stopRenaming() {
    this.renaming = false;
  }

  async rename() {
    const result = await this.peopleService.renamePerson(this.id, this.newName);
    if (result) {
      this.person.name = this.newName;
    }
    this.renaming = false;
  }

  goToImage(id: number) {
    this.navCtrl.navigateRoot('image/'+ id);
  }

  drawCanvas(canvasId: string) {
    console.log("drawing canvas");
    const descriptors = this.person.images[0].personDescriptors;
    console.log(descriptors);
    let boxesWithText: faceapi.BoxWithText[] = [];
    for (const iterator of descriptors) {
      let rect = new faceapi.Rect(iterator.x, iterator.y, iterator.width, iterator.height);
      boxesWithText.push(new faceapi.BoxWithText(rect, ""));
      faceapi.drawDetection(canvasId, boxesWithText);
      console.log(rect);
    }
  }

}
