import * as graphql from 'graphql';

var WorkAudience = new graphql.GraphQLObjectType({
  name: 'WorkAudience',
  fields: {
    age: {type: new graphql.GraphQLList(graphql.GraphQLString)},
    pegi: {type: graphql.GraphQLString},
    medieraad: {type: graphql.GraphQLString},
    type: {type: graphql.GraphQLString},
  }
});


export default WorkAudience