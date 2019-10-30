import React, { Component } from 'react';
import { View, Modal, StyleSheet, Animated } from 'react-native';
import Button from 'react-native-button';
import PropTypes from 'prop-types';
import config from '../../config';
import Header from './Header';

const SHOW_VALUE = 1;
const HIDE_VALUE = 0;
const HIDE_BOTTOM_POSITION = -50;
const SHOW_BUTTON_POSITION = 0;
const ANIMATION_DURATION = 250;

class ModalOverlay extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    transparent: PropTypes.bool,
    children: PropTypes.node,
    onClose: PropTypes.func,
    heading: PropTypes.string
  };

  static defaultProps = {
    visible: false,
    transparent: true,
    children: null,
    onClose: () => {},
    heading: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      sideUp: new Animated.Value(
        props.visible ? SHOW_BUTTON_POSITION : HIDE_BOTTOM_POSITION
      ),
      opacity: new Animated.Value(props.visible ? SHOW_VALUE : HIDE_VALUE)
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        await this.setState({
          visible: true
        });
        this.runAnimation(
          this.state.sideUp,
          SHOW_BUTTON_POSITION,
          ANIMATION_DURATION
        );
        this.runAnimation(this.state.opacity, SHOW_VALUE, ANIMATION_DURATION);
      } else {
        this.runAnimation(this.state.opacity, HIDE_VALUE, ANIMATION_DURATION);
        await this.runAnimation(
          this.state.sideUp,
          HIDE_BOTTOM_POSITION,
          ANIMATION_DURATION
        );
        this.setState({
          visible: false
        });
      }
    }
  }

  runAnimation(animation, toValue, duration, onDone = () => {}) {
    return new Promise(resolve => {
      Animated.timing(animation, { toValue, duration }).start(() => {
        resolve();
        onDone();
      });
    });
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        transparent={this.props.transparent}
        animationType="fade"
        onRequestClose={this.props.onClose}
      >
        <View style={styles.container}>
          <Button
            onPress={this.props.onClose}
            containerStyle={styles.overlayBtn}
          >
            <View />
          </Button>

          <Animated.View
            style={[
              styles.content,
              {
                bottom: this.state.sideUp,
                opacity: this.state.opacity
              }
            ]}
          >
            <Header title={this.props.heading} onClose={this.props.onClose} />

            {this.props.children}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  overlayBtn: {
    flex: 1
  },
  content: {
    position: 'relative',
    backgroundColor: config.colors.white,
    minHeight: 40,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: config.device.bottomSpace
  },
  body: {
    padding: 16
  }
});

export default ModalOverlay;
