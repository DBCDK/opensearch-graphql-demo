import * as graphql from 'graphql';

var WorkRelations = new graphql.GraphQLObjectType({
  name: 'WorkRelations',
  fields: {
    link: {type: graphql.GraphQLString},
    type: {type: graphql.GraphQLString},
    collection: {type: new graphql.GraphQLList(graphql.GraphQLString)},
  }

});

export default WorkRelations;