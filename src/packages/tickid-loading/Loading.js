import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { LoadingEntity } from './state';

const connector = connect(
  state => ({
    isLoading: LoadingEntity.fromState(state).isLoading
  }),
  null
);

class Loading extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    isLoading: false
  };

  render() {
    if (!this.props.isLoading) {
      return null;
    }
    return <MyActivityIndicator />;
  }
}

class MyActivityIndicator extends PureComponent {
  state = {
    fadeIn: new Animated.Value(0)
  };

  componentDidMount() {
    Animated.timing(this.state.fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.loadingWrapper,
            {
              opacity: this.state.fadeIn
            }
          ]}
        >
          <ActivityIndicator color="#fff" size="large" />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 69,
    height: 69,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 5
  }
});

export default connector(Loading);
