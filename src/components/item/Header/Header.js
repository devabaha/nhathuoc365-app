import React, { Component } from 'react';
import { StyleSheet, Animated, SafeAreaView } from 'react-native';
import { Actions } from 'react-native-router-flux';

import appConfig from 'app-config';

import Container from '../../Layout/Container';
import OverlayIconButton from './OverlayIconButton';
import RightButtonNavBar from '../../RightButtonNavBar';
import { RIGHT_BUTTON_TYPE } from '../../RightButtonNavBar/constants';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 999
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    ...elevationShadowStyle(3)
  },
  mainWrapper: {
    width: '100%',
    elevation: 4
  },
  mainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  backIcon: {
    fontSize: 30
    //   color: '#fff'
  },
  title: {
    color: '#333',
    fontWeight: '500',
    fontSize: 15
  },
  containerIconStyle: {
    marginLeft: -5,
    marginRight: -5
  }
});

const ACTIVE_OFFSET_TOP = 100;

class Header extends Component {
  static defaultProps = {
    item: {}
  };

  state = {};

  get iconName() {
    return appConfig.device.isIOS ? 'ios-arrow-back' : 'md-arrow-back';
  }

  get iconBackgroundStyle() {
    return {
      opacity: this.props.animatedValue.interpolate({
        inputRange: [0, ACTIVE_OFFSET_TOP],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      })
    };
  }

  get iconStyle() {
    return {
      transform: [
        {
          scale: this.props.animatedValue.interpolate({
            inputRange: [0, ACTIVE_OFFSET_TOP],
            outputRange: [1, 1.2],
            extrapolate: 'clamp'
          })
        }
      ]
    };
  }

  renderRightButtons() {
    const rightButtons = [
      {
        type: RIGHT_BUTTON_TYPE.CHAT,
        iconName: 'ios-chatbubbles'
      },
      {
        type: RIGHT_BUTTON_TYPE.SHOPPING_CART,
        iconName: 'ios-cart'
      },
      {
        type: RIGHT_BUTTON_TYPE.SHARE,
        iconName: 'ios-redo'
      }
    ];

    return rightButtons.map((btn, index) => {
      const isLast = index === rightButtons.length - 1;
      const narrowRightGapStyle = {
        transform: [
          {
            translateX: this.props.animatedValue.interpolate({
              inputRange: [0, ACTIVE_OFFSET_TOP],
              outputRange: [0, 7 * (rightButtons.length - index)],
              extrapolate: 'clamp'
            })
          }
        ]
      };
      console.log(this.props.item);
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
                contentOverlayStyle={[this.iconBackgroundStyle, this.iconStyle]}
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
      opacity: this.props.animatedValue.interpolate({
        inputRange: [0, ACTIVE_OFFSET_TOP],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      })
    };

    const narrowLeftGapStyle = {
      transform: [
        {
          translateX: this.props.animatedValue.interpolate({
            inputRange: [0, ACTIVE_OFFSET_TOP],
            outputRange: [0, -15],
            extrapolate: 'clamp'
          })
        }
      ]
    };

    // const titleStyle
    return (
      <Container style={styles.container}>
        <Animated.View style={[styles.background, backgroundStyle]} />
        <SafeAreaView style={styles.mainWrapper}>
          <Container row style={styles.mainContainer}>
            <OverlayIconButton
              iconName={this.iconName}
              backgroundStyle={this.iconBackgroundStyle}
              contentOverlayStyle={[this.iconBackgroundStyle, this.iconStyle]}
              containerStyle={narrowLeftGapStyle}
              onPress={Actions.pop}
            />

            <Container flex>
              <Animated.Text
                style={[styles.title, backgroundStyle]}
                numberOfLines={2}
              >
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
