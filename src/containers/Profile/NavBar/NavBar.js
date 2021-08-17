import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import ProfileContext from '../ProfileContext';
import RightButtonNavBar from 'src/components/RightButtonNavBar';
import {RIGHT_BUTTON_TYPE} from 'src/components/RightButtonNavBar/constants';

class NavBar extends Component {
  static contextType = ProfileContext;
  state = {};

  render() {
    const {animatedScroll, animatedInputRange, isMainUser} = this.context;
    const animatedBackgroundMaskStyle = {
      opacity: animatedScroll.interpolate({
        inputRange: animatedInputRange,
        outputRange: [0, 1],
      }),
    };
    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.maskBackground, animatedBackgroundMaskStyle]}
        />
        <SafeAreaView style={styles.wrapper}>
          <TouchableOpacity onPress={Actions.pop} hitSlop={HIT_SLOP}>
            <Icon name="arrowleft" style={styles.icon} />
          </TouchableOpacity>
          <Animated.Text style={[styles.title, animatedBackgroundMaskStyle]}>
            {this.props.title}
          </Animated.Text>
          <View style={styles.right}>
            {isMainUser ? (
              <>
                <TouchableOpacity
                  onPress={this.props.onEdit}
                  hitSlop={HIT_SLOP}>
                  <Icon name="edit" style={styles.icon} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={this.props.onLogout}
                  hitSlop={HIT_SLOP}>
                  <Icon name="logout" style={styles.icon} />
                </TouchableOpacity>
              </>
            ) : (
              <RightButtonNavBar
                type={RIGHT_BUTTON_TYPE.CHAT}
                iconStyle={styles.icon}
                iconBundle="AntDesign"
                iconName="message1"
                touchableOpacity
                onPress={this.props.onChat}
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 999,
    width: '100%',
    overflow: 'hidden',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    paddingLeft: 30,
    fontWeight: '500',
    flex: 1,
    color: '#fff',
    fontSize: 20,
    letterSpacing: 1,
  },
  maskBackground: {
    position: 'absolute',
    backgroundColor: appConfig.colors.primary,
    width: '100%',
    height: '100%',
  },
  right: {
    flexDirection: 'row',
  },
  icon: {
    fontSize: 22,
    color: '#fff',
    ...elevationShadowStyle(7),
    marginHorizontal: 10,
    paddingVertical: 15,
  },
});

export default NavBar;
