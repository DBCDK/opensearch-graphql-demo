'use strict';

import * as prep from './response-preparation.js';
import Transform from 'jsonpath-object-transform';

function getImagesFromResponse(result) {
  var template = {
    images: ['$.identifierInformation..coverImage.*', {
      url: '$..$value',
      size: '$..imageSize',
      format: '$..imageFormat'
    }]
  };

  var transformed = Transform(result, template);
  transformed.images = transformed.images.map((imgObj) => {
    imgObj.url = imgObj.url.replace('http:', '');
    return imgObj;
  });

  return transformed;
}


const CoverImageTransform = {

  event() {
    return 'getCoverImage';
  },

  /**
   * Transforms the request from the app to MoreInfo request parameters
   *
   * @param {string} request
   * @param {Array} data The pid from Open Search
   * @return {Array} request parameters using More Info terminology
   */
  request(data) { // eslint-disable-line no-unused-vars
    let identifiers = [];
    data.forEach((pid) => {
      try {
        const faust = pid.split(':').pop();
        identifiers.push(faust);
      }
      catch(e) { // eslint-disable-line
      }
    });
    return this.clients.moreinfo.getMoreInfoResult({identifiers});
  },

  /**
   * Transforms the respone from the MoreInfo webservice to a representation
   * that can be used by the application
   *
   * @param {Object} the response from MoreInfo
   * @return {Object} the transformed result
   */
  response(response) {
    return prep.checkResponse(response) || getImagesFromResponse(response);
  }
};

export default CoverImageTransform;
