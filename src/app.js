"use strict";

import path from 'path';
import graphqlHTTP from 'express-graphql';
import express  from 'express';

import schema from './graphql/schema.graphql.js';

console.log('Server online!');
express()
  .use('/', graphqlHTTP({schema: schema, pretty: true, graphiql: true}))
  .use('/static', express.static(path.join(__dirname, '../public')))
  /*.get('/', function (req, res) {
    res.sendfile('public/pages/index.html');
  })*/
  .listen(3000);