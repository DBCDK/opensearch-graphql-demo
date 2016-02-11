import * as graphql from 'graphql';
//import WorkModel from './Work.graphql.js';

var Recommendation = new graphql.GraphQLObjectType({
  name: 'Recommendations',
  fields: {
    pid: {type: graphql.GraphQLString},
    title: {type: graphql.GraphQLString},
    creator: {type: graphql.GraphQLString}
    /*work: {
      type: WorkModel
      resolve: ({pid}) => getWork.load({pid})
    }*/
  }
});

export default Recommendation