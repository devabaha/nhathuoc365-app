import {Easing} from 'react-native-reanimated';
import {timing} from 'react-native-redash';

export const timingFunction = (from, to) => {
  return timing({
    from,
    to,
    easing: Easing.ease,
    duration: 200,
  });
};
