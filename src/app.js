"use strict";

import * as graphql from 'graphql';
import graphqlHTTP from 'express-graphql';
import express  from 'express';
import {getWork, getRelations, getHoldings} from './loaders.js';

var WorkAudience = new graphql.GraphQLObjectType({
  name: 'WorkAudience',
  fields: {
    age: {type: new graphql.GraphQLList(graphql.GraphQLString)},
    pegi: {type: graphql.GraphQLString},
    medieraad: {type: graphql.GraphQLString},
    type: {type: graphql.GraphQLString},
  }
});

var WorkRelations = new graphql.GraphQLObjectType({
  name: 'WorkRelations',
  fields: {
    link: {type: graphql.GraphQLString},
    type: {type: graphql.GraphQLString},
    collection: {type: new graphql.GraphQLList(graphql.GraphQLString)},
  }

});

var HoldingsstatusType = new graphql.GraphQLObjectType({
  name: 'Holdingsstatus',
  fields: {
    available: {type: graphql.GraphQLString},
    now: {type: graphql.GraphQLString},
    expectedDelievery: {type: graphql.GraphQLString},
    //pid: { type: graphql.GraphQLString }
  }
});

var CoverImageType = new graphql.GraphQLObjectType({
  name: 'CoverImage',
  fields: {
    available: {type: graphql.GraphQLString},
    now: {type: graphql.GraphQLString},
    expectedDelievery: {type: graphql.GraphQLString},
    //pid: { type: graphql.GraphQLString }
  }
});

// Define our user type, with two string fields; `id` and `name`
var workType = new graphql.GraphQLObjectType({
  name: 'Work',
  fields: {
    pid: {type: graphql.GraphQLString},
    title: {type: graphql.GraphQLString},
    fullTitle: {type: graphql.GraphQLString},
    alternativeTitle: {type: graphql.GraphQLString},
    creator: {type: graphql.GraphQLString},
    contributers: {type: new graphql.GraphQLList(graphql.GraphQLString)},
    series: {type: graphql.GraphQLString},
    subjects: {type: new graphql.GraphQLList(graphql.GraphQLString)},
    audience: {type: WorkAudience},
    relations: {
      type: new graphql.GraphQLList(WorkRelations),
      args: {
        type: {type: graphql.GraphQLString}
      },
      resolve: ({pid}, {type}) => {
        return getRelations.load({pid, type})
      }
    },
    holdings: {
      type: HoldingsstatusType,
      args: {
        agencyId: {type: graphql.GraphQLString}
      },
      resolve: ({pid}, {agencyId}) => getHoldings.load({pid, agencyId})
    },
    coverImage: {
      type: graphql.GraphQLString,
      args: {
        pids: {type: graphql.GraphQLString}
      },
      resolve: ({pid}, {agencyId}) => getHoldings.load({pid, agencyId})
    }
    //holdings: {}
  }
});



// Define our schema, with one top level field, named `user`, that
// takes an `id` argument and returns the User with that ID.
var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      work: {
        type: workType,
        args: {
          pid: {type: graphql.GraphQLString}
        },
        resolve: (_, args) => getWork.load(args)
      },
      relations: {
        type: new graphql.GraphQLList(WorkRelations),
        args: {
          pid: {type: graphql.GraphQLString},
          type: {type: graphql.GraphQLString}
        },
        resolve: (_, args) => {
          return getRelations.load(args)
        }
      },
      holdings: {
        type: HoldingsstatusType,
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

console.log('Server online!');
express()
  .use('/graphql', graphqlHTTP({schema: schema, pretty: true}))
  .listen(3000);