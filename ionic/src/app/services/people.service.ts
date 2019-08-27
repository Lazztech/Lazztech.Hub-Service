import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(
    private apollo: Apollo,
  ) { }

  async loadAllPeople() {
    const result = await this.apollo.query({
      query: gql`
        query {
          getAllPersons {
            id
            name
            images {
              id
              image
              savedAtTimestamp
              personDescriptors {
                id
                descriptor
              }
            }
          }
        }
      `,
      fetchPolicy: "no-cache"
    }).toPromise();

    const persons = result.data['getAllPersons'];
    return persons;
  }

  async getPerson(id: number): Promise<any> {
    const result = await this.apollo.query({
      query: gql`
      query {
        getPerson(id: ${id}) {
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
    }).toPromise();
    const person = result.data['getPerson'];
    return person;
  }

  async renamePerson(personId: number, newName: string): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        renamePerson(personId: ${personId}, newName: "${newName}")
      }
      `
    }).toPromise();
    const succeeded = result.data.renamePerson;
    return succeeded;
  }
}
