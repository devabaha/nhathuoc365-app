import React, {Component} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
// 3-party libs
import Svg, {Path} from 'react-native-svg';
import {separate, splitPathString} from 'flubber';
import Reanimated, {Easing} from 'react-native-reanimated';
import Clipboard from '@react-native-community/clipboard';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import extractBrush from 'react-native-svg/lib/module/lib/extract/extractBrush';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import GradientView from './GradientView';
import Image from 'src/components/Image';
import {
  Typography,
  Icon,
  IconButton,
  Container,
  BaseButton,
  ScrollView,
  Card,
} from 'src/components/base';

const CIRCLE_PATH =
  'M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364z';
const CIRCLE_CHECK_PATH =
  'M21 11.080v0.92c-0.001 2.485-1.009 4.733-2.64 6.362s-3.88 2.634-6.365 2.632-4.734-1.009-6.362-2.64-2.634-3.879-2.633-6.365 1.009-4.733 2.64-6.362 3.88-2.634 6.365-2.633c1.33 0.001 2.586 0.289 3.649 0.775 0.502 0.23 1.096 0.008 1.325-0.494s0.008-1.096-0.494-1.325c-1.327-0.606-2.866-0.955-4.479-0.956-3.037-0.002-5.789 1.229-7.78 3.217s-3.224 4.74-3.226 7.777 1.229 5.789 3.217 7.78 4.739 3.225 7.776 3.226 5.789-1.229 7.78-3.217 3.225-4.739 3.227-7.777v-0.92c0-0.552-0.448-1-1-1s-1 0.448-1 1zM21.293 3.293l-9.293 9.302-2.293-2.292c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l3 3c0.391 0.391 1.024 0.39 1.415 0l10-10.010c0.39-0.391 0.39-1.024-0.001-1.414s-1.024-0.39-1.414 0.001z';
const pathInterpolate = separate(
  CIRCLE_PATH,
  splitPathString(CIRCLE_CHECK_PATH),
  {
    maxSegmentLength: 1,
    single: true,
  },
);

class PaymentRow extends Component {
  static contextType = ThemeContext;

  state = {
    animated: new Animated.Value(0),
    animatedHeight: new Reanimated.Value(0),
    animatedScroll: new Animated.Value(0),
    bankTransferHeight: null,
    bankTransferScrollHeight: null,
    paymentRowHeight: null,
    preparedData: false,
    scrollable: undefined,
  };
  _refCheckBox = null;
  collapsed = true;
  unmounted = false;

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.state.animated.addListener(this.animationListener);
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.state.animated.removeListener(this.animationListener);
  }

  animationListener = ({value}) => {
    if (this._refCheckBox) {
      const path = pathInterpolate(value);
      this._refCheckBox.setNativeProps({
        d: path,
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
          useNativeDriver: true,
        }).start();
      }
      Animated.timing(this.state.animated, {
        toValue: nextProps.active ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      this._refCheckBox.setNativeProps({
        fill: extractBrush(
          nextProps.active ? this.checkBoxActiveColor : this.checkBoxFillColor,
        ),
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

  onBankTransferLayout = (e) => {
    if (!this.state.bankTransferHeight) {
      this.setState({bankTransferHeight: e.nativeEvent.layout.height}, () => {
        setTimeout(() => {
          !this.unmounted && this.setState({preparedData: true});
        }, 200);
      });
    }
  };

  onBankTransferScrollLayout = (e) => {
    if (!this.state.bankTransferScrollHeight) {
      this.setState({
        bankTransferScrollHeight: e.nativeEvent.layout.height,
      });
    }
  };

  onBankContentScrollLayout = (e) => {
    if (this.state.scrollable === undefined && this.props.active) {
      this.setState({
        scrollable: e.nativeEvent.layout.width > appConfig.device.width,
      });
    }
  };

  onPaymentRowLayout = (e) => {
    if (!this.state.paymentRowHeight) {
      this.setState({paymentRowHeight: e.nativeEvent.layout.height});
    }
  };

  onCopyBankAccountNumber = (bankAccountNumber) => {
    Clipboard.setString(bankAccountNumber);
    Toast.show(this.props.t('copyCompleteMessage'));
  };

  renderBankAccounts = () => {
    const {t} = this.props;

    return this.props.bankTransferData.map((bank, index) => {
      const extraStyle = index === this.props.bankTransferData.length - 1 && {
        marginRight: 15,
      };

      return (
        <Card key={index} style={[styles.bankTransferContainer, extraStyle]}>
          <Typography
            type={TypographyType.TITLE_SEMI_LARGE}
            style={styles.bankTransferName}>
            {bank.name}
          </Typography>
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={styles.bankTransferLabel}>
            {t('bankTransfer.owner')}
            <Typography
              type={TypographyType.LABEL_LARGE}
              style={styles.bankTransferInfo}>
              {bank.account_holder}
            </Typography>
          </Typography>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.bankTransferLabel}>
              {t('bankTransfer.accountNumber')}
              <Typography
                type={TypographyType.LABEL_LARGE}
                style={styles.bankTransferInfo}>
                {bank.account_number}
              </Typography>
            </Typography>
            <IconButton
              hitSlop={HIT_SLOP}
              style={{marginHorizontal: 7}}
              onPress={() => this.onCopyBankAccountNumber(bank.account_number)}
              bundle={BundleIconSetName.IONICONS}
              name="ios-copy"
              iconStyle={this.iconCopyStyle}
            />
          </View>
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={styles.bankTransferLabel}>
            {t('bankTransfer.branch')}
            <Typography
              type={TypographyType.LABEL_LARGE}
              style={styles.bankTransferInfo}>
              {bank.branch}
            </Typography>
          </Typography>
        </Card>
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
              this.state.bankTransferScrollHeight,
            ],
            outputRange: [-50, 0],
            extrapolateRight: 'clamp',
          }),
        },
      ],
      opacity: this.state.animatedScroll.interpolate({
        inputRange: [0, this.state.bankTransferScrollHeight],
        outputRange: [0, 1],
      }),
    };
    const animatedRightIconStyle = this.state.bankTransferScrollHeight && {
      transform: [
        {
          translateX: this.state.animatedScroll.interpolate({
            inputRange: [0, this.state.bankTransferScrollHeight],
            outputRange: [0, 50],
            extrapolateLeft: 'clamp',
          }),
        },
      ],
      opacity: this.state.animatedScroll.interpolate({
        inputRange: [0, this.state.bankTransferScrollHeight],
        outputRange: [1, 0],
      }),
    };

    return (
      <View style={styles.directionIcons}>
        <Icon
          animated
          bundle={BundleIconSetName.ANT_DESIGN}
          name="swapleft"
          neutral
          style={[styles.bankDirectionIcon, animatedLeftIconStyle]}
        />
        <Icon
          animated
          bundle={BundleIconSetName.ANT_DESIGN}
          name="swapright"
          neutral
          style={[styles.bankDirectionIcon, animatedRightIconStyle]}
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
          outputRange: [MIN_HEIGHT, MAX_HEIGHT],
        }),
      };

      animatedOpacityStyle = {
        position: this.state.preparedData ? 'relative' : 'absolute',
        opacity: this.state.preparedData
          ? Reanimated.interpolate(this.state.animatedHeight, {
              inputRange: [0, 0.6, 1],
              outputRange: [0, 0, 1],
            })
          : 0,
      };
    }

    return (
      condition && (
        <Reanimated.View
          onLayout={this.onBankTransferLayout}
          style={[animatedHeightStyle, animatedOpacityStyle]}>
          {this.state.scrollable && this.renderDirectionIcons()}
          <GradientView start />
          <ScrollView
            animated
            style={styles.bankTransferScrollView}
            onLayout={this.onBankTransferScrollLayout}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.state.animatedScroll,
                    },
                  },
                },
              ],
              {useNativeDriver: true},
            )}
            horizontal>
            <View
              style={{flexDirection: 'row', width: '100%'}}
              onLayout={this.onBankContentScrollLayout}>
              {this.renderBankAccounts()}
            </View>
          </ScrollView>
          <GradientView end />
        </Reanimated.View>
      )
    );
  }

  get iconCopyStyle() {
    return [
      styles.copyIcon,
      {
        color: this.theme.color.primaryHighlight,
      },
    ];
  }

  get checkBoxFillColor() {
    return this.theme.color.iconInactive;
  }

  get checkBoxActiveColor() {
    return this.theme.color.primaryHighlight;
  }

  render() {
    const imageStyle = this.state.paymentRowHeight && {
      // width: this.state.paymentRowHeight,
      // height: this.state.paymentRowHeight,
      width: 30,
      height: 30,
    };

    return (
      <Container>
        <BaseButton useTouchableHighlight onPress={this.props.onPress}>
          <View style={styles.paymentContainer}>
            <View onLayout={this.onPaymentRowLayout} style={styles.row}>
              <Svg width="20" height="20">
                <Path
                  ref={(inst) => (this._refCheckBox = inst)}
                  d={CIRCLE_PATH}
                  strokeWidth={0}
                  fill={this.checkBoxFillColor}
                  scale={0.8}
                />
              </Svg>
              <View style={styles.bankMainContent}>
                {!!this.props.image && (
                  <Container style={[styles.bankImage, imageStyle]}>
                    <Image source={{uri: this.props.image}} />
                  </Container>
                )}
                <View style={styles.paymentMethodTextContainer}>
                  <Typography
                    type={TypographyType.LABEL_SEMI_LARGE}
                    style={styles.paymentMethodLabel}>
                    {this.props.title}
                  </Typography>
                  {!!this.props.subTitle && (
                    <Typography
                      type={TypographyType.DESCRIPTION_SEMI_MEDIUM}
                      style={styles.subPaymentMethodLabel}>
                      {this.props.subTitle}
                    </Typography>
                  )}
                </View>
              </View>
            </View>
            {this.props.renderRight}
          </View>
        </BaseButton>
        {!!this.props.bankTransferData && this.renderBankTransferData()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodTextContainer: {
    flex: 1,
    // flexWrap: 'wrap'
  },
  paymentMethodLabel: {
    fontWeight: appConfig.device.isIOS ? '500' : '500',
    marginBottom: 3,
  },
  subPaymentMethodLabel: {},
  bankTransferName: {
    letterSpacing: 1.5,
    fontWeight: '800',
    marginBottom: 7,
  },
  bankTransferLabel: {
    fontWeight: appConfig.device.isIOS ? '400' : '200',
    marginBottom: appConfig.device.isIOS ? 3 : 0,
  },
  bankTransferInfo: {
    fontWeight: appConfig.device.isIOS ? '500' : '400',
  },
  bankTransferScrollView: {
    flex: 1,
    paddingVertical: 15,
  },
  bankTransferContainer: {
    marginLeft: 15,
    paddingHorizontal: 15,
    paddingTop: 7,
    paddingBottom: 15,
    width: appConfig.device.width * 0.75,
  },
  gradient: {
    height: '100%',
    flex: 1,
    width: 30,
    zIndex: 1,
  },
  gradientStart: {
    position: 'absolute',
    left: 0,
  },
  gradientEnd: {
    position: 'absolute',
    right: 0,
  },
  copyIcon: {
    alignSelf: 'center',
    fontSize: 16,
  },
  bankMainContent: {
    paddingHorizontal: 15,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankImage: {
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 7,
    resizeMode: 'contain',
    width: 30,
    height: 30,
  },
  directionIcons: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: -7,
    width: '100%',
    paddingHorizontal: 7,
  },
  bankDirectionIcon: {
    fontSize: 35,
  },
});

export default withTranslation('paymentMethod')(PaymentRow);
