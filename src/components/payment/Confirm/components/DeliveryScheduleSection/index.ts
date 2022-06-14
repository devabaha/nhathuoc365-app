import {TFunction} from 'i18next';

export {default} from './DeliveryScheduleSection';

export interface DeliveryScheduleSectionProps {
  t?: TFunction;

  scheduleDeliveryData?: Array<any>;
  dateTime?: string;
  siteId?: string;
  cartId?: string;
  title?: string;
  editable?: boolean;
  onDeliveryTimeChange?: (deliveryTime: string) => void;
}
