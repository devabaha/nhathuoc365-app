import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {default as RNCarousel, Pagination} from 'react-native-snap-carousel';
// types
import {CarouselProps} from '.';
import {Style} from 'src/Themes/interface';
// configs
import appConfig from 'app-config';
// helpers
import {hexToRgba} from 'app-helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';

const styles = StyleSheet.create({
  paginationContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
});

export class Carousel extends Component<CarouselProps> {
  static contextType = ThemeContext;

  state = {
    currentIndex: this.props.firstItem || 0,
  };
  refCarousel = React.createRef<RNCarousel<any>>();

  get theme() {
    return getTheme(this);
  }

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
        containerStyle={[
          styles.paginationContainer,
          this.paginationContainerStyle,
        ]}
        dotStyle={[styles.paginationDot, this.paginationDotStyle]}
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

  get paginationContainerStyle(): Style {
    return {
      backgroundColor: this.theme.color.overlay60,
    };
  }

  get paginationDotStyle() {
    return {
      backgroundColor: hexToRgba(this.theme.color.white, 0.92),
    };
  }

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
