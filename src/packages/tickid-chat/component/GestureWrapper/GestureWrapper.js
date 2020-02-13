import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import {
  isAndroid,
  isIos,
  WIDTH,
  HEIGHT,
  HEADER_HEIGHT,
  MIN_HEIGHT_COMPOSER,
  BOTTOM_SPACE_IPHONE_X,
  BOTTOM_OFFSET_GALLERY,
  isAndroidEmulator,
  ANDROID_STATUS_BAR_HEIGHT
} from '../../constants';

const DURATION_SHOW_BODY_CONTENT = 300;
const defaultListener = () => {};

class GestureWrapper extends Component {
  static propTypes = {
    extraData: PropTypes.any,
    visible: PropTypes.bool,
    contentScrollEnabled: PropTypes.bool,
    isActivePanResponder: PropTypes.bool,
    headerHeight: PropTypes.number,
    collapsedBodyHeight: PropTypes.number,
    durationShowBodyContent: PropTypes.number,
    defaultStatusBarColor: PropTypes.string,
    onStartVisibleAnimation: PropTypes.func,
    onFinishVisibleAnimation: PropTypes.func,
    onExpandedBodyContent: PropTypes.func,
    onCollapsedBodyContent: PropTypes.func,
    onExpandingBodyContent: PropTypes.func,
    onCollapsingBodyContent: PropTypes.func,
    renderBefore: PropTypes.oneOfType([PropTypes.element, PropTypes.node])
  };

  static defaultProps = {
    extraData: null,
    visible: false,
    contentScrollEnabled: true,
    isActivePanResponder: true,
    headerHeight: HEADER_HEIGHT,
    collapsedBodyHeight: BOTTOM_OFFSET_GALLERY,
    durationShowBodyContent: DURATION_SHOW_BODY_CONTENT,
    defaultStatusBarColor: '#000',
    onStartVisibleAnimation: defaultListener,
    onFinishVisibleAnimation: defaultListener,
    onExpandedBodyContent: defaultListener,
    onCollapsedBodyContent: defaultListener,
    onExpandingBodyContent: defaultListener,
    onCollapsingBodyContent: defaultListener,
    renderBefore: null
  };

  state = {
    animatedShowUpValue: new Animated.Value(0),
    animatedTranslateYScrollView: new Animated.Value(HEIGHT),
    expandContent: false,
    isFinishOpenAnimation: false,
    animatableArea: this.getAnimatableArea(),
    middlePositionAnimatableArea: this.getMiddlePositionAnimatableArea()
  };

  unmounted = false;
  offset = 0;
  animatedTranslateYScrollViewValue = 0;
  momentActive = false;
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
        !this.state.expandContent && this.props.isActivePanResponder;
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
      this.state.animatedTranslateYScrollView.stopAnimation();
    },
    // onPanResponderTerminate: evt => true,
    onPanResponderRelease: (evt, { dy, vy }) => {
      this.isAnimating = true;
      const breakPointTop = this.state.middlePositionAnimatableArea - 50;
      const breakPointBottom = this.state.middlePositionAnimatableArea + 50;
      const breakVelocity = 0.5;
      this.state.animatedTranslateYScrollView.flattenOffset();
      const abs_vy = Math.abs(vy);

      // move down
      if (vy > 0) {
        if (
          abs_vy >= breakVelocity ||
          this.animatedTranslateYScrollViewValue >= breakPointTop
        ) {
          // go to bottom
          this.goToBottom();
        } else {
          // back to top
          this.animateScrollView(0).start(() => (this.isAnimating = false));
        }
      }

      //move up
      else if (vy < 0) {
        if (
          abs_vy >= breakVelocity ||
          this.animatedTranslateYScrollViewValue <= breakPointBottom
        ) {
          // go to top
          this.goToTop();
        } else {
          // back to bottom
          this.animateScrollView(this.state.animatableArea).start(
            () => (this.isAnimating = false)
          );
        }
      } else {
        if (this.animatedTranslateYScrollViewValue >= breakPointTop) {
          this.goToBottom();
        } else if (this.animatedTranslateYScrollViewValue <= breakPointBottom) {
          this.goToTop();
        }
      }
    }
  });

  goToBottom = () => {
    setTimeout(() => this.props.onCollapsingBodyContent());

    this.animateScrollView(this.state.animatableArea).start(({ finished }) => {
      if (finished) {
        this.props.onCollapsedBodyContent();
        this.isAnimating = false;
        this.setState({ expandContent: false });
      }
    });
  };

  goToTop = () => {
    setTimeout(() => this.props.onExpandingBodyContent());

    this.animateScrollView(0).start(({ finished }) => {
      if (finished) {
        this.props.onExpandedBodyContent();
        this.isAnimating = false;
        this.setState({
          expandContent: true
        });
      }
    });
  };

  getAnimatableArea(
    collapsedBodyHeight = this.props.collapsedBodyHeight,
    headerHeight = this.props.headerHeight
  ) {
    return (
      Dimensions.get('window').height -
      (collapsedBodyHeight +
        headerHeight +
        //  - ANDROID_STATUS_BAR_HEIGHT
        // (isAndroidEmulator ? ANDROID_STATUS_BAR_HEIGHT : 0) +
        BOTTOM_SPACE_IPHONE_X)
    );
  }

  getMiddlePositionAnimatableArea(
    collapsedBodyHeight = this.props.collapsedBodyHeight,
    headerHeight = this.props.headerHeight
  ) {
    return this.getAnimatableArea(collapsedBodyHeight, headerHeight) / 2;
  }

  get animatedShowUpValue() {
    return this.state.animatedShowUpValue;
  }

  get animatedTranslateYScrollView() {
    return this.state.animatedTranslateYScrollView;
  }

  get actualScrollViewHeightValue() {
    return this.actualScrollViewHeight;
  }

  updateActualScrollViewHeight(otherHeight = this.props.headerHeight) {
    this.actualScrollViewHeight = Dimensions.get('window').height - otherHeight;
    // + ANDROID_STATUS_BAR_HEIGHT;
  }

  animateScrollView(toValue) {
    this.isAnimating = true;
    return Animated.spring(this.state.animatedTranslateYScrollView, {
      toValue,
      overshootClamping: true,
      duration: this.props.durationShowBodyContent,
      useNativeDriver: true
    });
  }

  animateShowUp(toValue) {
    return Animated.spring(this.state.animatedShowUpValue, {
      toValue,
      overshootClamping: true,
      duration: this.props.durationShowBodyContent,
      useNativeDriver: true
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // *** specify props changes
    if (nextProps.visible !== this.props.visible) {
      this.isAnimating = true;

      Animated.parallel([
        this.animateShowUp(
          nextProps.visible ? nextProps.collapsedBodyHeight : 0
        ),
        this.animateScrollView(
          nextProps.visible ? nextState.animatableArea : HEIGHT
        )
      ]).start(({ finished }) => {
        if (finished) {
          this.props.onFinishVisibleAnimation(nextProps.visible);
          this.isAnimating = false;
          this.setState({
            isFinishOpenAnimation: nextProps.visible
          });
        }
      });

      if (!nextProps.visible && nextState.expandContent) {
        this.setState({ expandContent: false });
      }
    }

    if (
      nextProps.headerHeight !== this.props.headerHeight ||
      nextProps.collapsedBodyHeight !== this.props.collapsedBodyHeight
    ) {
      this.updateActualScrollViewHeight(nextProps.headerHeight);
      this.setState(
        {
          animatableArea: this.getAnimatableArea(
            nextProps.collapsedBodyHeight,
            nextProps.headerHeight
          ),
          middlePositionAnimatableArea: this.getMiddlePositionAnimatableArea(
            nextProps.collapsedBodyHeight,
            nextProps.headerHeight
          )
        },
        () => {
          if (this.props.visible) {
            Animated.parallel([
              this.animateShowUp(this.props.collapsedBodyHeight),
              this.animateScrollView(this.state.animatableArea)
            ]).start();
          }
        }
      );
    }

    if (nextProps.expandContent !== this.props.expandContent) {
      if (!nextProps.expandContent && nextProps.visible) {
        setTimeout(() => nextProps.onCollapsingBodyContent());
        this.animateScrollView(nextState.animatableArea).start(
          ({ finished }) => {
            if (finished) {
              this.isAnimating = false;
              this.setState({ expandContent: false });
              nextProps.onCollapsedBodyContent();
            }
          }
        );
      }
    } else if (nextState.expandContent !== this.state.expandContent) {
      if (!nextState.expandContent && nextProps.visible) {
        setTimeout(() => nextProps.onCollapsingBodyContent());
        this.animateScrollView(nextState.animatableArea).start(
          ({ finished }) => {
            if (finished) {
              this.isAnimating = false;
              nextProps.onCollapsedBodyContent();
            }
          }
        );
      }
    }

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.isActivePanResponder !== this.props.isActivePanResponder ||
      nextProps.headerHeight !== this.props.headerHeight ||
      nextProps.collapsedBodyHeight !== this.props.collapsedBodyHeight ||
      nextProps.defaultStatusBarColor !== this.props.defaultStatusBarColor ||
      nextProps.visible !== this.props.visible ||
      nextProps.extraData !== this.props.extraData ||
      nextProps.expandContent !== this.props.expandContent ||
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
  }

  onAnimatedValueChange({ value }) {
    const bottom = this.state.animatableArea;
    const top = 0;
    if (value <= top && !this.state.expandContent) {
      if (isAndroid) {
        StatusBar.setBackgroundColor('black', true);
      }
      // console.log('top');
    }

    if (value >= bottom && this.state.expandContent) {
      if (this.animatedTranslateYScrollViewValue !== bottom && isAndroid) {
        StatusBar.setBackgroundColor(this.props.defaultStatusBarColor, true);
      }

      this.offset = 0;
      // console.log('bottom');
    }
    this.animatedTranslateYScrollViewValue = value;
  }

  render() {
    console.log('== render gesture');
    const scrollPan = this.props.isActivePanResponder && {
      ...this.panResponder.panHandlers
    };
    const translateY = this.state.animatedTranslateYScrollView.interpolate({
      inputRange: [0, this.state.animatableArea],
      outputRange: [0, this.state.animatableArea],
      extrapolate:
        this.props.visible && this.state.isFinishOpenAnimation
          ? 'clamp'
          : 'identity'
    });

    return (
      <>
        {this.props.renderBefore}
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
          {this.props.children}
        </Animated.View>
      </>
    );
  }
}

const styles = StyleSheet.create({
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
    flex: 1
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
  }
});

export default GestureWrapper;
