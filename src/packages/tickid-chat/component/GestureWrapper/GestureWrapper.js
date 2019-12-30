import React, { Component } from 'react';
import {
  StyleSheet,
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
import { logger, setStater } from '../../helper';

const gestureLogger = logger('gesture');
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
    animatedShowUpFakeValue: new Animated.Value(0),
    animatedShowUpValue: new Animated.Value(0),
    animatedTranslateYScrollView: new Animated.Value(HEIGHT),
    expandContent: false,
    animatableArea: this.animatableArea,
    middlePositionAnimatableArea: this.middlePositionAnimatableArea
  };

  unmounted = false;
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
      let condition =
        (!this.state.expandContent || !this.state.scrollable) &&
        this.props.isActivePanResponder;
      const { dx, dy } = gestureState;
      condition = condition && (dx > 2 || dx < -2 || dy > 2 || dy < -2);
      return condition;
    },
    onPanResponderMove: (evt, ges) =>
      Animated.event([
        null,
        {
          dy: this.state.animatedTranslateYScrollView
        }
      ])(evt, ges),

    // onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderGrant: (e, ges) => {
      this.state.animatedTranslateYScrollView.extractOffset();
    },
    // onPanResponderTerminate: evt => true,
    onPanResponderRelease: (evt, { dy, vy }) => {
      this.isAnimating = true;
      const breakPointTop = this.state.middlePositionAnimatableArea / 2;
      const breakPointBottom = this.state.middlePositionAnimatableArea * 2;
      const breakVelocity = 0.5;
      this.state.animatedTranslateYScrollView.flattenOffset();
      vy = Math.abs(vy);
      // move down
      if (
        dy >= 0 &&
        this.animatedTranslateYScrollViewValue < this.state.animatableArea
      ) {
        if (
          vy >= breakVelocity ||
          this.animatedTranslateYScrollViewValue >= breakPointTop
        ) {
          // go to bottom
          this.animateScrollView(this.state.animatableArea).start(() => {
            this.isAnimating = false;
            this.setState({ expandContent: false });
          });
        } else {
          // back to top
          this.animateScrollView(0).start(() => (this.isAnimating = false));
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

          this.animateScrollView(0).start(() => {
            this.isAnimating = false;
            this.setState({ expandContent: true });
          });
        } else {
          // back to bottom
          this.animateScrollView(this.state.animatableArea).start(
            () => (this.isAnimating = false)
          );
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

  get animatedShowUpValue() {
    return this.state.animatedShowUpValue;
  }

  get animatedShowUpFake() {
    return this.state.animatedShowUpFakeValue;
  }

  get actualScrollViewHeightValue() {
    return this.actualScrollViewHeight;
  }

  updateActualScrollViewHeight(otherHeight = this.props.headerHeight) {
    this.actualScrollViewHeight =
      HEIGHT - otherHeight - (isAndroid ? ANDROID_STATUS_BAR : 0);
  }

  animateScrollView(toValue) {
    return Animated.spring(this.state.animatedTranslateYScrollView, {
      toValue,
      overshootClamping: true,
      duration: this.props.durationShowBodyContent,
      useNativeDriver: isIos
    });
  }

  animateShowUp(toValue) {
    return Animated.spring(this.state.animatedShowUpValue, {
      toValue,
      overshootClamping: true,
      duration: this.props.durationShowBodyContent
      // useNativeDriver: true
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // *** specify props changes
    if (nextProps.visible !== this.props.visible) {
      if (!nextProps.visible) {
        this.refScrollView &&
          this.refScrollView.scrollToOffset({ animated: false, offset: 0 });
      }
      this.isAnimating = true;

      Animated.spring(this.state.animatedShowUpFakeValue, {
        toValue: nextProps.visible ? nextProps.collapsedBodyHeight : 0,
        duration: nextProps.durationShowBodyContent,
        overshootClamping: true
      }).start();

      Animated.parallel([
        this.animateShowUp(
          nextProps.visible ? nextProps.collapsedBodyHeight : 0
        ),
        this.animateScrollView(
          nextProps.visible ? nextState.animatableArea : HEIGHT
        )
      ]).start(() => {
        this.isAnimating = false;
        this.isFinishOpenAnimation = nextProps.visible;
      });
    }

    if (
      nextProps.headerHeight !== this.props.headerHeight ||
      nextProps.collapsedBodyHeight !== this.props.collapsedBodyHeight
    ) {
      this.updateActualScrollViewHeight(nextProps.headerHeight);
      this.setState({
        animatableArea: this.animatableArea,
        middlePositionAnimatableArea: this.middlePositionAnimatableArea
      });
    }

    // *** specify state changes
    if (nextState.expandContent !== this.state.expandContent) {
      if (!nextState.expandContent && nextProps.visible) {
        this.refScrollView &&
          this.refScrollView.scrollToOffset({ animated: false, offset: 0 });
        this.props.startCollapsingBodyContent();
        this.animateScrollView(this.state.animatableArea).start(() => {
          this.props.onCollapsedBodyContent();
        });
      }
    }

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.isActivePanResponder !== this.props.isActivePanResponder ||
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
      nextProps.openHeader !== this.props.openHeader ||
      nextProps.durationShowBodyContent !== this.props.durationShowBodyContent
    ) {
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
    this.unmounted = true;
    this.state.animatedTranslateYScrollView.removeListener(
      this.onAnimatedValueChange.bind(this)
    );
    if (isAndroid) {
      StatusBar.setBackgroundColor(this.props.defaultStatusBarColor, true);
    }
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
    const bottom = this.state.animatableArea;
    if (value <= 0 && !this.state.expandContent) {
      if (isAndroid) {
        StatusBar.setBackgroundColor('black', true);
      }
      // console.log('top');
      this.setState({ scrollable: this.scrollable(), expandContent: true });
      this.props.onExpandedBodyContent();
    }

    if (value >= bottom && this.state.expandContent) {
      if (this.animatedTranslateYScrollViewValue !== bottom && isAndroid) {
        StatusBar.setBackgroundColor(this.props.defaultStatusBarColor, true);
      }

      this.offset = 0;
      // console.log('bottom');
      this.setState({ expandContent: false });
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
    console.log('dragBegin', this.offset);
    this.offset = e.nativeEvent.contentOffset.y;
    this.isScrolling = false;
    this.momentActive = this.offset > 0;
  }
  handleMomentumScrollBegin(e) {
    this.offset = e.nativeEvent.contentOffset.y;
    this.momentActive = true;
    console.log('momentBegin', this.offset);
  }
  handleScroll(e) {
    let y = e.nativeEvent.contentOffset.y;
    console.log('scrolling', y);
    this.isScrolling = true;
    if (!this.momentActive) {
      this.offset = y;
      if (this.offset <= 0) {
        this.setState({
          expandContent: false
          // scrollable: false
        });
      }
    }
  }
  handleScrollEndDrag(e) {
    this.offset = e.nativeEvent.contentOffset.y;
    console.log('endDrag', this.offset);
  }
  handleMomentumScrollEnd(e) {
    this.isScrolling = false;
    console.log('momentEnd', this.offset);
    this.momentActive = false;

    if (this.offset <= 0) {
      this.setState({
        expandContent: false
        // scrollable: false
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
        expandContent: false
      });
    } else {
      this.props.onHeaderClosePress();
    }
  }

  render() {
    console.log('render gesture');
    const scrollPan = this.props.isActivePanResponder && {
      ...this.panResponder.panHandlers
    };
    const translateY =
      this.props.visible && this.isFinishOpenAnimation
        ? this.state.animatedTranslateYScrollView.interpolate({
            inputRange: [0, this.state.animatableArea],
            outputRange: [0, this.state.animatableArea],
            extrapolate: 'clamp'
          })
        : this.state.animatedTranslateYScrollView;

    return (
      <>
        {!!this.props.header && this.props.headerContent}

        <Animated.View
          style={[
            styles.container,
            styles.panResponder,
            {
              height: this.actualScrollViewHeight,
              transform: [
                {
                  translateY
                }
              ]
            }
          ]}
          {...scrollPan}
        >
          <FlatList
            onMoveShouldSetResponder={() => false}
            contentContainerStyle={styles.contentContainerStyle}
            data={this.props.bodyData}
            ref={inst => (this.refScrollView = inst)}
            onScrollBeginDrag={this.handleScrollBeginDrag.bind(this)}
            onMomentumScrollBegin={this.handleMomentumScrollBegin.bind(this)}
            onScroll={this.handleScroll.bind(this)}
            onMomentumScrollEnd={this.handleMomentumScrollEnd.bind(this)}
            onScrollEndDrag={this.handleScrollEndDrag.bind(this)}
            style={[styles.scrollViewStyle]}
            onContentSizeChange={() => {
              const scrollable = this.scrollable();
              if (scrollable !== this.state.scrollable) {
                this.setState({
                  scrollable: this.scrollable()
                });
              }
            }}
            scrollEnabled={
              this.state.scrollable && this.props.contentScrollEnabled
            }
            {...this.props.contentFlatListProps}
          />
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
  fakeView: {
    width: WIDTH,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  panResponder: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    width: '100%',
    borderTopWidth: 0.5,
    borderColor: '#d9d9d9'
  },
  contentContainerStyle: {
    flexGrow: 1
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
