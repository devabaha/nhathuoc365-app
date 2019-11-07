import * as cards from './cards';
import * as networks from './networks';

export function normalize(data) {
  const cardsOfNetwork = {};
  data.sub_services.forEach(service => {
    networks.normalize(service).forEach(network => {
      const card = cards.normalize(network);
      cardsOfNetwork[network.id] = card;
      cardsOfNetwork[network.type] = card;
    });
  });
  return cardsOfNetwork;
}

export function denormalize(data) {}
