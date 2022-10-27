import { Plugin } from '@nestjs/apollo'
import { ApolloServerPlugin, GraphQLRequestListener } from 'apollo-server-plugin-base'
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry'
import { GraphQLRequestContext } from 'apollo-server-types'
import '@sentry/tracing'

/**
 * @document: https://develop.sentry.dev/sdk/event-payloads/request/
 * @document: https://github.com/ntegral/nestjs-sentry/issues/63
 * @document: https://www.apollographql.com/docs/apollo-server/integrations/plugins/
 * @document: https://blog.sentry.io/2021/08/31/guest-post-performance-monitoring-in-graphql
 * @document: https://github.com/getsentry/sentry-javascript/issues/4731
 */

@Plugin()
export class SentryPlugin implements ApolloServerPlugin {
  constructor(@InjectSentry() private readonly sentry: SentryService) {}

  async requestDidStart({ request, context }: GraphQLRequestContext): Promise<GraphQLRequestListener> {
    const transaction = this.sentry.instance().startTransaction({
      op: 'gql',
      name: request.operationName ? `graphql: ${request.operationName}` : 'GraphQLTransaction'
    })

    this.sentry
      .instance()
      .getCurrentHub()
      .configureScope(scope => {
        const { headers, body: data, method, baseUrl: url } = context.req
        scope.addEventProcessor(event => {
          event.request = { method, url, headers, data }
          return event
        })
      })

    this.sentry.instance().configureScope(scope => {
      scope.setSpan(transaction)
    })

    return {
      // hook for transaction finished
      async willSendResponse() {
        transaction.finish()
      },
      async executionDidStart() {
        return {
          // hook for each new resolver
          willResolveField({ info }) {
            const span = transaction.startChild({
              op: 'resolver',
              description: `${info.parentType.name}.${info.fieldName}`
            })
            // this will execute once the resolver is finished
            return () => {
              span.finish()
            }
          }
        }
      }
    }
  }
}
