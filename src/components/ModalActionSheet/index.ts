import {ActionSheetCustomProps} from '@alessiocancian/react-native-actionsheet';

export {default} from './ModalActionSheet';

export type ModalActionSheetProps = ActionSheetCustomProps & {
  cancelButtonIndex?: number;
  destructiveButtonIndex?: number;

  onPress?: (actionIndex: number) => void;
};
