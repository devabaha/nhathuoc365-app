import React from 'react';
import {StyleProp, ViewProps} from 'react-native';
import {CarouselProps as RNCarouselProps} from 'react-native-snap-carousel';

export {default} from './Carousel';

export interface CarouselProps extends RNCarouselProps<any> {
  wrapperStyle?: StyleProp<ViewProps>;
  containerStyle?: StyleProp<ViewProps>;
  contentContainerStyle?: StyleProp<ViewProps>;

  onChangeIndex?: (index: number, item: any) => void;
  renderPagination?: (index: number, total: number) => React.ReactNode;
}
