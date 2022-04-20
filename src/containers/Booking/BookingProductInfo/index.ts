import {TFunction} from 'i18next';

export {default} from './BookingProductInfo';

export interface BookingProductInfoProps {
  product: any;
  attrs: any;
  models: any;
  defaultSelectedModel: string;
  editable?: boolean;
  onSelectAttr: (selectedAttr: any, model: string) => void;
  onChangeQuantity: (quantity: string) => void;

  t?: TFunction;
}
