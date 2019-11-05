import * as routes from './routes';
import * as services from './services';
import * as listServices from './listServices';
import * as cardsOfNetwork from './cardsOfNetwork';
import * as networksOfService from './networksOfService';

export function normalize(data) {
  return {
    routes: routes.normalize(data),
    services: services.normalize(data),
    listServices: listServices.normalize(data),
    networksOfService: networksOfService.normalize(data),
    cardsOfNetwork: cardsOfNetwork.normalize(data)
  };
}

export function denormalize(data) {}
