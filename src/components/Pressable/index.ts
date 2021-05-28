import {
  PressableProps as RNPressableProps,
  StyleProp,
  ViewProps,
} from 'react-native';
import Animated from 'react-native-reanimated';

export {default} from './Pressable';

export interface PressableProps extends RNPressableProps {
  containerStyle?: StyleProp<ViewProps>;
  contentStyle?: StyleProp<ViewProps>;
  setAnimatedPressingStyle?: (AnimatedValue) => Animated.AnimateStyle<any>;
  refAnimationValue?: (any) => void;
}
