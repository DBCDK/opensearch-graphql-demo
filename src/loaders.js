"use strict";

import DataLoader from 'dataloader';
const config = require('@dbcdk/dbc-config').aarhus.provider.services;
const clients = {};
clients.openSearch = require('dbc-node-opensearch-client')(config.opensearch);
clients.openHoldingsStatus = require('dbc-node-openholdingstatus-client')(config.openholdingstatus);
clients.moreinfo = require('dbc-node-moreinfo-client')(config.moreinfo);

import HoldingStatus from './transforms/OpenHoldingStatus/HoldingStatus.transform.js';
//import MoreInfo from './transforms/moreinfo/CoverImage.transform.js';

import Work from './transforms/Work';
HoldingStatus.clients = clients;

/**
 *  Get holdings for a specified ID
 * @param args
 * @returns {*}
 */
function getHoldingsForPid(args) {
  return HoldingStatus.request(args).then(HoldingStatus.response).then(response => {
    if (response.result) {
      return {...response.result, pid: args.pid};
    }
  });
}

/**
 *  Get work information from ID
 * @param args
 * @returns {Promise}
 */
function loadWorkFromId(args) {
  return Promise.all(args.map(arg => clients.openSearch.getWorkResult({
    query: `rec.id=${arg.pid}`,
    objectFormats: 'dkabm',
    relationData: 'invalid'
  }).then((result) => Work.work(result))));
}

/**
 * Get relations from ID
 *
 * @param args
 * @returns {Promise}
 */
function loadRelationsFromId(args) {
  return Promise
    .all(args.map(({pid, type}) => clients.openSearch.getWorkResult({query: `rec.id=${pid}`, relationData: 'full'})
        .then(result => Work.relations(result))
        .then(relations => relations.filter(relation => {
          return !type || relation.type === `dbcaddi:${type}`
        }))
    ));
}


export const getWork = new DataLoader(keys => loadWorkFromId(keys));
export const getRelations = new DataLoader((keys, type) => loadRelationsFromId(keys));
export const getHoldings = new DataLoader((args) => Promise.all(args.map(arg => getHoldingsForPid(arg))));