/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './app';
import {name as appName} from './app.json';
import codePush from "react-native-code-push";

codePush.sync({
  deploymentKey: CPDK[Platform.OS],
  installMode: codePush.InstallMode.IMMEDIATE
});

AppRegistry.registerComponent(appName, () => App);
