import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Animated, {Easing, interpolate} from 'react-native-reanimated';

import appConfig from 'app-config';

import Container from '../../Layout/Container';
import OverlayIconButton from './OverlayIconButton';
import RightButtonNavBar from '../../RightButtonNavBar';
import {RIGHT_BUTTON_TYPE} from '../../RightButtonNavBar/constants';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 999,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    ...elevationShadowStyle(3),
  },
  mainWrapper: {
    width: '100%',
    elevation: 4,
  },
  mainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backIcon: {
    fontSize: 30,
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
    marginLeft: -5,
    marginRight: -5,
  },
});

const ACTIVE_OFFSET_TOP = 100;
const RIGHT_BUTTONS = [
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
  };

  state = {
    titleOriginWidth: 0,
  };
  animatedOpacity = new Animated.Value(0);
  animatedTranslate = new Animated.Value(0);
  animatedScale = new Animated.Value(1);

  get iconName() {
    return appConfig.device.isIOS ? 'ios-arrow-back' : 'md-arrow-back';
  }

  get iconBackgroundStyle() {
    return {
      opacity: interpolate(this.animatedOpacity, {
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    };
  }

  get iconStyle() {
    return {
      opacity: this.animatedOpacity,
    };
  }

  get iconOverlayStyle() {
    return {
      transform: [
        {
          scale: interpolate(this.animatedScale, {
            inputRange: [0, 1],
            outputRange: [1, 1.1],
          }),
          // scale: this.animatedScale.interpolate({
          //   inputRange: [0, 1],
          //   outputRange: [1, 1.1],
          // }),
        },
      ],
    };
  }

  componentDidMount() {
    this.props.animatedValue.addListener(this.scrollListener);
  }

  componentWillUnmount() {
    this.props.animatedValue.removeListener(this.scrollListener);
  }

  animatingScrollDown = false;
  animatingScrollUp = false;
  animationDuration = 250;
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

  renderRightButtons() {
    return RIGHT_BUTTONS.map((btn, index) => {
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
            icon={
              <OverlayIconButton
                iconName={btn.iconName}
                containerStyle={!isLast && styles.containerIconStyle}
                backgroundStyle={this.iconBackgroundStyle}
                contentOverlayStyle={[
                  this.iconBackgroundStyle,
                  this.iconOverlayStyle,
                ]}
                iconStyle={this.iconStyle}
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
              contentOverlayStyle={[
                this.iconBackgroundStyle,
                this.iconOverlayStyle,
              ]}
              iconStyle={this.iconStyle}
              wrapperStyle={narrowLeftGapStyle}
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
