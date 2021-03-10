import {GestureResponderEvent} from 'react-native';

export {default} from './NavBar';

export interface NavBarProps {
  title?: string;
  description?: string;
  type?: 0 | 1 | 2;

  onPressBack: (e: GestureResponderEvent) => void;
}
