import {GestureResponderEvent} from 'react-native';

export {default} from './Location';

export interface LocationProps {
  title?: string;
  selected?: boolean;
  onPress: (e: GestureResponderEvent) => void;
}
