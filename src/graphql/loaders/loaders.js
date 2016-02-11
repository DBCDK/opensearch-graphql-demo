"use strict";

import DataLoader from 'dataloader';
const config = require('@dbcdk/dbc-config').aarhus.provider.services;
const clients = {};
clients.openSearch = require('dbc-node-opensearch-client')(config.opensearch);
clients.openHoldingsStatus = require('dbc-node-openholdingstatus-client')(config.openholdingstatus);
clients.moreinfo = require('dbc-node-moreinfo-client')(config.moreinfo);

import HoldingStatus from './transforms/OpenHoldingStatus/HoldingStatus.transform.js';
HoldingStatus.clients = clients;
import MoreInfo from './transforms/moreinfo/CoverImage.transform.js';
MoreInfo.clients = clients;

import Work from './transforms/Work';


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
 *  Get holdings for a specified ID
 * @param args
 * @returns {*}
 */
function loadCoversForPid(args) {
  function getSizes(response) {
    console.log(response);
    const result = {};
    response.forEach((image) => {
      if (image.size == 'detail') {
        result.large = image.url;
      }
      if (image.size == 'detail_500') {
        result.medium = image.url;
      }
      if (image.size == 'thumbnail') {
        result.small = image.url;
      }
    });
console.log(result);
    return result;
  }

  return MoreInfo.request(args.pid).then(MoreInfo.response).then(response => {
    if (response) {
      return getSizes(response);
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

function loadQuery(args) {
  console.log(args);
  return Promise.all(args.map(({query, stepValue, cql, page}) => clients.openSearch.getQuery({
    query: cql || `"${query}"`,
    stepValue,
    start: page && stepValue * (page - 1) + 1 || 1,
    objectFormats: 'dkabm',
    relationData: 'invalid'
  }).then((result) => Work.list(result)))).catch(console.log.bind(console));
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


export const getQuery = new DataLoader(keys => loadQuery(keys));
export const getWork = new DataLoader(keys => loadWorkFromId(keys));
export const getRelations = new DataLoader((keys, type) => loadRelationsFromId(keys));
export const getHoldings = new DataLoader((args) => Promise.all(args.map(arg => getHoldingsForPid(arg))));
export const getCover = new DataLoader((args) => Promise.all(args.map(arg => loadCoversForPid(arg))));