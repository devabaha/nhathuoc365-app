import React, {Component} from 'react';
import {StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Animated, {Easing, interpolate} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Container from '../../Layout/Container';
import OverlayIconButton from './OverlayIconButton';
import RightButtonNavBar from '../../RightButtonNavBar';
import {RIGHT_BUTTON_TYPE} from '../../RightButtonNavBar/constants';
import {CONFIG_KEY, isConfigActive} from 'src/helper/configKeyHandler';
import {BACK_NAV_ICON_NAME} from '../../../constants';
import appConfig from 'app-config';

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 999,
    paddingTop: appConfig.device.isAndroid
      ? appConfig.device.statusBarHeight
      : 0,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '200%',
    backgroundColor: '#fff',
    ...elevationShadowStyle(3),
    bottom: 0,
  },
  mainWrapper: {
    width: '100%',
    elevation: 4,
  },
  mainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backBtn: {
    zIndex: 1,
  },
  backIcon: {
    fontSize: 26,
  },
  title: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 10,
    position: 'absolute',
  },
  containerIconStyle: {
    marginLeft: -3,
    marginRight: -5,
  },
});

const ACTIVE_OFFSET_TOP = 100;
const RIGHT_BUTTONS = [
  {
    type: RIGHT_BUTTON_TYPE.WAREHOUSE,
  },
  {
    type: RIGHT_BUTTON_TYPE.CHAT,
    iconName: 'ios-chatbubbles',
  },
  {
    type: RIGHT_BUTTON_TYPE.SHOPPING_CART,
    iconName: 'ios-cart',
  },
  {
    type: RIGHT_BUTTON_TYPE.SHARE,
    iconName: 'ios-share-social',
  },
];

class Header extends Component {
  static defaultProps = {
    item: {},
    onPressWarehouse: () => {},
  };
  state = {
    titleOriginWidth: 0,
  };
  animatedOpacity = new Animated.Value(0);
  animatedTranslate = new Animated.Value(0);
  animatedScale = new Animated.Value(1);
  animatingScrollDown = false;
  animatingScrollUp = false;
  animationDuration = 250;

  iconStyle = {
    opacity: this.animatedOpacity,
  };

  iconOverlayStyle = {
    transform: [
      {
        scale: interpolate(this.animatedScale, {
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  };
  iconBackgroundStyle = {
    opacity: interpolate(this.animatedOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };
  iconName = BACK_NAV_ICON_NAME;
  contentOverlayStyle = [this.iconBackgroundStyle, this.iconOverlayStyle];

  componentDidMount() {
    this.props.animatedValue.addListener(this.scrollListener);
  }

  componentWillUnmount() {
    this.props.animatedValue.removeListener(this.scrollListener);
  }

  scrollListener = ({value}) => {
    if (value > ACTIVE_OFFSET_TOP) {
      if (this.animatingScrollDown) return;
      this.animatingScrollDown = true;
      this.animatingScrollUp = false;
      this.animating(true);
    } else {
      if (this.animatingScrollUp) return;
      this.animatingScrollDown = false;
      this.animatingScrollUp = true;
      this.animating(false);
    }
  };

  animating = (isShow) => {
    Animated.timing(this.animatedOpacity, {
      toValue: isShow ? 1 : 0,
      duration: this.animationDuration,
      easing: Easing.quad,
      useNativeDriver: true,
    }).start();
    Animated.timing(this.animatedTranslate, {
      toValue: isShow ? 1 : 0,
      duration: this.animationDuration,
      easing: Easing.quad,
      useNativeDriver: true,
    }).start();
    Animated.timing(this.animatedScale, {
      toValue: isShow ? 0 : 1,
      duration: this.animationDuration,
      easing: Easing.quad,
      useNativeDriver: true,
    }).start();
  };

  handleTitleContainerLayout = (e) => {
    this.setState({
      titleOriginWidth: e.nativeEvent.layout.width,
    });
  };

  handlePressWarehouse = () => {
    this.props.onPressWarehouse();
  };

  renderWarehouseIcon = (iconStyle) => {
    return (
      <Animated.View>
        <AnimatedIcon name="warehouse" style={[iconStyle, this.iconStyle]} />
      </Animated.View>
    );
  };

  renderOverlayWarehouseIcon = (
    iconStyle,
    iconOverlayStyle,
    contentOverlayStyle,
  ) => {
    return (
      <Animated.View style={[contentOverlayStyle, this.contentOverlayStyle]}>
        <AnimatedIcon
          name="warehouse"
          style={[iconStyle, iconOverlayStyle, this.iconOverlayStyle]}
        />
      </Animated.View>
    );
  };

  renderRightButtons() {
    return RIGHT_BUTTONS.map((btn, index) => {
      if (
        btn.type === RIGHT_BUTTON_TYPE.WAREHOUSE &&
        !isConfigActive(CONFIG_KEY.SELECT_STORE_KEY)
      ) {
        return null;
      }
      const isLast = index === RIGHT_BUTTONS.length - 1;

      const narrowRightGapStyle = {
        left: interpolate(this.animatedTranslate, {
          inputRange: [0, 1],
          outputRange: [0, 7 * (RIGHT_BUTTONS.length - index)],
        }),
      };

      return (
        <Animated.View key={index} style={narrowRightGapStyle}>
          <RightButtonNavBar
            touchableOpacity
            type={btn.type}
            shareTitle={this.props.item.name}
            shareURL={this.props.item.url}
            onPress={
              btn.type === RIGHT_BUTTON_TYPE.WAREHOUSE
                ? this.handlePressWarehouse
                : null
            }
            icon={
              <OverlayIconButton
                iconName={btn.iconName}
                containerStyle={styles.containerIconStyle}
                backgroundStyle={this.iconBackgroundStyle}
                contentOverlayStyle={this.contentOverlayStyle}
                iconStyle={this.iconStyle}
                renderMainIcon={
                  btn.type === RIGHT_BUTTON_TYPE.WAREHOUSE
                    ? this.renderWarehouseIcon
                    : null
                }
                renderOverlayIcon={
                  btn.type === RIGHT_BUTTON_TYPE.WAREHOUSE
                    ? this.renderOverlayWarehouseIcon
                    : null
                }
                disabled
              />
            }
          />
        </Animated.View>
      );
    });
  }

  render() {
    const backgroundStyle = {
      opacity: this.animatedOpacity,
    };
    const narrowLeftGapStyle = {
      left: interpolate(this.animatedTranslate, {
        inputRange: [0, 1],
        outputRange: [0, -15],
      }),
    };
    const titleStyle = [
      {
        opacity: interpolate(this.animatedOpacity, {
          inputRange: [0, 0.8, 1],
          outputRange: [0, 0, 1],
        }),
        width: interpolate(this.animatedTranslate, {
          inputRange: [0, 1],
          outputRange: [
            this.state.titleOriginWidth,
            this.state.titleOriginWidth + (15 + 7) * (RIGHT_BUTTONS.length - 1),
          ],
        }),
      },
    ];

    return (
      <Container style={styles.container}>
        <Animated.View style={[styles.background, backgroundStyle]} />
        <SafeAreaView style={styles.mainWrapper}>
          <Container row style={styles.mainContainer}>
            <OverlayIconButton
              iconName={this.iconName}
              backgroundStyle={this.iconBackgroundStyle}
              contentOverlayStyle={[this.contentOverlayStyle, styles.backIcon]}
              iconStyle={[this.iconStyle, styles.backIcon]}
              wrapperStyle={[styles.backBtn, narrowLeftGapStyle]}
              onPress={Actions.pop}
            />

            <Container flex center onLayout={this.handleTitleContainerLayout}>
              <Animated.Text
                style={[styles.title, titleStyle]}
                numberOfLines={2}>
                {this.props.title}
              </Animated.Text>
            </Container>

            <Container row>{this.renderRightButtons()}</Container>
          </Container>
        </SafeAreaView>
      </Container>
    );
  }
}

export default Header;
