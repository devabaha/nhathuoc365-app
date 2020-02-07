import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal as ModalRN
} from 'react-native';
import PropTypes from 'prop-types';
import appConfig from 'app-config';

const defaultListener = () => {};

class Modal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    onCancel: PropTypes.func,
    onRequestClose: PropTypes.func,
    onOk: PropTypes.func
  };

  static defaultProps = {
    visible: false,
    title: '',
    content: '',
    okText: '',
    cancelText: '',
    onCancel: defaultListener,
    onRequestClose: defaultListener,
    onOk: defaultListener
  };

  state = {};

  render() {
    return (
      <ModalRN
        animationType="fade"
        transparent
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
      >
        <TouchableWithoutFeedback
          style={styles.wrapper}
          onPress={this.props.onRequestClose}
        >
          <View style={[styles.wrapper, styles.fullCenter, styles.background]}>
            <View style={styles.modal}>
              <View style={[styles.container]}>
                <View>
                  <Text style={styles.title}>{this.props.title}</Text>
                  <Text style={styles.content}>{this.props.content}</Text>
                </View>

                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[styles.btn]}
                    onPress={this.props.onCancel}
                  >
                    <Text style={styles.cancelText}>
                      {this.props.cancelText}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn]}
                    onPress={this.props.onOk}
                  >
                    <Text style={styles.okText}>{this.props.okText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ModalRN>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%'
  },
  background: {
    backgroundColor: 'rgba(0,0,0,.6)'
  },
  fullCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    justifyContent: 'center',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15
  },
  container: {
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#404040'
  },
  content: {
    fontSize: 18
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 40
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  cancelText: {
    color: '#a9a9a9',
    fontSize: 18
  },
  okText: {
    color: appConfig.colors.primary,
    fontSize: 18
  }
});

export default Modal;
