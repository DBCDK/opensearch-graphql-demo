import {getWork, getRelations, getHoldings, getCover, getRecommendations} from '../loaders/loaders.js';
import * as graphql from 'graphql';


import WorkAudienceModel from './WorkAudience.graphql.js';
import WorkRelationsModel from './WorkRelations.graphql.js';
import HoldingsstatusModel from './Holdings.graphql.js';
import CoverImageModel from './CoverImage.graphql.js';
import RecommendationsModel from './Recommendations.graphql.js';

// Define our user type, with two string fields; `id` and `name`
const  workType = new graphql.GraphQLObjectType({
  name: 'Work',
  description: 'A full work view from opensearch',
  fields: {
    pid: {type: graphql.GraphQLString},
    title: {type: graphql.GraphQLString},
    fullTitle: {type: graphql.GraphQLString},
    alternativeTitle: {type: graphql.GraphQLString},
    creator: {type: graphql.GraphQLString},
    contributers: {type: new graphql.GraphQLList(graphql.GraphQLString)},
    series: {type: graphql.GraphQLString},
    subjects: {type: new graphql.GraphQLList(graphql.GraphQLString)},
    audience: {type: WorkAudienceModel},
    relations: {
      type: new graphql.GraphQLList(WorkRelationsModel),
      args: {
        type: {type: graphql.GraphQLString}
      },
      resolve: ({pid}, {type}) => {
        return getRelations.load({pid, type})
      }
    },
    holdings: {
      type: HoldingsstatusModel,
      args: {
        pid: {type: graphql.GraphQLString},
        agencyId: {type: graphql.GraphQLString}
      },
      resolve: ({pid}, {agencyId}) => getHoldings.load({pid, agencyId})
    },
    coverImage: {
      type: CoverImageModel,
      /*args: {
        pids: {type: graphql.GraphQLString}
      },*/
      resolve: ({pid}) => getCover.load({pid: [pid]})
    },
    recommendations: {
      type: new graphql.GraphQLList(RecommendationsModel),
      resolve: ({pid}) => getRecommendations.load({pid: [pid]})
    }
    //holdings: {}
  }
});


export default workType;
