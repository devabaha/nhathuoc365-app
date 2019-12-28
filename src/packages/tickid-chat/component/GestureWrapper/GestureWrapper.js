import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Easing,
  StatusBar,
  Dimensions,
  Animated,
  FlatList,
  TouchableOpacity,
  PanResponder,
  ViewPropTypes,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper';

const isAndroid = Platform.OS === 'android';
const isIos = Platform.OS === 'ios';
const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');
const ANDROID_STATUS_BAR = StatusBar.currentHeight;
const HIT_SLOP = { right: 15, top: 15, left: 15, bottom: 15 };
const BODY_ITEMS_PER_ROW = 3;
const BODY_ITEM_HEIGHT = 150;
const HEADER_HEIGHT = isIos
  ? isIphoneX()
    ? getStatusBarHeight() + 60
    : 64
  : 56;
const COLLAPSE_BODY_HEIGHT = HEIGHT / 2.5;
const DURATION_SHOW_HEADER_CONTENT = 200;
const DURATION_SHOW_BODY_CONTENT = 300;
const defaultListener = () => {};
const defaultIconSendImage = <Text style={{ color: 'blue' }}>></Text>;
const defaultIconSelectedAlbum = <Text style={{ color: 'black' }}>/</Text>;
const defaultIconToggleAlbum = <Text style={{ color: 'white' }}>\/</Text>;
const defaultBtnCloseAlbum = <Text style={{ color: 'white' }}>x</Text>;

class GestureWrapper extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    contentScrollEnabled: PropTypes.bool,
    isActivePanResponder: PropTypes.bool,
    openHeader: PropTypes.bool,
    header: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
    bodyItemPerRow: PropTypes.number,
    bodyItemHeight: PropTypes.number,
    headerHeight: PropTypes.number,
    collapsedBodyHeight: PropTypes.number,
    durationShowHeaderContent: PropTypes.number,
    durationShowBodyContent: PropTypes.number,
    defaultStatusBarColor: PropTypes.string,
    onExpandedBodyContent: PropTypes.func,
    onCollapsedBodyContent: PropTypes.func,
    setHeader: PropTypes.func,
    onHeaderClosePress: PropTypes.func,
    bodyData: PropTypes.array,
    btnCloseHeaderStyle: ViewPropTypes.style,
    contentFlatListProps: PropTypes.object,
    startExpandingBodyContent: PropTypes.func,
    startCollapsingBodyContent: PropTypes.func,
    extraBodyContent: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
    headerContent: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
    btnCloseHeader: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
    btnHeaderClose: PropTypes.oneOfType([PropTypes.element, PropTypes.node])
  };

  static defaultProps = {
    visible: false,
    contentScrollEnabled: true,
    isActivePanResponder: true,
    openHeader: false,
    header: null,
    extraBodyContent: null,
    headerContent: null,
    btnHeaderClose: defaultBtnCloseAlbum,
    bodyItemPerRow: BODY_ITEMS_PER_ROW,
    bodyItemHeight: BODY_ITEM_HEIGHT,
    headerHeight: HEADER_HEIGHT,
    collapsedBodyHeight: COLLAPSE_BODY_HEIGHT,
    durationShowHeaderContent: DURATION_SHOW_HEADER_CONTENT,
    durationShowBodyContent: DURATION_SHOW_BODY_CONTENT,
    defaultStatusBarColor: '#000',
    onExpandedBodyContent: defaultListener,
    onCollapsedBodyContent: defaultListener,
    onHeaderClosePress: defaultListener,
    startExpandingBodyContent: defaultListener,
    startCollapsingBodyContent: defaultListener,
    setHeader: defaultListener,
    bodyData: [],
    contentFlatListProps: {}
  };

  state = {
    scrollable: false,
    expandContent: false,
    animatedAlbumHeight: new Animated.Value(0),
    animatedTranslateYScrollView: new Animated.Value(HEIGHT),
    expandContent: false
  };

  animatedShowUpValue = new Animated.Value(0);

  offset = 0;
  animatedTranslateYScrollViewValue = 0;
  momentActive = false;
  isFinishOpenAnimation = false;
  isAnimating = false;
  isScrolling = false;
  refScrollView = null;
  actualScrollViewHeight = 0;
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    // onShouldBlockNativeResponder: () => {console.warn('a'); return !this.state.expandContent},
    // onPanResponderTerminate: () => {console.warn('b'); return this.state.expandContent},
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      return dx > 2 || dx < -2 || dy > 2 || dy < -2;
    },
    onPanResponderMove: (evt, ges) => {
      if (this.state.scrollable) {
        if (!this.isScrolling) {
          // console.log('M.O.V.E', this.offset);
        }
        return false;
      }

      return Animated.event([
        null,
        {
          dy: this.state.animatedTranslateYScrollView
        }
      ])(evt, ges);
    },

    // Animated.,

    // onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderGrant: (e, ges) => {
      this.state.animatedTranslateYScrollView.extractOffset();
    },
    // onPanResponderTerminate: evt => true,
    onPanResponderRelease: (evt, { dy, vy }) => {
      this.isAnimating = true;
      const breakPointTop = this.middlePositionAnimatableArea / 2;
      const breakPointBottom = this.middlePositionAnimatableArea * 2;
      const breakVelocity = 0.5;
      this.state.animatedTranslateYScrollView.flattenOffset();
      vy = Math.abs(vy);
      // move down
      if (
        dy >= 0 &&
        this.animatedTranslateYScrollViewValue < this.animatableArea
      ) {
        if (
          vy >= breakVelocity ||
          this.animatedTranslateYScrollViewValue >= breakPointTop
        ) {
          // go to bottom
          Animated.spring(this.state.animatedTranslateYScrollView, {
            toValue: this.animatableArea,
            duration: this.props.durationShowBodyContent,
            useNativeDriver: true,
            overshootClamping: true
          }).start(() => {
            this.isAnimating = false;
            this.setState({ expandContent: false });
          });
        } else {
          // back to top
          Animated.spring(this.state.animatedTranslateYScrollView, {
            toValue: 0,
            duration: this.props.durationShowBodyContent,
            useNativeDriver: true,
            overshootClamping: true
          }).start(() => (this.isAnimating = false));
        }
      }

      //move up
      if (dy < 0 && this.animatedTranslateYScrollViewValue > 0) {
        if (
          vy >= breakVelocity ||
          this.animatedTranslateYScrollViewValue <= breakPointBottom
        ) {
          // go to top
          this.props.startExpandingBodyContent();

          Animated.spring(this.state.animatedTranslateYScrollView, {
            toValue: 0,
            duration: this.props.durationShowBodyContent,
            useNativeDriver: true,
            overshootClamping: true
          }).start(() => {
            this.isAnimating = false;
            this.setState({ expandContent: true });
          });
        } else {
          // back to bottom
          Animated.spring(this.state.animatedTranslateYScrollView, {
            toValue: this.animatableArea,
            duration: this.props.durationShowBodyContent,
            useNativeDriver: true,
            overshootClamping: true
          }).start(() => (this.isAnimating = false));
        }
      }
    }
  });

  get animatableArea() {
    return (
      HEIGHT -
      this.props.collapsedBodyHeight -
      this.props.headerHeight -
      (isAndroid ? ANDROID_STATUS_BAR : 0) -
      (isIphoneX() ? getStatusBarHeight() + 2 : 0)
    );
  }

  get middlePositionAnimatableArea() {
    const animatableArea = this.animatableArea;
    return animatableArea / 2;
  }

  getDurationGestureAnimation(targetPosition) {
    return (
      (Math.abs(targetPosition - this.animatedTranslateYScrollViewValue) *
        this.props.durationShowBodyContent) /
      this.animatableArea
    );
  }

  updateActualScrollViewHeight(otherHeight = this.props.headerHeight) {
    this.actualScrollViewHeight =
      HEIGHT - otherHeight - (isAndroid ? ANDROID_STATUS_BAR : 0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      if (nextState.expandContent !== this.state.expandContent) {
        if (!nextState.expandContent) {
          this.refScrollView &&
            this.refScrollView.scrollToOffset({ animated: false, offset: 0 });
          this.props.startCollapsingBodyContent();

          Animated.spring(this.state.animatedTranslateYScrollView, {
            toValue: this.animatableArea,
            duration: this.props.durationShowBodyContent,
            useNativeDriver: true,
            overshootClamping: true
          }).start(() => {
            this.props.onCollapsedBodyContent();
          });
        }
      }
      return true;
    }

    if (
      nextProps.bodyItemPerRow !== this.props.bodyItemPerRow ||
      nextProps.bodyItemHeight !== this.props.bodyItemHeight ||
      nextProps.headerHeight !== this.props.headerHeight ||
      nextProps.collapsedBodyHeight !== this.props.collapsedBodyHeight ||
      nextProps.defaultStatusBarColor !== this.props.defaultStatusBarColor ||
      nextProps.visible !== this.props.visible ||
      nextProps.bodyData !== this.props.bodyData ||
      nextProps.btnCloseHeader !== this.props.btnCloseHeader ||
      nextProps.btnCloseHeaderStyle !== this.props.btnCloseHeaderStyle ||
      nextProps.contentFlatListProps !== this.props.contentFlatListProps ||
      nextProps.headerContent !== this.props.headerContent ||
      nextProps.extraBodyContent !== this.props.extraBodyContent ||
      nextProps.openHeader !== this.props.openHeader
    ) {
      if (nextProps.headerHeight !== this.props.headerHeight) {
        this.updateActualScrollViewHeight();
      }
      if (nextProps.visible !== this.props.visible) {
        if (!nextProps.visible) {
          this.refScrollView &&
            this.refScrollView.scrollToOffset({ animated: false, offset: 0 });
        }
        this.isAnimating = true;
        Animated.parallel([
          Animated.timing(this.animatedShowUpValue, {
            toValue: nextProps.visible ? nextProps.collapsedBodyHeight : 0,
            duration: this.props.durationShowBodyContent,
            easing: Easing.in
          }),
          Animated.timing(this.state.animatedTranslateYScrollView, {
            toValue: nextProps.visible ? this.animatableArea : HEIGHT,
            duration: this.props.durationShowBodyContent,
            easing: Easing.in,
            useNativeDriver: true
          })
        ]).start(() => {
          this.isAnimating = false;
          this.isFinishOpenAnimation = nextProps.visible;
        });
      }

      return true;
    }

    return false;
  }

  componentDidMount() {
    this.updateActualScrollViewHeight();
    this.state.animatedTranslateYScrollView.addListener(
      this.onAnimatedValueChange.bind(this)
    );
  }

  componentWillUnmount() {
    this.state.animatedTranslateYScrollView.removeListener(
      this.onAnimatedValueChange.bind(this)
    );
    this.props.setHeader(null);
  }

  componentDidUpdate(prevProps, prevState) {
    const opacity = this.state.animatedTranslateYScrollView.interpolate({
      inputRange: [this.props.headerHeight, this.props.headerHeight * 2],
      outputRange: [1, 0]
    });
    this.props.setHeader(
      <Header
        headerHeight={this.props.headerHeight}
        handleCloseModal={this.handleCloseModal.bind(this)}
        opacity={opacity}
        btnHeaderClose={this.props.btnHeaderClose}
        btnHeaderCloseStyle={this.props.btnHeaderClose}
        header={this.props.header}
        pointerEvents={this.state.expandContent ? 'auto' : 'none'}
      />
    );
  }

  onAnimatedValueChange({ value }) {
    const bottom = this.animatableArea;
    if (value === 0 && !this.state.expandContent) {
      if (isAndroid) {
        StatusBar.setBackgroundColor('black', true);
      }
      // console.log('top');
      this.setState({ scrollable: this.scrollable() });

      this.props.onExpandedBodyContent();
    }

    if (value === bottom || (value <= bottom && this.state.expandContent)) {
      if (this.animatedTranslateYScrollViewValue !== bottom && isAndroid) {
        StatusBar.setBackgroundColor(this.props.defaultStatusBarColor, true);
      }

      this.offset = 0;
      // console.log('bottom');
      this.setState({ scrollable: false });
    }
    this.animatedTranslateYScrollViewValue = value;
  }

  scrollable(data = this.props.bodyData) {
    return (
      Math.ceil(data.length / this.props.bodyItemPerRow) *
        this.props.bodyItemHeight >
      this.actualScrollViewHeight
    );
  }

  //START - handle everything about gallery scroll event
  handleScrollBeginDrag(e) {
    // console.log('dragBegin', this.offset);
    this.offset = e.nativeEvent.contentOffset.y;
    this.isScrolling = false;
    this.momentActive = this.offset > 0;
  }
  handleMomentumScrollBegin(e) {
    this.offset = e.nativeEvent.contentOffset.y;
    this.momentActive = true;
    // console.log('momentBegin', this.offset);
  }
  handleScroll(e) {
    let y = e.nativeEvent.contentOffset.y;
    // console.log('scrolling', y);
    this.isScrolling = true;
    if (!this.momentActive) {
      this.offset = y;
      if (this.offset <= 0) {
        this.setState({
          expandContent: false,
          scrollable: false
        });
      }
    }
  }
  handleScrollEndDrag(e) {
    this.offset = e.nativeEvent.contentOffset.y;
    // console.log('endDrag', this.offset);
  }
  handleMomentumScrollEnd(e) {
    this.isScrolling = false;
    // console.log('momentEnd', this.offset);
    this.momentActive = false;

    if (this.offset <= 0) {
      this.setState({
        expandContent: false,
        scrollable: false
      });
    }

    // this.offset = e.nativeEvent.contentOffset.y;
  }
  //END - handle everything about gallery scroll event

  handleCloseModal() {
    if (this.state.expandContent && !this.props.openHeader) {
      this.isAnimating = true;
      this.offset = 0;
      this.setState({
        expandContent: false,
        scrollable: false
      });
    } else {
      this.props.onHeaderClosePress();
    }
  }

  render() {
    // console.log(this.state.scrollable, 'scrollable');
    const scrollPan = !this.state.scrollable &&
      this.props.isActivePanResponder && {
        ...this.panResponder.panHandlers
      };
    const translateY =
      this.props.visible && this.isFinishOpenAnimation
        ? this.state.animatedTranslateYScrollView.interpolate({
            inputRange: [0, this.animatableArea],
            outputRange: [0, this.animatableArea],
            extrapolate: 'clamp'
          })
        : this.state.animatedTranslateYScrollView;

    return (
      <>
        {!!this.props.header && <>{this.props.headerContent}</>}

        <Animated.View
          style={{
            width: WIDTH,
            backgroundColor: 'rgba(0,0,0,0)',
            height: this.animatedShowUpValue,
            transform: [
              {
                translateY: this.animatedShowUpValue.interpolate({
                  inputRange: [0, this.props.collapsedBodyHeight],
                  outputRange: [HEIGHT, HEIGHT - this.props.collapsedBodyHeight]
                })
              }
            ]
          }}
        />

        <Animated.View
          style={[
            styles.container,
            {
              zIndex: 1,
              position: 'absolute',
              top: 0,
              width: '100%',
              height: this.actualScrollViewHeight,
              borderTopWidth: 0.5,
              borderColor: '#d9d9d9',
              transform: [
                {
                  translateY
                  // : this.state.animatedTranslateYScrollView.interpolate({
                  //   inputRange: [
                  //     -this.props.collapsedBodyHeight,
                  //     0,
                  //     this.actualScrollViewHeight
                  //   ],
                  //   outputRange: [
                  //     HEIGHT,
                  //     HEIGHT -
                  //     this.props.headerHeight -
                  //     (isAndroid ? ANDROID_STATUS_BAR + 8 : 0) -
                  //     (this.props.visible
                  //       ? this.props.collapsedBodyHeight
                  //       : 0),
                  //     this.props.headerHeight
                  //   ]
                  // })
                }
              ]
            }
          ]}
          {...scrollPan}
        >
          {/* <View
            style={[
              styles.container,
              {
                flexDirection: 'column'
              }
            ]}
            {...scrollPan}
          > */}
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ backgroundColor: 'red' }}
            data={this.props.bodyData}
            ref={inst => (this.refScrollView = inst)}
            onScrollBeginDrag={this.handleScrollBeginDrag.bind(this)}
            onMomentumScrollBegin={this.handleMomentumScrollBegin.bind(this)}
            onScroll={this.handleScroll.bind(this)}
            onMomentumScrollEnd={this.handleMomentumScrollEnd.bind(this)}
            onScrollEndDrag={this.handleScrollEndDrag.bind(this)}
            style={[styles.scrollViewStyle]}
            scrollEnabled={
              this.state.scrollable && this.props.contentScrollEnabled
            }
            {...this.props.contentFlatListProps}
          />
          {/* </View> */}
          {this.props.extraBodyContent}
        </Animated.View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  btnCloseHeader: {
    position: 'absolute',
    paddingTop: isIos ? 20 : 0,
    left: 15
  },
  header: {
    zIndex: 999,
    flex: 1,
    width: WIDTH,
    paddingTop: isIos ? 20 : 0,
    top: 0,
    left: 0,
    backgroundColor: 'black',
    position: 'absolute'
  },
  iconToggleAlbum: {
    marginLeft: 10,
    alignItems: 'flex-end'
  },
  scrollViewStyle: {
    flex: 1,
    position: 'relative'
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  itemsRow: {
    flex: 1,
    flexDirection: 'row'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  albumHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  albumTitle: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18
  },
  albumContainer: {
    zIndex: 990,
    width: WIDTH,
    backgroundColor: 'white',
    position: 'absolute'
  }
});

export default GestureWrapper;

class Header extends Component {
  state = {};
  render() {
    return (
      <Animated.View
        style={[
          styles.center,
          styles.header,
          {
            opacity: this.props.opacity,
            height: this.props.headerHeight
          }
        ]}
        pointerEvents={this.props.pointerEvents}
      >
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          style={[styles.btnCloseHeader, this.props.btnCloseHeaderStyle]}
          onPress={this.props.handleCloseModal}
        >
          {this.props.btnHeaderClose}
        </TouchableOpacity>
        {this.props.header}
      </Animated.View>
    );
  }
}
