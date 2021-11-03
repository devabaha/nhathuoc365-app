import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {default as RNCarousel, Pagination} from 'react-native-snap-carousel';
import {CarouselProps} from '.';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  paginationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
});

export class Carousel extends Component<CarouselProps> {
  state = {
    currentIndex: this.props.firstItem || 0,
  };
  refCarousel = React.createRef<RNCarousel<any>>();

  handleSnapToItem = (currentIndex) => {
    this.props.onChangeIndex &&
      this.props.onChangeIndex(currentIndex, this.props.data[currentIndex]);
    this.setState({currentIndex});
  };

  handleScrollToIndexFailed = (e) => {
    console.log('carousel_scroll_to_index_failed', e);
  };

  renderPagination = () => {
    return this.props.renderPagination ? (
      this.props.renderPagination(
        this.state.currentIndex,
        this.props.data?.length,
      )
    ) : (
      <Pagination
        dotsLength={this.props.data.length}
        activeDotIndex={this.state.currentIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
            //   backgroundColor: 'rgba(0,0,0, 1)',
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  render() {
    const {
      wrapperStyle,
      containerStyle,
      contentContainerStyle,
      data,
      renderItem,
      ...props
    } = this.props;

    return (
      <View style={wrapperStyle}>
        <RNCarousel
          ref={this.refCarousel}
          data={data}
          // @ts-ignore
          renderItem={renderItem}
          sliderWidth={appConfig.device.width}
          itemWidth={appConfig.device.width}
          onSnapToItem={this.handleSnapToItem}
          onScrollToIndexFailed={this.handleScrollToIndexFailed}
          {...props}
        />
        {this.renderPagination()}
      </View>
    );
  }
}

export default Carousel;
