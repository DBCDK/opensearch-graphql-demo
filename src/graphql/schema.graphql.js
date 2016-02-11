import WorkModel from './model/Work.graphql.js';
import QueryModel from './model/Query.graphql.js';
import WorkRelationsModel from './model/WorkRelations.graphql.js';
import HoldingsstatusModel from './model/Holdings.graphql.js';
import * as graphql from 'graphql';

import {getWork, getRelations, getHoldings, getQuery} from './loaders/loaders.js';

// Define our schema, with one top level field, named `user`, that
// takes an `id` argument and returns the User with that ID.
var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {

      search: {
        type: QueryModel,
        args: {
          query: {type: graphql.GraphQLString},
          cql: {type: graphql.GraphQLString},
          stepValue: {type: graphql.GraphQLInt},
          page: {type: graphql.GraphQLInt}
        },
        resolve: (_, args) => getQuery.load(args)
      },
      work: {
        type: WorkModel,
        args: {
          pid: {type: graphql.GraphQLString}
        },
        resolve: (_, args) => getWork.load(args)
      },
      relations: {
        type: new graphql.GraphQLList(WorkRelationsModel),
        args: {
          pid: {type: graphql.GraphQLString},
          type: {type: graphql.GraphQLString}
        },
        resolve: (_, args) => {
          return getRelations.load(args)
        }
      },
      holdings: {
        type: HoldingsstatusModel,
        args: {
          pid: {type: graphql.GraphQLString},
          agencyId: {type: graphql.GraphQLString}
        },
        resolve: (_, args) => {
          return getHoldings(args)
        }
      }
    }
  })
});

export default schema;