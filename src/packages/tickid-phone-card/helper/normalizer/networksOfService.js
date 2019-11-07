import * as networks from './networks';

export function normalize(data) {
  const networksOfService = {};
  data.sub_services.forEach(service => {
    networksOfService[service.id] = networks.normalize(service);
  });
  return networksOfService;
}

export function denormalize(data) {}
