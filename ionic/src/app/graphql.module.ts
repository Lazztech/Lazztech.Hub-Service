import { NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { NGXLogger } from 'ngx-logger';
import { SERVER_URL } from 'src/environments/environment';


export function createApollo(
  httpLink: HttpLink,
  storage: Storage,
  logger: NGXLogger
) {

  const apolloLink = httpLink.create({
    uri: SERVER_URL,
    withCredentials: true
  });

  const auth = setContext(async (_, { headers }) => {
    const token = await storage.get('token');
    if (!token) {
      logger.error("Couldn't add jwt to header.");
      return {};
    } else {
      return {
        headers: {
          ...headers,
          Authorization: token
        }
      };
    }
  });

  return {
    link: auth.concat(apolloLink),
    cache: new InMemoryCache(),
    connectToDevTools: true //TODO set based on environment variable, eg. dev or prod
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Storage, NGXLogger],
    },
  ],
})
export class GraphQLModule { }
