import * as graphql from 'graphql';

var CoverImageType = new graphql.GraphQLObjectType({
  name: 'CoverImage',
  fields: {
    large: {type: graphql.GraphQLString},
    medium: {type: graphql.GraphQLString},
    small: {type: graphql.GraphQLString},
  }
});

export default CoverImageType;