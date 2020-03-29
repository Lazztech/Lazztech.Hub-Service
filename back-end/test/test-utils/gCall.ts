import { graphql, GraphQLSchema } from 'graphql';
import Maybe from 'graphql/tsutils/Maybe';
import { IMyContext } from '../tests/test-utils/context.interface';
import { configuredSchema } from '../tests/test-utils/schemaBuilder';

interface IOptions {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  contextValue?: any;
}

let schema: GraphQLSchema;

export const gCall = async ({
  source,
  variableValues,
  contextValue,
}: IOptions) => {
  // Check if schema already exists
  if (!schema) {
    schema = await configuredSchema();
  }

  return graphql({
    schema,
    source,
    variableValues,
    contextValue,
  });
};
