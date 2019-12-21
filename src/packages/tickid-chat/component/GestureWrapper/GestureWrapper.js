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

const isAndroid = Platform.OS === 'android';
const isIos = Platform.OS === 'ios';
const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');
const ANDROID_STATUS_BAR = StatusBar.currentHeight;
const HIT_SLOP = { right: 15, top: 15, left: 15, bottom: 15 };
const BODY_ITEMS_PER_ROW = 3;
const BODY_ITEM_HEIGHT = 150;
const HEADER_HEIGHT = isIos ? 64 : 50;
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
    isActivePanResponder: PropTypes.bool,
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
    isActivePanResponder: true,
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
    bodyData: [],
    contentFlatListProps: {}
  };

  state = {
    scrollable: false,
    expandContent: false,
    animatedAlbumHeight: new Animated.Value(0),
    openPanel: false
  };

  animatedTranslateYScrollView = new Animated.Value(
    -this.props.collapsedBodyHeight
  );
  animatedShowUpValue = new Animated.Value(0);

  offset = 0;
  animatedTranslateYScrollViewValue = 0;
  momentActive = false;
  isAnimating = false;
  isScrolling = false;
  refScrollView = null;
  actualScrollViewHeight = 0;
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    onMoveShouldSetResponder: () => true,
    onMoveShouldSetResponderCapture: () => true,
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

      if (
        ges.dy < 0 &&
        this.offset <= 0 &&
        this.state.openPanel &&
        this.scrollable()
      ) {
        // console.log('can scroll');
        this.setState({ scrollable: true });
      }
      if (ges.dy < 0 && !this.state.openPanel && !this.isAnimating) {
        this.isAnimating = true;
        this.props.startExpandingBodyContent();

        Animated.spring(this.animatedTranslateYScrollView, {
          toValue: this.actualScrollViewHeight,
          duration: this.props.durationShowBodyContent,
          useNativeDriver: true
        }).start(res => {
          this.isAnimating = false;
          // console.log('expanded');
          this.setState({
            openPanel: true
          });
        });
      }
      if (ges.dy > 0 && this.state.openPanel && !this.isAnimating) {
        this.isAnimating = false;
        // console.log('collapsing');
        this.setState({
          openPanel: false,
          scrollable: false
        });
      }
    }

    // Animated.,

    // onPanResponderTerminationRequest: (evt, gestureState) => true,
    // onPanResponderGrant: (e) => {
    //   this.animatedTranslateYScrollView.setOffset({
    //     y: this._y
    //   })
    // },
    // onPanResponderTerminate: evt => true,
    // onPanResponderRelease: evt => this.handlePanResponderEnd(evt.nativeEvent),
  });

  updateActualScrollViewHeight(otherHeight = this.props.headerHeight) {
    this.actualScrollViewHeight =
      HEIGHT - otherHeight - (isAndroid ? ANDROID_STATUS_BAR : 0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      if (nextState.openPanel !== this.state.openPanel) {
        if (!nextState.openPanel) {
          this.refScrollView &&
            this.refScrollView.scrollToOffset({ animated: false, offset: 0 });
          this.props.startCollapsingBodyContent();

          Animated.spring(this.animatedTranslateYScrollView, {
            toValue: 0,
            duration: this.props.durationShowBodyContent,
            useNativeDriver: true
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
      nextProps.extraBodyContent !== this.props.extraBodyContent
    ) {
      if (nextProps.headerHeight !== this.props.headerHeight) {
        this.updateActualScrollViewHeight();
      }
      if (nextProps.visible !== this.props.visible) {
        if (!nextProps.visible) {
          this.refScrollView &&
            this.refScrollView.scrollToOffset({ animated: false, offset: 0 });
        }

        Animated.parallel([
          Animated.timing(this.animatedShowUpValue, {
            toValue: nextProps.visible ? nextProps.collapsedBodyHeight : 0,
            duration: this.props.durationShowBodyContent,
            easing: Easing.in
          }),
          Animated.timing(this.animatedTranslateYScrollView, {
            toValue: nextProps.visible ? 0 : -nextProps.collapsedBodyHeight,
            duration: this.props.durationShowBodyContent,
            easing: Easing.in,
            useNativeDriver: true
          })
        ]).start();
      }

      return true;
    }

    return false;
  }

  componentDidMount() {
    this.updateActualScrollViewHeight();
    this.animatedTranslateYScrollView.addListener(
      this.onAnimatedValueChange.bind(this)
    );
  }

  componentWillUnmount() {
    this.animatedTranslateYScrollView.removeListener(
      this.onAnimatedValueChange.bind(this)
    );
  }

  onAnimatedValueChange({ value }) {
    const bottom = 0;
    if (value === this.actualScrollViewHeight && !this.state.openPanel) {
      if (isAndroid) {
        StatusBar.setBackgroundColor('black', true);
      }
      // console.log('top');
      this.props.onExpandedBodyContent();
    }

    if (value === bottom || (value <= bottom && this.state.openPanel)) {
      if (this.animatedTranslateYScrollViewValue !== bottom && isAndroid) {
        StatusBar.setBackgroundColor(this.props.defaultStatusBarColor, true);
      }

      this.offset = 0;
      // console.log('bottom');
      this.setState({ scrollable: false, openPanel: false });
    }
    this.animatedTranslateYScrollViewValue = value;
  }

  scrollable(data = this.props.bodyData) {
    return (
      Math.ceil(data.length / this.props.bodyItemPerRow) *
        this.props.bodyItemHeight >
      HEIGHT
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
    this.offset = y;
    if (!this.momentActive) {
      if (this.offset <= 0) {
        this.setState({
          openPanel: false,
          scrollable: false
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
        openPanel: false,
        scrollable: false
      });
    }

    // this.offset = e.nativeEvent.contentOffset.y;
  }
  //END - handle everything about gallery scroll event

  handleCloseModal() {
    if (this.state.expandContent) {
      this.props.onHeaderClosePress();
    } else {
      this.isAnimating = true;
      this.offset = 0;
      this.setState({
        openPanel: false,
        scrollable: false
      });

      setTimeout(() => {
        Animated.timing(this.animatedTranslateYScrollView, {
          toValue: 0,
          duration: this.props.durationShowBodyContent,
          easing: Easing.in,
          useNativeDriver: true
        }).start(() => {
          this.isAnimating = false;
        });
      });
    }
  }

  render() {
    // console.log(this.state.openPanel, 'scrollable');
    const scrollPan = !this.state.scrollable &&
      this.props.isActivePanResponder && {
        ...this.panResponder.panHandlers
      };
    const opacity = this.animatedTranslateYScrollView.interpolate({
      inputRange: [0, this.actualScrollViewHeight],
      outputRange: [0, 1]
    });
    return (
      <>
        {!!this.props.header && (
          <>
            <Animated.View
              style={[
                styles.center,
                styles.header,
                {
                  opacity,
                  height: this.props.headerHeight
                }
              ]}
              pointerEvents={this.state.openPanel ? 'auto' : 'none'}
            >
              <TouchableOpacity
                hitSlop={HIT_SLOP}
                style={[styles.btnCloseHeader, this.props.btnCloseHeaderStyle]}
                onPress={this.handleCloseModal.bind(this)}
              >
                {this.props.btnHeaderClose}
              </TouchableOpacity>
              {this.props.header}
            </Animated.View>
            {this.props.headerContent}
          </>
        )}

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
                  translateY: this.animatedTranslateYScrollView.interpolate({
                    inputRange: [
                      -this.props.collapsedBodyHeight,
                      0,
                      this.actualScrollViewHeight
                    ],
                    outputRange: [
                      HEIGHT,
                      HEIGHT -
                        this.props.headerHeight -
                        (isAndroid ? ANDROID_STATUS_BAR + 8 : 0) -
                        (this.props.visible
                          ? this.props.collapsedBodyHeight
                          : 0),
                      this.props.headerHeight
                    ]
                  })
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
