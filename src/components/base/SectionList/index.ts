import {SectionListProps as RNSectionListProps} from 'react-native';

export {default} from './SectionList';

export interface SectionListProps extends RNSectionListProps<any> {
  safeLayout?: boolean;
  reanimated?: boolean;
  animated?: boolean;
}
