import {Children} from '..';
import {ContainerProps} from '../Container';

export {default} from './Skeleton';

export interface SkeletonProps extends ContainerProps {
  container?: boolean;
  content?: boolean;

  children?: Children;
}
