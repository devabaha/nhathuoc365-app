module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          src: './src',
          'app-util': './src/util',
          'app-store': './src/store',
          'app-config': './src/config',
          'app-packages': './src/packages',
          'app-components': './src/components',
          'app-containers': './src/containers',
          'app-helper': './src/helper'
        }
      }
    ]
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
