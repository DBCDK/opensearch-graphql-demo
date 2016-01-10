

var xpath = require('xpath');
var xmldom = require('xmldom');

var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var DataLoader = require('dataloader');
import config from './config'; 
var searchClient = require('dbc-node-opensearch-client')(config);

import Work from './Work';


var getWork = new DataLoader(keys => loadWorkFromId(keys));

function extractData(data) {
    return data.work;
}

function loadWorkFromId(ids) {
    return Promise.all(ids.map(id => searchClient.getWorkResult({ query: `rec.id=${id}`}).then((result) => extractData(Work(result)))));
}

getWork.load(['870970-basis:21907960'])
    .then(res => console.log(res, 'result'))
    .catch(console.log.bind(console));

// Import our data set from above
var data = require('./data.json');

// Define our user type, with two string fields; `id` and `name`
var workType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        pid: { type: graphql.GraphQLString },
        title: { type: graphql.GraphQLString },
        fullTitle: { type: graphql.GraphQLString },
        alternativeTitle: { type: graphql.GraphQLString },
        creator: { type: graphql.GraphQLString },
        //contributers: { type: graphql.GraphQLNonNull },
        series: { type: graphql.GraphQLString },
        subjects: { type: new graphql.GraphQLList(graphql.GraphQLString) },
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
                    pid: { type: graphql.GraphQLString }
                },
                resolve: (_, args) => getWork.load(args.pid)
            }
        }
    })
});

console.log('Server online!');
express()
    .use('/graphql', graphqlHTTP({ schema: schema, pretty: true }))
    .listen(3000);