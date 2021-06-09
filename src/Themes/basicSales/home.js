import React from 'react';
import {StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

import SVGCart from '../../images/home/cart.svg';
import SVGSearch from '../../images/home/search.svg';
import SVGMessage from '../../images/home/message.svg';
import {ASSETS_TYPE, BUNDLE_ICON_SETS} from '../constants';
import appConfig from 'app-config';

export const home = {
  header: StyleSheet.create({
    // Header
    container: {
      paddingBottom: 10,
    },
    maskSub: {
      backgroundColor: '#fff',
      opacity: 0.4,
    },
    searchWrapper: {
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    searchWrapperActive: {
      backgroundColor: '#000',
      opacity: 0.4,
    },
    searchIcon: {
      color: '#fff',
    },
    searchInputPlaceholder: {
      color: '#fff',
    },
    rightNavBarIcon: {
      paddingLeft: 10,
      paddingRight: 10,
    },
    rightNavBarLastIcon: {
      paddingRight: 0,
    },
  }),
  home: StyleSheet.create({
    contentWrapper: {
      backgroundColor: 'transparent',
    },
  }),
  primaryAction: StyleSheet.create({
    actionsWrapper: {
    },
    walletNameLabel: {
      ...appConfig.styles.typography.text,
    },
    walletLabelRight: {
     
    },
    surplus: {
    },
  }),
  listService: StyleSheet.create({
    container: {
      backgroundColor: 'transparent'
    },
  }),
  listProduct: StyleSheet.create({
    infoWrapper: {
      // flex: 1,
      // alignItems: 'stretch',
      // padding: 5,
      // borderBottomLeftRadius: 4,
      // borderBottomRightRadius: 4,
    },
    priceBox: {
      // paddingVertical: 2,
      // paddingHorizontal: 4,
      // borderRadius: 4,
      // backgroundColor: 'transparent',
    },
    price: {
      // color: '#FF0000',
    },
  }),
};

export const assets = {
  cart: {
    type: ASSETS_TYPE.SVG,
    value: SVGCart,
  },
  search: {
    type: ASSETS_TYPE.SVG,
    value: SVGSearch,
  },
  message: {
    type: ASSETS_TYPE.SVG,
    value: SVGMessage,
  },
  //   search: {
  //     type: ASSETS_TYPE.SVG_XML,
  //     value: `<svg width="32" height="32" viewBox="0 0 32 32">
  //     <path
  //       fill-rule="evenodd"
  //       clip-rule="evenodd"
  //       fill="url(#gradient)"
  //       d="M4 0C1.79086 0 0 1.79086 0 4V28C0 30.2091 1.79086 32 4 32H28C30.2091 32 32 30.2091 32 28V4C32 1.79086 30.2091 0 28 0H4ZM17 6C17 5.44772 17.4477 5 18 5H20C20.5523 5 21 5.44772 21 6V25C21 25.5523 20.5523 26 20 26H18C17.4477 26 17 25.5523 17 25V6ZM12 11C11.4477 11 11 11.4477 11 12V25C11 25.5523 11.4477 26 12 26H14C14.5523 26 15 25.5523 15 25V12C15 11.4477 14.5523 11 14 11H12ZM6 18C5.44772 18 5 18.4477 5 19V25C5 25.5523 5.44772 26 6 26H8C8.55228 26 9 25.5523 9 25V19C9 18.4477 8.55228 18 8 18H6ZM24 14C23.4477 14 23 14.4477 23 15V25C23 25.5523 23.4477 26 24 26H26C26.5523 26 27 25.5523 27 25V15C27 14.4477 26.5523 14 26 14H24Z"
  //     />
  //     <defs>
  //       <linearGradient
  //         id="gradient"
  //         x1="0"
  //         y1="0"
  //         x2="8.46631"
  //         y2="37.3364"
  //         gradient-units="userSpaceOnUse">
  //         <stop offset="0" stop-color="#FEA267" />
  //         <stop offset="1" stop-color="#E75A4C" />
  //       </linearGradient>
  //     </defs>
  //   </svg>`,
  //   },
  //   message: {
  //     type: ASSETS_TYPE.ICON,
  //     value: {
  //       name: 'stepforward',
  //       bundle: 'AntDesign',
  //     },
  //   },
  //   logo: {
  //     type: ASSETS_TYPE.IMAGE,
  //     value: 'https://cf.shopee.vn/file/7708860e45bc4a4dcf2994e893d10d30',
  //   },
};
