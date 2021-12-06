import {
  CartType,
  DeliveryStatusCode,
  CartStatus,
  CartPaymentStatus,
} from 'src/constants/cart';
import {CORE} from '../core';

export const ADDITION_LIGHT = {
  //     STATUS COLOR
  // @todo: for flash message - api message.
  danger: '#ef476f',
  warning: '#ffd166',
  success: '#06d6a0',
  info: '#118ab2',
  other: '#073b4c',

  // BRAND COLOR
  // @todo: for specific brand like Facebook, Youtube,…
  facebook: '#4267B2',
  youtube: '#FF0000',

  // CART TYPE COLOR
  cartTypes: {
    [CartType.NORMAL]: '#B0C0F0',
    [CartType.DROP_SHIP]: '#FF9F1C',
    [CartType.BOOKING]: '#53917E',
  },

  // DELIVERY STATUS COLOR
  deliveryStatus: {
    [DeliveryStatusCode.CANCEL]: '#DED9E2',
    [DeliveryStatusCode.SYSTEM_RECEIVED_ORDER]: '#9FA4C4',
    [DeliveryStatusCode.SHIPPER_RECEIVED_ORDER]: '#95AFBA',
    [DeliveryStatusCode.SHIPPER_GETTING_PACKAGES]: '#0F7173',
    [DeliveryStatusCode.FAIL_TO_GETTING_PACKAGES]: '#EF798A',
    [DeliveryStatusCode.DELIVERING]: '#ffd166',
    [DeliveryStatusCode.DELIVERY_SUCCESS]: '#06d6a0',
    [DeliveryStatusCode.DELIVERY_FAIL]: '#ef476f',
    [DeliveryStatusCode.ORDER_RETURNING]: '#92817A',
    [DeliveryStatusCode.ORDER_RETURNED]: '#6C7D47',
    [DeliveryStatusCode.FOR_CONTROL]: '#17A398',
  },

  // ORDER STATUS COLOR
  cartStatus: {
    [CartStatus.CANCEL_1]: '#ef476f',
    [CartStatus.CANCEL]: '#ef476f',
    [CartStatus.ORDERING]: '#6F7C12',
    [CartStatus.READY]: '#812384',
    [CartStatus.ACCEPTED]: '#F46036',
    [CartStatus.PROCESSING]: '#986d60',
    [CartStatus.DELIVERY]: '#EEAA21',
    [CartStatus.COMPLETED]: '#06d6a0',
    [CartStatus.CLOSED]: '#aaaaaa',
  },

  // PAYMENT STATUS COLOR
  cartPaymentStatus: {
    [CartPaymentStatus.UNPAID]: '#EEAA21',
    [CartPaymentStatus.PAID]: '#06d6a0',
    [CartPaymentStatus.CANCEL]: '#ef476f',
  },

  // MEMBERSHIP
  standard: ['#333333', '#cccccc'],
  gold: ['#d99b2d', '#FFCF40'],
  platinum: ['#a1a3a6', '#d8dadb'],
  diamond: ['#723dc6', '#d1a0f6'],

  // OTHERS
  accent1: CORE.green500,
  accent2: CORE.blue700,
  sale: '#FD0D1B',
  marigold: '#EEAA21',
  cherry: '#da3560',
  neutral1: '#dddddd',
  neutral2: '#528BC5'
};
