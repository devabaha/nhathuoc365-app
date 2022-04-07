import React, {Component} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// constants
import {WIDTH} from '../../../constants';
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

const styles = StyleSheet.create({
  deepLoading: {
    width: WIDTH,
    textAlign: 'center',
    // position: 'absolute',
    height: 25,
    paddingVertical: 5,
  },
});

class LoadMore extends Component<any> {
  state = {
    animatedLoading: new Animated.Value(0),
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.loading !== this.props.loading) {
      Animated.timing(this.state.animatedLoading, {
        toValue: nextProps.loading ? 1 : 0,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
        duration: 300,
      }).start();
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  render() {
    const extraStyle = this.props.top
      ? {top: 0}
      : this.props.bottom
      ? {bottom: 0}
      : null;

    return (
      <Typography
        animated
        type={TypographyType.LABEL_SEMI_MEDIUM}
        style={[
          styles.deepLoading,
          extraStyle,
          // @ts-ignore
          {
            opacity: this.state.animatedLoading,
          },
        ]}>
        {this.props.t('loadingMore')}
      </Typography>
    );
  }
}

export default withTranslation('chat')(LoadMore);
