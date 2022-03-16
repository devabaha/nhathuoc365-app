import {TFunction} from 'i18next';

export {default} from './ModalDeliverySchedule';

export interface ModalDeliveryScheduleProps {
  t?: TFunction;

  selectedDate?: string;
  selectedTime?: string;

  onConfirm?: (date: string, time: string) => void;
}
