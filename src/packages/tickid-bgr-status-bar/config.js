import { getStatusBarHeight } from 'react-native-iphone-x-helper';

const config = {
  device: {
    statusBarHeight: getStatusBarHeight()
  },
  mode: {
    dark: 'dark',
    light: 'light'
  },
  methods: {
    show: () => {},
    hide: () => {}
  },
  statusBarState: {}
};

export default config;
