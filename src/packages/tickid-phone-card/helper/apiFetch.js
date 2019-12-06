import config from '../config';
import urlFor from '../helper/urlFor';
import { merge } from '../helper/configure';
import axios from 'axios';

/**
 * Default options for fetch request
 */
const defaultOptions = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};

function prepareBody(options) {
  if (!options.body) return options;

  const body = new FormData();
  for (const field in options.body) {
    body.append(field, options.body[field]);
  }

  return { ...options, data: body };
}

/**
 * Fetch api in the internal tick system
 * @param {*} url
 * @param {*} options
 */
export function internalFetch(url = '', options = {}) {
  return externalFetch(urlFor(config.rest.endpoint() + url), options);
}

/**
 * Fetch api outside the tick system
 * @param {*} url
 * @param {*} options
 */
export function externalFetch(url = '', options = {}) {
  console.log(url);
  const newOptions = prepareBody(options);
  var param = merge(defaultOptions, newOptions);
  param.url = url;
  return new Promise((resolve, reject) => {
    axios
      .request(param)
      .then(response => resolve(response.data))
      .catch(reject);
  });
}
