import getNetworkImage from '../getNetworkImage';

export function normalize(service) {
  return service.sub_services.map(network => {
    return {
      ...network,
      localImage: getNetworkImage(network.type)
    };
  });
}

export function denormalize(data) {}
