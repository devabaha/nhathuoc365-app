import viettelImage from './assets/images/viettel.png';
import mobifoneImage from './assets/images/mobifone.png';
import vinaphoneImage from './assets/images/vinaphone.png';
import vietnamobileImage from './assets/images/vietnamobile.png';
import gmobileImage from './assets/images/gmobile.png';

export const INITIALIZED = 'init';

/**
 * Network types
 */
export const VIETTEL_TYPE = 'viettel';
export const MOBIFONE_TYPE = 'mobifone';
export const VINAPHONE_TYPE = 'vinaphone';
export const VIETNAMOBILE_TYPE = 'vietnamobile';
export const GMOBILE_TYPE = 'gmobile';

export const NETWORK_IMAGES = {
  [VIETTEL_TYPE]: viettelImage,
  [MOBIFONE_TYPE]: mobifoneImage,
  [VINAPHONE_TYPE]: vinaphoneImage,
  [VIETNAMOBILE_TYPE]: vietnamobileImage,
  [GMOBILE_TYPE]: gmobileImage
};

export const NETWORKS = {
  [VIETTEL_TYPE]: {
    name: 'Viettel',
    description: 'Hoàn tiền 4%',
    type: VIETTEL_TYPE,
    image: viettelImage
  },
  [MOBIFONE_TYPE]: {
    name: 'Mobifone',
    description: 'Hoàn tiền 4%',
    type: MOBIFONE_TYPE,
    image: mobifoneImage
  },
  [VINAPHONE_TYPE]: {
    name: 'Vinaphone',
    description: 'Hoàn tiền 4%',
    type: VINAPHONE_TYPE,
    image: vinaphoneImage
  },
  [VIETNAMOBILE_TYPE]: {
    name: 'Vietnamobile',
    description: 'Hoàn tiền 4%',
    type: VIETNAMOBILE_TYPE,
    image: vietnamobileImage
  },
  [GMOBILE_TYPE]: {
    name: 'Gmobile',
    description: 'Hoàn tiền 4%',
    type: GMOBILE_TYPE,
    image: gmobileImage
  }
};

export const CARD_10K = 'card10k';
export const CARD_20K = 'card20k';
export const CARD_30K = 'card30k';
export const CARD_50K = 'card50k';
export const CARD_100K = 'card100k';
export const CARD_200K = 'card120k';
export const CARD_300K = 'card300k';
export const CARD_500K = 'card500k';

export const CARD_VALUES = {
  [CARD_10K]: {
    name: '10.000đ',
    value: 10000,
    cashback: 200,
    type: CARD_10K
  },
  [CARD_20K]: {
    name: '20.000đ',
    value: 20000,
    cashback: 400,
    type: CARD_20K
  },
  [CARD_30K]: {
    name: '30.000đ',
    value: 30000,
    cashback: 600,
    type: CARD_30K
  },
  [CARD_50K]: {
    name: '50.000đ',
    value: 50000,
    cashback: 1000,
    type: CARD_50K
  },
  [CARD_100K]: {
    name: '100.000đ',
    value: 100000,
    cashback: 2000,
    type: CARD_100K
  },
  [CARD_200K]: {
    name: '200.000đ',
    value: 200000,
    cashback: 4000,
    type: CARD_200K
  },
  [CARD_300K]: {
    name: '300.000đ',
    value: 300000,
    cashback: 6000,
    type: CARD_300K
  },
  [CARD_500K]: {
    name: '500.000đ',
    value: 500000,
    cashback: 10000,
    type: CARD_500K
  }
};
