import {getWork, getRelations, getHoldings, getCover} from '../loaders/loaders.js';
import * as graphql from 'graphql';


import WorkModel from './Work.graphql.js';

// Define our user type, with two string fields; `id` and `name`
const  workType = new graphql.GraphQLObjectType({
  name: 'OpenQuery',
  description: 'make queries in opensearch',
  fields: {
    work: {type: new graphql.GraphQLList(WorkModel)},
  }
});


export default workType;
