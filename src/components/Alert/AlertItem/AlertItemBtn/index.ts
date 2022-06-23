import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export {default} from './AlertItemBtn';

export interface AlertItemBtnProps {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}
