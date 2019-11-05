export function normalize(data) {
  const services = {};
  data.sub_services.forEach(service => {
    services[service.id] = service;
    services[service.type] = service;
  });
  return services;
}

export function denormalize(data) {}
