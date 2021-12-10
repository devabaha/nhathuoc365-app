import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal as ModalRN,
} from 'react-native';
// 3-party libs
import PropTypes from 'prop-types';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography, TextButton, Container} from 'src/components/base';

const defaultListener = () => {};

class Modal extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    visible: PropTypes.bool,
    otherClose: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    onCancel: PropTypes.func,
    onRequestClose: PropTypes.func,
    onOk: PropTypes.func,
    titleStyle: PropTypes.any,
    contentStyle: PropTypes.any,
  };

  static defaultProps = {
    visible: false,
    otherClose: false,
    title: '',
    content: '',
    okText: '',
    cancelText: '',
    onCancel: defaultListener,
    onRequestClose: defaultListener,
    onOk: defaultListener,
    titleStyle: {},
    contentStyle: {},
  };

  state = {};

  textButtonTypoProps = {type: TypographyType.TITLE_SEMI_LARGE};

  get theme() {
    return getTheme(this);
  }

  get containerStyle() {
    return mergeStyles([styles.wrapper, styles.fullCenter, styles.background], {
      backgroundColor: this.theme.color.overlay60,
    });
  }

  get modalStyle() {
    return mergeStyles(styles.modal, {
      borderRadius: this.theme.layout.borderRadiusHuge,
    });
  }

  get cancelTextStyle() {
    return mergeStyles(styles.cancelText, {
      color: this.theme.color.textTertiary,
    });
  }

  get okTextStyle() {
    return mergeStyles(styles.okText, {
      color: this.theme.color.persistPrimary,
    });
  }

  render() {
    return (
      <ModalRN
        animationType="fade"
        transparent
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}>
        <TouchableWithoutFeedback
          disabled={!!this.props.otherClose}
          style={styles.wrapper}
          onPress={this.props.onRequestClose}>
          <View style={this.containerStyle}>
            <Container style={this.modalStyle}>
              <View style={styles.container}>
                <View style={styles.textContainer}>
                  <Typography
                    type={TypographyType.TITLE_LARGE}
                    style={[styles.title, this.props.titleStyle]}>
                    {this.props.title}
                  </Typography>
                  <Typography
                    type={TypographyType.TITLE_SEMI_LARGE}
                    style={[styles.content, this.props.contentStyle]}>
                    {this.props.content}
                  </Typography>
                </View>

                <View style={styles.footer}>
                  {!!this.props.cancelText && (
                    <TextButton
                      style={[styles.btn]}
                      onPress={this.props.onCancel}
                      titleStyle={styles.cancelText}
                      typoProps={this.textButtonTypoProps}
                      titleStyle={this.cancelTextStyle}>
                      {this.props.cancelText}
                    </TextButton>
                  )}
                  <TextButton
                    style={[styles.btn]}
                    onPress={this.props.onOk}
                    typoProps={this.textButtonTypoProps}
                    titleStyle={this.okTextStyle}>
                    {this.props.okText}
                  </TextButton>
                </View>
              </View>
            </Container>
          </View>
        </TouchableWithoutFeedback>
      </ModalRN>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  fullCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'center',
    width: '90%',
    padding: 15,
  },
  container: {
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 15,
  },
  content: {},
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 40,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cancelText: {},
  okText: {},
});

export default Modal;
