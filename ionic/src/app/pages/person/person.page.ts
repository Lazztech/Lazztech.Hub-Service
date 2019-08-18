import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import * as faceapi from 'face-api.js';


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

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    this.renaming = false;
  }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    console.log(this.id);
    this.apollo.query({
      query: gql`
      query {
        getPerson(id: ${this.id}) {
          id
          name
          images {
            id
            image
            savedAtTimestamp
            personDescriptors {
              id
              x
              y
              height
              width
              person {
                id
              }
            }
          }
        }
      }
      `
    }).subscribe(({data}) => {
      this.person = data['getPerson'];
      console.log(JSON.stringify(this.person));
      console.log(this.person.images[0].image);

      this.drawCanvas("canvas");
    });
  }

  startRenaming() {
    this.renaming = true;
  }

  stopRenaming() {
    this.renaming = false;
  }

  async rename() {
    this.apollo.mutate({
      mutation: gql`
      mutation {
        renamePerson(personId: ${this.id}, newName: "${this.newName}")
      }
      `
    }).subscribe(({data}) => {
      if (data.renamePerson === true) {
        this.person.name = this.newName;
      } else {
        console.log("Rename failed.");
      }
      this.renaming = false;
    });
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
