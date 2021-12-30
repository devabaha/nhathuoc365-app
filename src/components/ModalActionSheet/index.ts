import {ActionSheetCustomProps} from '@alessiocancian/react-native-actionsheet';
import {Children} from '../base';

export {default} from './ModalActionSheet';

export type ModalActionSheetProps = ActionSheetCustomProps & {
  cancelButtonIndex?: number;
  destructiveButtonIndex?: number;
  title?: Children;

  onPress?: (actionIndex: number) => void;
};
