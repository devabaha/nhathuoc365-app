import * as listServices from './listServices';

export function normalize(data) {
  return listServices.normalize(data).map(service => ({
    keyView: service.type_view,
    key: service.type,
    title: service.name
  }));
}

export function denormalize(data) {}
