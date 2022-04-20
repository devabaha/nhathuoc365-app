import {ContainerProps} from '../Container';
import {CardBorderRadiusType} from './constants';

export {default} from './Card';
export {CardBorderRadiusType};

export interface CardProps extends ContainerProps {
  borderRadiusSize?: CardBorderRadiusType;
}
