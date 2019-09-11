module.exports = {
  presets: ['module:metro-react-native-babel-preset', '@babel/preset-flow'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          'app-util': './util',
          'app-store': './store',
          'app-config': './config',
          'app-packages': './packages'
        }
      }
    ]
  ],
  env: {
    production: {
      plugins: ['transform-remove-console']
    }
  }
};
