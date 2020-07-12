module.exports = {
  presets: ['module:metro-react-native-babel-preset', '@babel/preset-flow'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          'app-util': './src/util',
          'app-store': './src/store',
          'app-config': './src/config',
          'app-packages': './src/packages',
          'app-components': './src/components',
          'app-containers': './src/containers'
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
