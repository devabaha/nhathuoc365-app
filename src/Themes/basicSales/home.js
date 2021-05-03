import React from 'react';
import {StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

import SVGCart from '../../images/home/cart.svg';
import SVGSearch from '../../images/home/search.svg';
import SVGMessage from '../../images/home/message.svg';
import {ASSETS_TYPE, BUNDLE_ICON_SETS} from '../constants';

export const home = StyleSheet.create({
  home_content_wrapper: {
    backgroundColor: 'transparent',
  },
  // Header
  header_container: {
    paddingBottom: 10,
  },
  header_mask_sub: {
    backgroundColor: '#000',
    opacity: 0.4,
  },
  header_search_wrapper: {
    borderRadius: 20,
  },
  header_search_wrapper_active: {
    backgroundColor: '#000',
    opacity: 0.4,
  },
  header_search_icon: {
    color: '#fff',
  },
  header_search_input_placeholder: {
    color: '#fff',
  },
  header_right_nav_bar_icon: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  header_right_nav_bar_last_icon: {
    paddingRight: 0,
  },
  primary_action_overflow_wrapper: {
    overflow: 'visible',
  },
  primary_action_color_text: {
    color: '#2B2B2B',
    fontSize: 14,
  },
  primary_action_color_surplus: {
    fontSize: 20,
    color: '#2B2B2B',
  },
  shadow_wrapper: {
    ...Platform.select({
      ios: {
        shadowColor: '#333',
        shadowOffset: {
          width: 1,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
        borderWidth: Util.pixel,
        borderColor: '#E1E1E1',
      },
    }),
  },
  list_service_container: {
    backgroundColor: 'transparent',
  },
  list_service_item: {
    borderRadius: 100,
  },
  list_product_item_container_shadow: {
    borderRadius: 4,
    backgroundColor: '#fafafa',
    ...Platform.select({
      ios: {
        shadowColor: '#333',
        shadowOffset: {
          width: 1,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
        borderWidth: Util.pixel,
        borderColor: '#E1E1E1',
      },
    }),
  },
  list_product_item_info_wrapper: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 4,
  },
  list_product_item_price_box: {
    backgroundColor: 'transparent',
  },
  list_product_item_salePrice: {
    color: '#FF0000',
  },
});

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
