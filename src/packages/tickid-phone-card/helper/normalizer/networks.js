import getNetworkImage from '../getNetworkImage';
import * as kPlus from './kPlus';

export function normalize(service) {
  return service.sub_services.map(network => {
    return {
      ...network,
      kPlus: kPlus.normalize(network).kPlusData,
      optionsData: kPlus.normalize(network).optionsData,
      localImage: getNetworkImage(network.type)
    };
  });
}

export function denormalize(data) {}
