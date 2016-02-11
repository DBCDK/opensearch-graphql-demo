import * as graphql from 'graphql';


var HoldingsstatusType = new graphql.GraphQLObjectType({
  name: 'Holdingsstatus',
  fields: {
    available: {type: graphql.GraphQLString},
    now: {type: graphql.GraphQLString},
    expectedDelievery: {type: graphql.GraphQLString},
    //pid: { type: graphql.GraphQLString }
  }
});

export default HoldingsstatusType