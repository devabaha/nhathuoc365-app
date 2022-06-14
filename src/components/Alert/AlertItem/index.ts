import {AlertItemData} from '@data';

export {default} from './AlertItem';

export interface AlertItemProps extends Omit<AlertItemData, 'id'> {
  onClose?: () => void;
}
