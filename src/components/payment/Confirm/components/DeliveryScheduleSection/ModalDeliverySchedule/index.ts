import {TFunction} from 'i18next';

export {default} from './ModalDeliverySchedule';

export interface ModalDeliveryScheduleProps {
  t?: TFunction;

  scheduleDeliveryData?: Array<any>;
  scheduleDateTime?: string;
  onConfirm?: (scheduleTime: string) => void;
}
