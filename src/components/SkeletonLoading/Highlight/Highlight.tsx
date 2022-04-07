import React, {Component} from 'react';
import {Animated, Easing} from 'react-native';
// 3-party libs
import LinearGradient from 'react-native-linear-gradient';
// types
import {SkeletonLoadingProps} from '..';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {hexToRgba} from 'app-helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

class Highlight extends Component<SkeletonLoadingProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    style: {},
  };

  state = {
    highlightAnimated: new Animated.Value(this.props.start),
  };

  get theme() {
    return getTheme(this);
  }

  get highlightColor() {
    const color = this.props.highlightColor || this.theme.color.surface;
    const opacity = this.props.highlightOpacity || 0.4;
    return [
      hexToRgba(color, 0),
      hexToRgba(color, opacity),
      hexToRgba(color, opacity),
      hexToRgba(color, 0),
    ];
  }

  shouldComponentUpdate(nextProps: SkeletonLoadingProps, nextState) {
    if (nextProps.width !== this.props.width) {
      this.state.highlightAnimated.stopAnimation();
      this.animate(nextProps);
    }

    return true;
  }

  componentDidMount() {
    this.animate();
  }

  // componentDidUpdate(prevProps: SkeletonLoadingProps, prevState) {
  //     if(prevProps.width !== this.props.width){
  //         this.state.highlightAnimated.stopAnimation();
  //         this.animate();
  //     }
  // }

  animate(props = this.props) {
    const speed = props.highlightMainDuration;
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.highlightAnimated, {
          toValue: props.end,
          duration: speed,
          easing: Easing.cubic,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.highlightAnimated, {
          toValue: props.start,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.highlightAnimated, {
          toValue: props.end,
          duration: speed * 0.75,
          easing: Easing.cubic,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.highlightAnimated, {
          toValue: props.start,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ]),
    ).start();
  }

  render() {
    const {width, height, style, highlightColor} = this.props;
    const animatedStyle = {
      transform: [{translateX: this.state.highlightAnimated}],
    };
    const containerStyle = [{width, height}, style, animatedStyle];

    return (
      <AnimatedLinearGradient
        style={containerStyle}
        colors={this.highlightColor}
        locations={[0.15, 0.45, 0.55, 0.85]}
        useAngle
        angle={90}
      />
    );
  }
}

export default Highlight;
