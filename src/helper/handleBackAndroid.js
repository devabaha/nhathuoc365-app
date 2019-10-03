import appConfig from '../config';
import Toast from 'react-native-simple-toast';
import { Actions } from 'react-native-router-flux';
import debounce from 'app-packages/tickid-util/debounce';

const CAN_EXIT_TIME = 2000;

export default (() => {
  let canExit = false;

  const resetCanExitTimer = debounce(() => {
    canExit = false;
  }, CAN_EXIT_TIME);

  return function handleBackAndroid() {
    if (`${Actions.currentScene}`.includes(appConfig.routes.homeTab)) {
      if (canExit) {
        return false;
      }

      canExit = true;
      Toast.show('Chạm thêm lần nữa để thoát', CAN_EXIT_TIME);
      resetCanExitTimer();

      return true;
    }
    return false;
  };
})();
