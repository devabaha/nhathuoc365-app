import { AppRegistry, Platform } from 'react-native';
import { name as appName } from './app.json';
import codePush from 'react-native-code-push';
import App from './src/App';
import './src/i18n';

codePush.sync({
  deploymentKey: CPDK[Platform.OS],
  installMode: codePush.InstallMode.IMMEDIATE
});

AppRegistry.registerComponent(appName, () => App);
