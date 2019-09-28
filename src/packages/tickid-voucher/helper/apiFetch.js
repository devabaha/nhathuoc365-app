import config from '../config';
import urlFor from '../helper/urlFor';
import { merge } from '../helper/configure';

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

/**
 * Fetch api in the internal tick system
 * @param {*} url
 * @param {*} newOptions
 */
export function internalFetch(url = '', newOptions = {}) {
  return externalFetch(urlFor(config.rest.endpoint() + url), newOptions);
}

/**
 * Fetch api outside the tick system
 * @param {*} url
 * @param {*} newOptions
 */
export function externalFetch(url = '', newOptions = {}) {
  if (newOptions.body) {
    newOptions.body = JSON.stringify(newOptions.body);
  }
  return fetch(url, merge(defaultOptions, newOptions)).then(res => res.json());
}
