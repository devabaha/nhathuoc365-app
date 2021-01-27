import appConfig from '../../config';

export const ANALYTICS_VIEW_PREFIX = 'view_';
export const ANALYTICS_CART_PREFIX = 'cart_';
export const ANALYTICS_ERROR_PREFIX = 'error_';

export const ANALYTICS_RAW_EVENTS_NAME = {
  view: {
    ...appConfig.routes,
  },
  cart: {
    order: 'orderCart',
  },
  error: {
    phoneAuthFirebase: 'phoneAuthFirebase',
  },
};

export const formatViewEvents = (eventName) =>
  ANALYTICS_VIEW_PREFIX + eventName;
export const formatCartEvents = (eventName) =>
  ANALYTICS_CART_PREFIX + eventName;
export const formatErrorEvents = (eventName) =>
  ANALYTICS_ERROR_PREFIX + eventName;

const formatEventsName = () => {
  const formattedEventsName = {...ANALYTICS_RAW_EVENTS_NAME};
  Object.keys(formattedEventsName).forEach((key) => {
    const replaceObj = {...formattedEventsName[key]};
    Object.keys(formattedEventsName[key]).forEach((childKey) => {
      switch (key) {
        case 'view':
          replaceObj[childKey] = formatViewEvents(
            formattedEventsName[key][childKey],
          );
          break;
        case 'cart':
          replaceObj[childKey] = formatCartEvents(
            formattedEventsName[key][childKey],
          );
          break;
        case 'error':
          replaceObj[childKey] = formatErrorEvents(
            formattedEventsName[key][childKey],
          );
          break;
      }
    });
    formattedEventsName[key] = replaceObj;
  });

  return formattedEventsName;
};

export const ANALYTICS_EVENTS_NAME = formatEventsName();
