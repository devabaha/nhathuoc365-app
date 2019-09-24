import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const endPoint = 'http://api.rada.asia';
export const paths = {
  categories: '/partner/services/categories',
  listService: '/partner/services',
  serviceDetail: '/partner/services/detail',
  booking: '/partner/requests/create',
  createRequest: '/partner/requests/create'
};
