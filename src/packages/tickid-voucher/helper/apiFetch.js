import config from '../config';
import urlFor from '../helper/urlFor';
import { merge } from '../helper/configure';

/**
 * Default options for fetch request
 */
const defaultOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Fetch api in the internal system tick
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
  return fetch(url, merge(defaultOptions, newOptions)).then(res => res.json());
}
