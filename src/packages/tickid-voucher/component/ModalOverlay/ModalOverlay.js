import React, {Component} from 'react';
import {View, Modal, StyleSheet, Animated} from 'react-native';
import PropTypes from 'prop-types';
// configs
import config from '../../config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import {BaseButton, Container} from 'src/components/base';
import Header from './Header';

const SHOW_VALUE = 1;
const HIDE_VALUE = 0;
const HIDE_BOTTOM_POSITION = -50;
const SHOW_BUTTON_POSITION = 0;
const ANIMATION_DURATION = 250;

class ModalOverlay extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    hideCloseTitle: PropTypes.bool,
    visible: PropTypes.bool,
    transparent: PropTypes.bool,
    children: PropTypes.node,
    onClose: PropTypes.func,
    heading: PropTypes.string,
  };

  static defaultProps = {
    hideCloseTitle: false,
    visible: false,
    transparent: true,
    children: null,
    onClose: () => {},
    heading: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      sideUp: new Animated.Value(
        props.visible ? SHOW_BUTTON_POSITION : HIDE_BOTTOM_POSITION,
      ),
      opacity: new Animated.Value(props.visible ? SHOW_VALUE : HIDE_VALUE),
    };
  }

  get theme() {
    return getTheme(this);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        await this.setState({
          visible: true,
        });
        this.runAnimation(
          this.state.sideUp,
          SHOW_BUTTON_POSITION,
          ANIMATION_DURATION,
        );
        this.runAnimation(this.state.opacity, SHOW_VALUE, ANIMATION_DURATION);
      } else {
        this.runAnimation(this.state.opacity, HIDE_VALUE, ANIMATION_DURATION);
        await this.runAnimation(
          this.state.sideUp,
          HIDE_BOTTOM_POSITION,
          ANIMATION_DURATION,
        );
        this.setState({
          visible: false,
        });
      }
    }
  }

  runAnimation(animation, toValue, duration, onDone = () => {}) {
    return new Promise((resolve) => {
      Animated.timing(animation, {toValue, duration}).start(() => {
        resolve();
        onDone();
      });
    });
  }

  get containerStyle() {
    return mergeStyles(styles.container, {
      backgroundColor: this.theme.color.overlay60,
    });
  }

  get contentStyle() {
    return mergeStyles(styles.content, {
      borderTopLeftRadius: this.theme.layout.borderRadiusSmall,
      borderTopRightRadius: this.theme.layout.borderRadiusSmall,
    });
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        transparent={this.props.transparent}
        animationType="fade"
        onRequestClose={this.props.onClose}>
        <View style={this.containerStyle}>
          <BaseButton
            onPress={this.props.onClose}
            style={styles.overlayBtn}></BaseButton>

          <Container
            animated
            style={[
              this.contentStyle,
              {
                bottom: this.state.sideUp,
                opacity: this.state.opacity,
              },
            ]}>
            <Header
              title={this.props.heading}
              onClose={this.props.onClose}
              hideCloseTitle={this.props.hideCloseTitle}
            />

            {this.props.children}
          </Container>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayBtn: {
    flex: 1,
  },
  content: {
    position: 'relative',
    minHeight: 40,
  },
});

export default ModalOverlay;
