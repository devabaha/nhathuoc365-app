import React, {Component} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableHighlight,
} from 'react-native';
// import Animated, { Easing, interpolate } from 'react-native-reanimated';
import {CategoryProps} from '.';
//@ts-ignore
import appConfig from 'app-config';

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  activeMask: {
    backgroundColor: appConfig.colors.primary,
    position: 'absolute',
    borderRadius: 100,
    width: '100%',
    height: '100%',
  },
  container: {
    width: appConfig.device.width / 4,
    height: appConfig.device.width / 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  imageContainer: {
    width: '55%',
    height: '55%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  title: {
    marginTop: '5%',
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  maskTitle: {
    position: 'absolute',
  },
});

class Category extends Component<CategoryProps> {
  static defaultProps = {
    isActive: false,
    numberOfLines: 2,
    onPress: () => {},
  };

  state = {};
  animatedActiveValue = new Animated.Value(0);

  shouldComponentUpdate(nextProps: CategoryProps, nextState: any) {
    if (nextProps.isActive !== this.props.isActive) {
      this.animateActive(nextProps.isActive ? 1 : 0);
    }

    if (nextState !== this.state) {
      return true;
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.animateActive(this.props.isActive ? 1 : 0);
  }

  animateActive(toValue) {
    Animated.timing(this.animatedActiveValue, {
      toValue,
      duration: 200,
      easing: Easing.quad,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const activeContainerStyle = {
      opacity: this.animatedActiveValue,
      transform: [
        {
          scale: this.animatedActiveValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1.5],
          }),
        },
      ],
    };
    // const activeContainerStyle = {
    //     opacity: this.animatedActiveValue,
    //     transform: [{
    //         scale: interpolate(this.animatedActiveValue, {
    //             inputRange: [0, 1],
    //             outputRange: [0, 1.5],
    //             // extrapolate: Extrapolate.CLAMP
    //         })
    //     }]
    // };
    const activeTitleStyle = {
      opacity: this.animatedActiveValue,
      color: '#fff',
    };
    return (
      <View style={styles.wrapper}>
        <>
          <Animated.View
            style={[
              styles.activeMask,
              //@ts-ignore
              activeContainerStyle,
            ]}
          />
          <TouchableHighlight
            style={[styles.container, this.props.containerStyle]}
            disabled={this.props.disabled}
            underlayColor="#e5e5e5"
            onPress={this.props.onPress}>
            <>
              {!!this.props.image && (
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={{uri: this.props.image}}
                  />
                </View>
              )}
              {!!this.props.title && (
                <View>
                  <Text
                    numberOfLines={this.props.numberOfLines}
                    style={[
                      styles.title,
                      // activeTitleStyle,
                      this.props.titleStyle,
                    ]}>
                    {this.props.title}
                  </Text>
                  <Animated.Text
                    numberOfLines={this.props.numberOfLines}
                    style={[
                      styles.maskTitle,
                      styles.title,
                      activeTitleStyle,
                      this.props.titleStyle,
                    ]}>
                    {this.props.title}
                  </Animated.Text>
                </View>
              )}
              {this.props.children}
            </>
          </TouchableHighlight>
        </>
      </View>
    );
  }
}

export default Category;
