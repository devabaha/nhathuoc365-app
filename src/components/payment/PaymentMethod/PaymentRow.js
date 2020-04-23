import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Clipboard
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import extractBrush from 'react-native-svg/lib/module/lib/extract/extractBrush';
import { interpolate } from 'flubber';
import appConfig from 'app-config';
import Ionicon from 'react-native-vector-icons/Ionicons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { default as Reanimated, Easing } from 'react-native-reanimated';

const CIRCLE_PATH =
  'M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364z';
const CIRCLE_CHECK_PATH =
  'M21 11.080v0.92c-0.001 2.485-1.009 4.733-2.64 6.362s-3.88 2.634-6.365 2.632-4.734-1.009-6.362-2.64-2.634-3.879-2.633-6.365 1.009-4.733 2.64-6.362 3.88-2.634 6.365-2.633c1.33 0.001 2.586 0.289 3.649 0.775 0.502 0.23 1.096 0.008 1.325-0.494s0.008-1.096-0.494-1.325c-1.327-0.606-2.866-0.955-4.479-0.956-3.037-0.002-5.789 1.229-7.78 3.217s-3.224 4.74-3.226 7.777 1.229 5.789 3.217 7.78 4.739 3.225 7.776 3.226 5.789-1.229 7.78-3.217 3.225-4.739 3.227-7.777v-0.92c0-0.552-0.448-1-1-1s-1 0.448-1 1zM21.293 3.293l-9.293 9.302-2.293-2.292c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l3 3c0.391 0.391 1.024 0.39 1.415 0l10-10.010c0.39-0.391 0.39-1.024-0.001-1.414s-1.024-0.39-1.414 0.001z';
const pathInterpolate = interpolate(CIRCLE_PATH, CIRCLE_CHECK_PATH, {
  maxSegmentLength: 1
});
const AnimatedIconAntDesign = Animated.createAnimatedComponent(IconAntDesign);

class PaymentRow extends Component {
  state = {
    animated: new Animated.Value(0),
    animatedHeight: new Reanimated.Value(0),
    animatedScroll: new Animated.Value(0),
    bankTransferHeight: null,
    bankTransferScrollHeight: null,
    paymentRowHeight: null,
    preparedData: false,
    scrollable: undefined
  };
  _refCheckBox = null;
  collapsed = true;
  unmounted = false;

  componentDidMount() {
    this.state.animated.addListener(this.animationListener);
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.state.animated.removeListener(this.animationListener);
  }

  animationListener = ({ value }) => {
    if (this._refCheckBox) {
      const path = pathInterpolate(value);
      this._refCheckBox.setNativeProps({
        d: path
      });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.active !== this.props.active || nextProps.active) {
      if (
        nextProps.active !== this.props.active ||
        (nextProps.active && nextState.preparedData && !this.state.preparedData)
      ) {
        Reanimated.timing(this.state.animatedHeight, {
          toValue: nextProps.active ? 1 : 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }).start();
      }
      Animated.timing(this.state.animated, {
        toValue: nextProps.active ? 1 : 0,
        duration: 200,
        useNativeDriver: true
      }).start();
      this._refCheckBox.setNativeProps({
        fill: extractBrush(nextProps.active ? DEFAULT_COLOR : '#555')
      });
    }

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.active !== this.props.active ||
      nextProps.title !== this.props.title ||
      nextProps.subTitle !== this.props.subTitle
    ) {
      return true;
    }

    return true;
  }

  onBankTransferLayout = e => {
    if (!this.state.bankTransferHeight) {
      this.setState({ bankTransferHeight: e.nativeEvent.layout.height }, () => {
        setTimeout(() => {
          !this.unmounted && this.setState({ preparedData: true });
        }, 200);
      });
    }
  };

  onBankTransferScrollLayout = e => {
    if (!this.state.bankTransferScrollHeight) {
      this.setState({
        bankTransferScrollHeight: e.nativeEvent.layout.height
      });
    }
  };

  onBankContentScrollLayout = e => {
    if (this.state.scrollable === undefined && this.props.active) {
      this.setState({
        scrollable: e.nativeEvent.layout.width > appConfig.device.width
      });
    }
  };

  onPaymentRowLayout = e => {
    if (!this.state.paymentRowHeight) {
      this.setState({ paymentRowHeight: e.nativeEvent.layout.height });
    }
  };

  onCopyBankAccountNumber = bankAccountNumber => {
    Clipboard.setString(bankAccountNumber);
    Toast.show('Đã sao chép số TK vào bộ nhớ tạm');
  };

  renderBankAccounts = () => {
    return this.props.bankTransferData.map((bank, index) => {
      const extraStyle = index === this.props.bankTransferData.length - 1 && {
        marginRight: 15
      };

      return (
        <View key={bank.id} style={[styles.bankTransferContainer, extraStyle]}>
          <Text style={styles.bankTransferName}>{bank.name}</Text>
          <Text style={styles.bankTransferLabel}>
            Chủ TK:{' '}
            <Text style={styles.bankTransferInfo}>{bank.account_holder}</Text>
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.bankTransferLabel}>
              Số TK:{' '}
              <Text style={styles.bankTransferInfo}>{bank.account_number}</Text>
            </Text>
            <TouchableOpacity
              hitSlop={HIT_SLOP}
              style={{ marginHorizontal: 7 }}
              onPress={() => this.onCopyBankAccountNumber(bank.account_number)}
            >
              <Ionicon name="ios-copy" style={styles.copyIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.bankTransferLabel}>
            Chi nhánh:{' '}
            <Text style={styles.bankTransferInfo}>{bank.branch}</Text>
          </Text>
        </View>
      );
    });
  };

  renderDirectionIcons() {
    const animatedLeftIconStyle = this.state.bankTransferScrollHeight && {
      transform: [
        {
          translateX: this.state.animatedScroll.interpolate({
            inputRange: [
              (this.state.bankTransferScrollHeight * 2) / 3,
              this.state.bankTransferScrollHeight
            ],
            outputRange: [-50, 0],
            extrapolateRight: 'clamp'
          })
        }
      ],
      opacity: this.state.animatedScroll.interpolate({
        inputRange: [0, this.state.bankTransferScrollHeight],
        outputRange: [0, 1]
      })
    };
    const animatedRightIconStyle = this.state.bankTransferScrollHeight && {
      transform: [
        {
          translateX: this.state.animatedScroll.interpolate({
            inputRange: [0, this.state.bankTransferScrollHeight],
            outputRange: [0, 50],
            extrapolateLeft: 'clamp'
          })
        }
      ],
      opacity: this.state.animatedScroll.interpolate({
        inputRange: [0, this.state.bankTransferScrollHeight],
        outputRange: [1, 0]
      })
    };

    return (
      <View style={styles.directionIcons}>
        <AnimatedIconAntDesign
          name="swapleft"
          style={[styles.bankSwapLeftIcon, animatedLeftIconStyle]}
        />
        <AnimatedIconAntDesign
          name="swapright"
          style={[styles.bankSwapRightIcon, animatedRightIconStyle]}
        />
      </View>
    );
  }

  renderBankTransferData() {
    const condition =
      this.props.bankTransferData && this.props.bankTransferData.length !== 0;
    let animatedHeightStyle = null,
      animatedOpacityStyle = null,
      MIN_HEIGHT = null,
      MAX_HEIGHT = null;

    if (condition) {
      MIN_HEIGHT = new Reanimated.Value(0);
      MAX_HEIGHT =
        this.state.bankTransferHeight &&
        new Reanimated.Value(this.state.bankTransferHeight);

      animatedHeightStyle = this.state.bankTransferHeight && {
        height: Reanimated.interpolate(this.state.animatedHeight, {
          inputRange: [0, 1],
          outputRange: [MIN_HEIGHT, MAX_HEIGHT]
        })
      };

      animatedOpacityStyle = {
        position: this.state.preparedData ? 'relative' : 'absolute',
        opacity: this.state.preparedData
          ? Reanimated.interpolate(this.state.animatedHeight, {
              inputRange: [0, 0.6, 1],
              outputRange: [0, 0, 1]
            })
          : 0
      };
    }

    return (
      condition && (
        <Reanimated.View
          onLayout={this.onBankTransferLayout}
          style={[animatedHeightStyle, animatedOpacityStyle]}
        >
          {this.state.scrollable && this.renderDirectionIcons()}
          <GradientView start />
          <Animated.ScrollView
            style={styles.bankTransferScrolView}
            onLayout={this.onBankTransferScrollLayout}
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.state.animatedScroll
                    }
                  }
                }
              ],
              { useNativeDriver: true }
            )}
            horizontal
          >
            <View
              style={{ flexDirection: 'row', width: '100%' }}
              onLayout={this.onBankContentScrollLayout}
            >
              {this.renderBankAccounts()}
            </View>
          </Animated.ScrollView>
          <GradientView end />
        </Reanimated.View>
      )
    );
  }

  render() {
    const imageStyle = this.state.paymentRowHeight && {
      width: this.state.paymentRowHeight,
      height: this.state.paymentRowHeight
    };

    return (
      <View>
        <TouchableWithoutFeedback
          underlayColor="#fff"
          onPress={this.props.onPress}
        >
          <View style={styles.paymentContainer}>
            <View onLayout={this.onPaymentRowLayout} style={styles.row}>
              <Svg width="20" height="20">
                <Path
                  ref={inst => (this._refCheckBox = inst)}
                  d={CIRCLE_PATH}
                  strokeWidth={0}
                  fill="#555"
                  scale={0.8}
                />
              </Svg>
              <View style={styles.bankMainContent}>
                {!!this.props.image && (
                  <View style={[styles.bankImage, imageStyle]}>
                    <CachedImage
                      source={{ uri: this.props.image }}
                      style={{ flex: 1 }}
                    />
                  </View>
                )}
                <View>
                  <Text style={styles.paymentMethodLabel}>
                    {this.props.title}
                  </Text>
                  {!!this.props.subTitle && (
                    <Text style={styles.subPaymentMethodLabel}>
                      {this.props.subTitle}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            {this.props.renderRight}
          </View>
        </TouchableWithoutFeedback>
        {!!this.props.bankTransferData && this.renderBankTransferData()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentMethodLabel: {
    fontSize: 15,
    fontWeight: appConfig.device.isIOS ? '500' : '500',
    color: appConfig.colors.text,
    marginBottom: 3
  },
  subPaymentMethodLabel: {
    fontSize: 13,
    color: '#8c8c8c'
  },
  bankTransferName: {
    fontSize: 18,
    letterSpacing: 1.5,
    fontWeight: '800',
    color: '#333',
    marginBottom: 7
  },
  bankTransferLabel: {
    fontSize: 14,
    fontWeight: appConfig.device.isIOS ? '400' : '200',
    color: '#555',
    marginBottom: appConfig.device.isIOS ? 3 : 0
  },
  bankTransferInfo: {
    fontSize: 16,
    fontWeight: appConfig.device.isIOS ? '500' : '400',
    color: '#242424'
  },
  bankTransferScrolView: {
    flex: 1,
    paddingVertical: 15
  },
  bankTransferContainer: {
    marginLeft: 30,
    paddingHorizontal: 15,
    paddingTop: 7,
    paddingBottom: 15
  },
  gradient: {
    height: '100%',
    flex: 1,
    width: 30,
    zIndex: 1
  },
  gradientStart: {
    position: 'absolute',
    left: 0
  },
  gradientEnd: {
    position: 'absolute',
    right: 0
  },
  copyIcon: {
    alignSelf: 'center',
    color: hexToRgbA(DEFAULT_COLOR, 0.7),
    fontSize: 16
  },
  bankMainContent: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bankImage: {
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 7,
    resizeMode: 'contain',
    backgroundColor: '#f7f7f7',
    maxWidth: 50,
    maxHeight: 50
  },
  directionIcons: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: -7,
    width: '100%',
    paddingHorizontal: 7
  },
  bankSwapRightIcon: {
    fontSize: 35,
    color: '#eee'
  },
  bankSwapLeftIcon: {
    fontSize: 35,
    color: '#eee'
  }
});

export default PaymentRow;

const GradientView = props => (
  <LinearGradient
    colors={[
      'rgba(255,255,255,0)',
      'rgba(255,255,255,.25)',
      'rgba(255,255,255,.5)'
    ]}
    locations={[
      props.start ? 1 : 0,
      props.start ? 0.45 : 0.55,
      props.start ? 0 : 1
    ]}
    angle={90}
    useAngle
    style={[
      styles.gradient,
      props.start ? styles.gradientStart : props.end ? styles.gradientEnd : {}
    ]}
  />
);
